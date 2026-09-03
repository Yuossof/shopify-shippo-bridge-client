import { ArrowUpRight, MapPin, Package, PackageCheck, Truck, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const workspaces = [
  { title: 'Orders', description: 'Review incoming orders and prepare them for fulfillment.', icon: Package, href: '/orders', status: '16 awaiting action' },
  { title: 'Shipments', description: 'Track labels, delivery progress, and shipment history.', icon: Truck, href: '/shipments', status: 'Live tracking' },
  { title: 'Ready to pick', description: 'Move prepared orders into your pickup workflow.', icon: PackageCheck, href: '/pickup', status: '16 ready' },
  { title: 'Addresses', description: 'Keep saved shipping and pickup locations organized.', icon: MapPin, href: '/addresses', status: 'Address book' },
]

export default function Dashboard() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <section className="surface-elevated flex flex-col justify-between gap-6 overflow-hidden rounded-2xl border bg-card p-6 sm:p-8 lg:flex-row lg:items-end">
        <div className="flex max-w-2xl flex-col gap-3">
          <Badge variant="secondary" className="w-fit gap-2"><Zap data-icon="inline-start" /> Fulfillment workspace</Badge>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Everything in motion, at a glance.</h1>
          <p className="text-pretty leading-6 text-muted-foreground">A focused command center for turning storefront orders into smooth, trackable deliveries.</p>
        </div>
        <Link to="/orders" className="w-full sm:w-fit"><Button className="w-full">Review orders <ArrowUpRight data-icon="inline-end" /></Button></Link>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Workspace overview">
        {workspaces.map(({ title, description, icon: Icon, href, status }) => (
          <Card key={title} className="surface-elevated group transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg">
            <CardHeader className="gap-4"><div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon /></div><div className="flex flex-col gap-1"><CardTitle className="text-base">{title}</CardTitle><CardDescription className="leading-5">{description}</CardDescription></div></CardHeader>
            <CardContent className="flex items-center justify-between gap-3 pt-0"><span className="text-sm text-muted-foreground">{status}</span><Link to={href} aria-label={`Open ${title}`}><Button variant="ghost" size="icon" aria-label={`Open ${title}`}><ArrowUpRight /></Button></Link></CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card><CardHeader><CardTitle>Today&apos;s workflow</CardTitle><CardDescription>A calm, clear path through your fulfillment queue.</CardDescription></CardHeader><CardContent className="flex flex-col gap-4"><div className="flex items-center justify-between border-b pb-4"><span className="text-sm">Orders to review</span><span className="font-semibold">16</span></div><div className="flex items-center justify-between border-b pb-4"><span className="text-sm">Shipments in transit</span><span className="font-semibold">Active</span></div><div className="flex items-center justify-between"><span className="text-sm">Next step</span><Link to="/pickup" className="text-sm font-medium text-primary underline-offset-4 hover:underline">Open pickup queue <ArrowUpRight data-icon="inline-end" /></Link></div></CardContent></Card>
        <Card className="surface-elevated border-primary/20 bg-card"><CardHeader><div className="flex items-center gap-2"><div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><Zap /></div><CardTitle>Keep your rules close</CardTitle></div><CardDescription>Automate the repetitive decisions with shipping rules that fit your operation.</CardDescription></CardHeader><CardContent><Link to="/shipping-rules"><Button>Manage rules <ArrowUpRight data-icon="inline-end" /></Button></Link></CardContent></Card>
      </section>
    </main>
  )
}
