// Server-side checkout: re-prices the cart, validates the coupon,
// inserts the order + items using the service role, and dispatches
// confirmation emails. Clients NEVER provide totals or discounts.
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

const SHIPPING_FEE = 19.9
const FREE_SHIPPING_THRESHOLD = 199

type CartItemInput = { product_id: string; quantity: number }

function isUuid(v: unknown): v is string {
  return typeof v === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v)
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const adminEmail = Deno.env.get('ADMIN_NOTIFICATION_EMAIL') || ''

  // 1. Authenticate
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  })
  const { data: userData, error: userErr } = await userClient.auth.getUser()
  if (userErr || !userData?.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
  const user = userData.user

  // 2. Parse + validate input
  let body: any
  try { body = await req.json() } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const itemsInput: CartItemInput[] = Array.isArray(body?.items) ? body.items : []
  const couponCodeRaw = typeof body?.couponCode === 'string' ? body.couponCode.trim().toUpperCase() : null

  if (itemsInput.length === 0 || itemsInput.length > 50) {
    return new Response(JSON.stringify({ error: 'Invalid cart' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const cleanItems: CartItemInput[] = []
  for (const it of itemsInput) {
    const qty = Number(it?.quantity)
    if (!isUuid(it?.product_id) || !Number.isInteger(qty) || qty < 1 || qty > 99) {
      return new Response(JSON.stringify({ error: 'Invalid item' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    cleanItems.push({ product_id: it.product_id, quantity: qty })
  }
  if (couponCodeRaw && (couponCodeRaw.length > 32 || !/^[A-Z0-9_-]+$/.test(couponCodeRaw))) {
    return new Response(JSON.stringify({ error: 'Invalid coupon code' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // 3. Service-role queries
  const admin = createClient(supabaseUrl, serviceKey)

  // Fetch authoritative product prices
  const productIds = [...new Set(cleanItems.map((i) => i.product_id))]
  const { data: products, error: prodErr } = await admin
    .from('products')
    .select('id, name, image_url, price, active, stock')
    .in('id', productIds)

  if (prodErr || !products) {
    console.error('Product lookup failed', prodErr)
    return new Response(JSON.stringify({ error: 'Could not load products' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const productMap = new Map(products.map((p) => [p.id, p]))
  let subtotal = 0
  const orderItemsPayload: Array<{
    product_id: string; product_name: string; product_image: string | null;
    unit_price: number; quantity: number; subtotal: number;
  }> = []
  const emailItems: Array<{ name: string; quantity: number; subtotal: number }> = []

  for (const it of cleanItems) {
    const p = productMap.get(it.product_id)
    if (!p || !p.active) {
      return new Response(JSON.stringify({ error: 'Product unavailable' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    if (typeof p.stock === 'number' && p.stock < it.quantity) {
      return new Response(JSON.stringify({ error: `Out of stock: ${p.name}` }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    const lineSubtotal = Number(p.price) * it.quantity
    subtotal += lineSubtotal
    orderItemsPayload.push({
      product_id: p.id,
      product_name: p.name,
      product_image: p.image_url ?? null,
      unit_price: Number(p.price),
      quantity: it.quantity,
      subtotal: lineSubtotal,
    })
    emailItems.push({ name: p.name, quantity: it.quantity, subtotal: lineSubtotal })
  }

  // 4. Validate coupon server-side
  let discount = 0
  let appliedCouponCode: string | null = null
  if (couponCodeRaw) {
    const { data: coupon } = await admin
      .from('coupons')
      .select('code, discount, min_total, active')
      .eq('code', couponCodeRaw)
      .eq('active', true)
      .maybeSingle()
    if (!coupon) {
      return new Response(JSON.stringify({ error: 'Cupom inválido' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    if (subtotal < Number(coupon.min_total)) {
      return new Response(JSON.stringify({ error: 'Cupom não atinge o mínimo' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    discount = subtotal * Number(coupon.discount)
    appliedCouponCode = coupon.code
  }

  const shipping = subtotal === 0 ? 0 : (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE)
  const total = Math.max(0, subtotal - discount + shipping)

  // Round to 2 decimals
  const round2 = (n: number) => Math.round(n * 100) / 100
  const subtotalR = round2(subtotal)
  const discountR = round2(discount)
  const shippingR = round2(shipping)
  const totalR = round2(total)

  // 5. Resolve customer name from profile (do not trust client metadata)
  const { data: profile } = await admin
    .from('profiles').select('full_name, email').eq('id', user.id).maybeSingle()
  const customerName = profile?.full_name || user.email?.split('@')[0] || 'Cliente'
  const customerEmail = profile?.email || user.email || null

  // 6. Insert order + items
  const { data: order, error: orderErr } = await admin
    .from('orders')
    .insert({
      user_id: user.id,
      status: 'paid',
      subtotal: subtotalR,
      discount: discountR,
      shipping: shippingR,
      total: totalR,
      coupon_code: appliedCouponCode,
      payment_method: 'simulated',
      customer_email: customerEmail,
      customer_name: customerName,
    })
    .select('id')
    .single()
  if (orderErr || !order) {
    console.error('Order insert failed', orderErr)
    return new Response(JSON.stringify({ error: 'Could not create order' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const itemsRows = orderItemsPayload.map((i) => ({ ...i, order_id: order.id }))
  const { error: itemsErr } = await admin.from('order_items').insert(itemsRows)
  if (itemsErr) {
    console.error('Order items insert failed', itemsErr)
    return new Response(JSON.stringify({ error: 'Could not create order items' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // 7. Dispatch emails server-side (service role; no client-controlled recipients)
  const sendEmail = async (templateName: string, recipientEmail: string, templateData: Record<string, unknown>, idempotencyKey: string) => {
    try {
      await admin.functions.invoke('send-transactional-email', {
        body: { templateName, recipientEmail, idempotencyKey, templateData },
      })
    } catch (e) {
      console.error('Email dispatch failed', templateName, e)
    }
  }

  const emailPromises: Promise<unknown>[] = []
  if (customerEmail) {
    emailPromises.push(sendEmail('order-confirmation', customerEmail, {
      customerName, orderId: order.id, items: emailItems,
      subtotal: subtotalR, discount: discountR, shipping: shippingR, total: totalR,
    }, `order-confirm-${order.id}`))
  }
  if (adminEmail) {
    emailPromises.push(sendEmail('admin-new-order', adminEmail, {
      customerName, customerEmail, orderId: order.id, items: emailItems,
      subtotal: subtotalR, discount: discountR, shipping: shippingR, total: totalR,
      couponCode: appliedCouponCode,
    }, `order-admin-${order.id}`))
  }
  await Promise.allSettled(emailPromises)

  return new Response(JSON.stringify({
    success: true,
    orderId: order.id,
    subtotal: subtotalR, discount: discountR, shipping: shippingR, total: totalR,
    couponCode: appliedCouponCode,
  }), {
    status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
