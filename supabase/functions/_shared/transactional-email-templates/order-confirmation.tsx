/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Aforja Suplementos'

interface OrderItem {
  name: string
  quantity: number
  subtotal: number
}

interface OrderConfirmationProps {
  customerName?: string
  orderId?: string
  items?: OrderItem[]
  subtotal?: number
  discount?: number
  shipping?: number
  total?: number
}

const formatBRL = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)

const OrderConfirmationEmail = ({
  customerName,
  orderId,
  items = [],
  subtotal = 0,
  discount = 0,
  shipping = 0,
  total = 0,
}: OrderConfirmationProps) => {
  const shortId = orderId ? orderId.slice(0, 8).toUpperCase() : ''
  return (
    <Html lang="pt-BR" dir="ltr">
      <Head />
      <Preview>Pedido #{shortId} confirmado — obrigado por comprar na {SITE_NAME}!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={brand}>{SITE_NAME}</Heading>
          </Section>

          <Section style={content}>
            <Heading style={h1}>
              {customerName ? `Obrigado, ${customerName}!` : 'Obrigado pelo seu pedido!'}
            </Heading>
            <Text style={text}>
              Recebemos seu pedido e ele já está sendo preparado. Em breve você receberá
              atualizações sobre o envio.
            </Text>

            {orderId && (
              <Section style={orderBadge}>
                <Text style={orderBadgeLabel}>NÚMERO DO PEDIDO</Text>
                <Text style={orderBadgeValue}>#{shortId}</Text>
              </Section>
            )}

            {items.length > 0 && (
              <>
                <Heading as="h2" style={h2}>Itens do pedido</Heading>
                {items.map((item, idx) => (
                  <Section key={idx} style={itemRow}>
                    <Text style={itemName}>
                      {item.name} <span style={itemQty}>× {item.quantity}</span>
                    </Text>
                    <Text style={itemPrice}>{formatBRL(item.subtotal)}</Text>
                  </Section>
                ))}
                <Hr style={hr} />
                <Section style={totalsBox}>
                  <Section style={totalRow}>
                    <Text style={totalLabel}>Subtotal</Text>
                    <Text style={totalValue}>{formatBRL(subtotal)}</Text>
                  </Section>
                  {discount > 0 && (
                    <Section style={totalRow}>
                      <Text style={totalLabel}>Desconto</Text>
                      <Text style={totalValueDiscount}>-{formatBRL(discount)}</Text>
                    </Section>
                  )}
                  <Section style={totalRow}>
                    <Text style={totalLabel}>Frete</Text>
                    <Text style={totalValue}>
                      {shipping === 0 ? 'Grátis' : formatBRL(shipping)}
                    </Text>
                  </Section>
                  <Hr style={hr} />
                  <Section style={totalRow}>
                    <Text style={totalLabelBig}>Total</Text>
                    <Text style={totalValueBig}>{formatBRL(total)}</Text>
                  </Section>
                </Section>
              </>
            )}

            <Hr style={hr} />
            <Text style={footerText}>
              Em caso de dúvidas, basta responder a este email — nosso time está pronto
              para te ajudar.
            </Text>
            <Text style={footerSign}>
              Equipe {SITE_NAME}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: OrderConfirmationEmail,
  subject: (data: Record<string, any>) => {
    const id = data.orderId ? data.orderId.slice(0, 8).toUpperCase() : ''
    return id ? `Pedido #${id} confirmado — ${SITE_NAME}` : `Pedido confirmado — ${SITE_NAME}`
  },
  displayName: 'Confirmação de pedido (cliente)',
  previewData: {
    customerName: 'Gabriel',
    orderId: '8f3a1c9e-2b4d-4e7f-a1b2-c3d4e5f6a7b8',
    items: [
      { name: 'Whey Protein Aforja 900g', quantity: 2, subtotal: 358.0 },
      { name: 'Creatina Monohidratada 300g', quantity: 1, subtotal: 89.9 },
    ],
    subtotal: 447.9,
    discount: 44.79,
    shipping: 0,
    total: 403.11,
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif', margin: 0, padding: 0 }
const container = { maxWidth: '560px', margin: '0 auto', padding: '0' }
const header = { backgroundColor: '#0f172a', padding: '28px 32px', textAlign: 'center' as const }
const brand = { color: '#ffffff', fontSize: '22px', fontWeight: 700, margin: 0, letterSpacing: '0.5px' }
const content = { padding: '32px' }
const h1 = { fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: '0 0 12px' }
const h2 = { fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '24px 0 12px' }
const text = { fontSize: '15px', color: '#475569', lineHeight: '1.6', margin: '0 0 20px' }
const orderBadge = { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 18px', margin: '20px 0' }
const orderBadgeLabel = { fontSize: '11px', color: '#64748b', fontWeight: 600, letterSpacing: '0.5px', margin: '0 0 4px' }
const orderBadgeValue = { fontSize: '18px', color: '#0f172a', fontWeight: 700, margin: 0 }
const itemRow = { display: 'flex', justifyContent: 'space-between', padding: '8px 0' }
const itemName = { fontSize: '14px', color: '#0f172a', margin: 0, flex: 1 }
const itemQty = { color: '#64748b', fontSize: '13px' }
const itemPrice = { fontSize: '14px', color: '#0f172a', fontWeight: 600, margin: 0, textAlign: 'right' as const }
const hr = { borderColor: '#e2e8f0', margin: '16px 0' }
const totalsBox = { margin: '8px 0' }
const totalRow = { display: 'flex', justifyContent: 'space-between', padding: '4px 0' }
const totalLabel = { fontSize: '14px', color: '#64748b', margin: 0 }
const totalValue = { fontSize: '14px', color: '#0f172a', margin: 0, textAlign: 'right' as const }
const totalValueDiscount = { fontSize: '14px', color: '#16a34a', margin: 0, textAlign: 'right' as const, fontWeight: 600 }
const totalLabelBig = { fontSize: '16px', color: '#0f172a', fontWeight: 700, margin: 0 }
const totalValueBig = { fontSize: '18px', color: '#0f172a', fontWeight: 700, margin: 0, textAlign: 'right' as const }
const footerText = { fontSize: '13px', color: '#64748b', lineHeight: '1.5', margin: '20px 0 8px' }
const footerSign = { fontSize: '13px', color: '#0f172a', fontWeight: 600, margin: '0 0 8px' }
