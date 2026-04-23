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

interface AdminNewOrderProps {
  customerName?: string
  customerEmail?: string
  orderId?: string
  items?: OrderItem[]
  subtotal?: number
  discount?: number
  shipping?: number
  total?: number
  couponCode?: string | null
}

const formatBRL = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)

const AdminNewOrderEmail = ({
  customerName,
  customerEmail,
  orderId,
  items = [],
  subtotal = 0,
  discount = 0,
  shipping = 0,
  total = 0,
  couponCode,
}: AdminNewOrderProps) => {
  const shortId = orderId ? orderId.slice(0, 8).toUpperCase() : ''
  return (
    <Html lang="pt-BR" dir="ltr">
      <Head />
      <Preview>🔔 Novo pedido #{shortId} — {formatBRL(total)}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={alertLabel}>🔔 NOVO PEDIDO</Text>
            <Heading style={brand}>{SITE_NAME} • Admin</Heading>
          </Section>

          <Section style={content}>
            <Section style={highlightCard}>
              <Text style={highlightLabel}>Total do pedido</Text>
              <Text style={highlightValue}>{formatBRL(total)}</Text>
              {orderId && <Text style={highlightId}>Pedido #{shortId}</Text>}
            </Section>

            <Heading as="h2" style={h2}>Cliente</Heading>
            <Section style={infoRow}>
              <Text style={infoLabel}>Nome</Text>
              <Text style={infoValue}>{customerName || '—'}</Text>
            </Section>
            <Section style={infoRow}>
              <Text style={infoLabel}>Email</Text>
              <Text style={infoValue}>{customerEmail || '—'}</Text>
            </Section>
            {couponCode && (
              <Section style={infoRow}>
                <Text style={infoLabel}>Cupom</Text>
                <Text style={infoValue}>{couponCode}</Text>
              </Section>
            )}

            {items.length > 0 && (
              <>
                <Heading as="h2" style={h2}>Itens ({items.length})</Heading>
                {items.map((item, idx) => (
                  <Section key={idx} style={itemRow}>
                    <Text style={itemName}>
                      {item.name} <span style={itemQty}>× {item.quantity}</span>
                    </Text>
                    <Text style={itemPrice}>{formatBRL(item.subtotal)}</Text>
                  </Section>
                ))}
                <Hr style={hr} />
                <Section style={totalRow}>
                  <Text style={totalLabel}>Subtotal</Text>
                  <Text style={totalValue}>{formatBRL(subtotal)}</Text>
                </Section>
                {discount > 0 && (
                  <Section style={totalRow}>
                    <Text style={totalLabel}>Desconto</Text>
                    <Text style={totalValue}>-{formatBRL(discount)}</Text>
                  </Section>
                )}
                <Section style={totalRow}>
                  <Text style={totalLabel}>Frete</Text>
                  <Text style={totalValue}>
                    {shipping === 0 ? 'Grátis' : formatBRL(shipping)}
                  </Text>
                </Section>
                <Section style={totalRow}>
                  <Text style={totalLabelBig}>Total</Text>
                  <Text style={totalValueBig}>{formatBRL(total)}</Text>
                </Section>
              </>
            )}

            <Hr style={hr} />
            <Text style={footerText}>
              Acesse o painel admin para gerenciar o status deste pedido.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: AdminNewOrderEmail,
  subject: (data: Record<string, any>) => {
    const id = data.orderId ? data.orderId.slice(0, 8).toUpperCase() : ''
    const total = typeof data.total === 'number' ? formatBRL(data.total) : ''
    return `🔔 Novo pedido${id ? ` #${id}` : ''}${total ? ` — ${total}` : ''}`
  },
  displayName: 'Novo pedido (admin)',
  previewData: {
    customerName: 'Gabriel Betiol',
    customerEmail: 'cliente@exemplo.com',
    orderId: '8f3a1c9e-2b4d-4e7f-a1b2-c3d4e5f6a7b8',
    items: [
      { name: 'Whey Protein Aforja 900g', quantity: 2, subtotal: 358.0 },
      { name: 'Creatina Monohidratada 300g', quantity: 1, subtotal: 89.9 },
    ],
    subtotal: 447.9,
    discount: 44.79,
    shipping: 0,
    total: 403.11,
    couponCode: 'AFORJA10',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif', margin: 0, padding: 0 }
const container = { maxWidth: '560px', margin: '0 auto', padding: '0' }
const header = { backgroundColor: '#0f172a', padding: '24px 32px', textAlign: 'center' as const }
const alertLabel = { color: '#fbbf24', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', margin: '0 0 4px' }
const brand = { color: '#ffffff', fontSize: '18px', fontWeight: 600, margin: 0 }
const content = { padding: '32px' }
const highlightCard = { background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px', textAlign: 'center' as const, margin: '0 0 24px' }
const highlightLabel = { fontSize: '12px', color: '#64748b', fontWeight: 600, letterSpacing: '0.5px', margin: '0 0 6px' }
const highlightValue = { fontSize: '32px', color: '#0f172a', fontWeight: 800, margin: '0 0 4px' }
const highlightId = { fontSize: '13px', color: '#64748b', margin: 0 }
const h2 = { fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '20px 0 8px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const infoRow = { display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }
const infoLabel = { fontSize: '13px', color: '#64748b', margin: 0 }
const infoValue = { fontSize: '13px', color: '#0f172a', fontWeight: 500, margin: 0, textAlign: 'right' as const }
const itemRow = { display: 'flex', justifyContent: 'space-between', padding: '8px 0' }
const itemName = { fontSize: '14px', color: '#0f172a', margin: 0, flex: 1 }
const itemQty = { color: '#64748b', fontSize: '13px' }
const itemPrice = { fontSize: '14px', color: '#0f172a', fontWeight: 600, margin: 0, textAlign: 'right' as const }
const hr = { borderColor: '#e2e8f0', margin: '12px 0' }
const totalRow = { display: 'flex', justifyContent: 'space-between', padding: '4px 0' }
const totalLabel = { fontSize: '13px', color: '#64748b', margin: 0 }
const totalValue = { fontSize: '13px', color: '#0f172a', margin: 0, textAlign: 'right' as const }
const totalLabelBig = { fontSize: '15px', color: '#0f172a', fontWeight: 700, margin: '6px 0 0' }
const totalValueBig = { fontSize: '17px', color: '#0f172a', fontWeight: 700, margin: '6px 0 0', textAlign: 'right' as const }
const footerText = { fontSize: '12px', color: '#64748b', margin: '16px 0 0', textAlign: 'center' as const }
