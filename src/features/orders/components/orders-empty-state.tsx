import { ShoppingBag } from "lucide-react"

const OrdersEmptyState = () => {
  return (
    <div className="mx-auto my-6 w-full max-w-[1800px] rounded-xl border border-dashed border-border bg-card p-12 text-center shadow-sm">
      <ShoppingBag className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
      <h3 className="text-lg font-semibold text-[var(--text-h)]">No Orders Found</h3>
      <p className="mt-1 text-sm text-muted-foreground">New orders from Shopify will appear here.</p>
    </div>
  )
}

export default OrdersEmptyState