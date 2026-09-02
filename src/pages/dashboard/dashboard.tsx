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
      <section className="flex flex-col justify-between gap-6 rounded-2xl border bg-card p-6 shadow-sm sm:p-8 lg:flex-row lg:items-end">
        <div className="flex max-w-2xl flex-col gap-3">
          <Badge variant="secondary" className="w-fit gap-2"><Zap data-icon="inline-start" /> Fulfillment workspace</Badge>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Everything in motion, at a glance.</h1>
          <p className="text-pretty leading-6 text-muted-foreground">A focused command center for turning storefront orders into smooth, trackable deliveries.</p>
        </div>
        <Button asChild className="w-full sm:w-fit"><Link to="/orders">Review orders <ArrowUpRight data-icon="inline-end" /></Link></Button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Workspace overview">
        {workspaces.map(({ title, description, icon: Icon, href, status }) => (
          <Card key={title} className="group transition-shadow hover:shadow-md">
            <CardHeader className="gap-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon /></div>
              <div className="flex flex-col gap-1"><CardTitle className="text-base">{title}</CardTitle><CardDescription className="leading-5">{description}</CardDescription></div>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-3 pt-0"><span className="text-sm text-muted-foreground">{status}</span><Button variant="ghost" size="icon" asChild aria-label={`Open ${title}`}><Link to={href}><ArrowUpRight /></Link></Button></CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card><CardHeader><CardTitle>Today&apos;s workflow</CardTitle><CardDescription>A calm, clear path through your fulfillment queue.</CardDescription></CardHeader><CardContent className="flex flex-col gap-4"><div className="flex items-center justify-between border-b pb-4"><span className="text-sm">Orders to review</span><span className="font-semibold">16</span></div><div className="flex items-center justify-between border-b pb-4"><span className="text-sm">Shipments in transit</span><span className="font-semibold">Active</span></div><div className="flex items-center justify-between"><span className="text-sm">Next step</span><Button variant="link" className="h-auto p-0" asChild><Link to="/pickup">Open pickup queue <ArrowUpRight data-icon="inline-end" /></Link></Button></div></CardContent></Card>
        <Card className="bg-primary text-primary-foreground"><CardHeader><CardTitle>Keep your rules close</CardTitle><CardDescription className="text-primary-foreground/75">Automate the repetitive decisions with shipping rules that fit your operation.</CardDescription></CardHeader><CardContent><Button variant="secondary" asChild><Link to="/shipping-rules">Manage rules <ArrowUpRight data-icon="inline-end" /></Link></Button></CardContent></Card>
      </section>
    </main>
  )
}
