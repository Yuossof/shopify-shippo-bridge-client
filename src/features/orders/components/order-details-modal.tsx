import {
  Calendar,
  MapPin,
  User,
  X,
  Mail,
  Phone,
  Building2,
  Loader2,
  AlertCircle,
  Package,
  Receipt,
} from "lucide-react"
import OrderStatusBadge from "./order-status-badge"
import { calculateTotal, formatDate } from "../orders.utils"
import { Order } from "../types/orders.types"
import { useEffect, useState } from "react"
import { getAddressService } from "@/services/shippo/addresses"
import { getOrderService } from "../services/get_order"
import { OrderLineItem } from "@/shared/types/order"

export type ShippoAddress = {
  object_created: string
  object_updated: string
  object_id: string
  is_complete: boolean
  validation_results: { is_valid: boolean; messages: any[] }
  object_owner: string
  name: string
  company: string
  street_no: string
  street1: string
  street2: string
  street3: string
  city: string
  state: string
  zip: string
  country: string
  longitude: number
  latitude: number
  phone: string
  email: string
  is_residential: boolean
  metadata: string
  test: boolean
  is_confirmed_by_user: boolean | null
}

type OrderDetailsModalProps = {
  order: Order | null
  onClose: () => void
}

type Tone = "blue" | "violet" | "emerald" | "amber"

const TONE_CLASSES: Record<Tone, string> = {
  blue: "bg-blue-500/10 text-blue-600",
  violet: "bg-violet-500/10 text-violet-600",
  emerald: "bg-emerald-500/10 text-emerald-600",
  amber: "bg-amber-500/10 text-amber-600",
}

const addressCache = new Map<string, ShippoAddress>();
const itemsCache = new Map<string, OrderLineItem[]>();

const formatMoney = (amount: string | number, currency?: string) => {
  const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount
  if (Number.isNaN(numericAmount)) return String(amount)
  if (!currency) return numericAmount.toFixed(2)
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(numericAmount)
  } catch {
    return `${numericAmount.toFixed(2)} ${currency}`
  }
}

const getInitials = (name?: string) => {
  if (!name) return "?"
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

const SectionHeader = ({
  icon: Icon,
  label,
  tone,
}: {
  icon: React.ElementType
  label: string
  tone: Tone
}) => (
  <div className="flex items-center gap-2">
    <span className={`flex h-6 w-6 items-center justify-center rounded-md ${TONE_CLASSES[tone]}`}>
      <Icon className="h-3.5 w-3.5" />
    </span>
    <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</h3>
  </div>
)

const LineItemRow = ({ item, isLast }: { item: OrderLineItem; isLast: boolean }) => (
  <div
    className={`flex items-center gap-3 p-3 transition-colors hover:bg-muted/40 ${!isLast ? "border-b border-border/70" : ""
      }`}
  >
    <img
      src={item.imageUrl}
      alt={item.title}
      className="h-14 w-14 shrink-0 rounded-lg border border-border bg-muted object-cover"
    />
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-semibold text-(--text-h)">{item.title}</p>
      <p className="text-xs text-muted-foreground">SKU: {item.sku || "—"}</p>
    </div>
    <div className="shrink-0 text-right">
      <p className="text-sm font-semibold text-(--text-h)">{formatMoney(item.price, item.currency)}</p>
      <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
    </div>
  </div>
)

const OrderDetailsModal = ({ order, onClose }: OrderDetailsModalProps) => {
  const [address, setAddress] = useState<ShippoAddress | null>(null)
  const [isLoadingAddress, setIsLoadingAddress] = useState(false)

  const [orderItems, setOrderItems] = useState<OrderLineItem[]>([])
  const [isLoadingItems, setIsLoadingItems] = useState(false)
  const [itemsError, setItemsError] = useState(false)

  useEffect(() => {
    if (!order?.shipToAddressId) return

    const addressId = order.shipToAddressId as string

    if (addressCache.has(addressId)) {
      setAddress(addressCache.get(addressId)!)
      return
    }

    const getAddress = async () => {
      setIsLoadingAddress(true)
      try {
        const data = await getAddressService(addressId)
        addressCache.set(addressId, data) 
        setAddress(data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoadingAddress(false)
      }
    }

    getAddress()
  }, [order?.shipToAddressId])

  useEffect(() => {
    if (!order?.shopifyOrderId) return

    const shopifyId = order.shopifyOrderId as string

    if (itemsCache.has(shopifyId)) {
      setOrderItems(itemsCache.get(shopifyId)!)
      return
    }

    const getOrder = async () => {
      setIsLoadingItems(true)
      setItemsError(false)
      try {
        const data = await getOrderService(shopifyId)
        itemsCache.set(shopifyId, data) 
        setOrderItems(data)
      } catch (error) {
        console.error(error)
        setItemsError(true)
      } finally {
        setIsLoadingItems(false)
      }
    }

    getOrder()
  }, [order?.shopifyOrderId])

  if (!order) return null

  // Single source of truth for the total: prefer freshly-fetched line items,
  // fall back to the order snapshot if the fetch failed or hasn't resolved yet.
  const hasFetchedItems = orderItems.length > 0
  const displayTotal = hasFetchedItems
    ? orderItems.reduce((sum, item) => sum + parseFloat(item.price || "0") * (item.quantity || 0), 0)
    : calculateTotal(order.orderItems)
  const displayCurrency = hasFetchedItems
    ? orderItems[0]?.currency
    : order.orderItems?.[0]?.price_set?.shop_money?.currency_code || "USD"

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-background shadow-2xl ring-1 ring-border animate-in zoom-in-95 duration-150"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <h2 className="font-serif text-xl font-bold tracking-tight text-(--text-h)">
                Order #{order.shopifyOrderId}
              </h2>
              <OrderStatusBadge status={order.shippingStatus} />
            </div>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(order.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body — split panel: items on the left, context on the right */}
        <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
          {/* Items */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <SectionHeader
              icon={Package}
              label={`Items (${orderItems.length || order.orderItems?.length || 0})`}
              tone="blue"
            />

            <div className="mt-3">
              {isLoadingItems ? (
                <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-lg border border-border bg-muted/20">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <p className="text-xs font-medium text-muted-foreground">Loading items...</p>
                </div>
              ) : itemsError ? (
                <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  Couldn't load line item details.
                </div>
              ) : orderItems.length > 0 ? (
                <div className="overflow-hidden rounded-lg border border-border">
                  {orderItems.map((item, idx) => (
                    <LineItemRow key={item.lineItemId || idx} item={item} isLast={idx === orderItems.length - 1} />
                  ))}
                </div>
              ) : (
                <p className="py-2 text-xs text-muted-foreground">No line items to show.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full shrink-0 space-y-5 overflow-y-auto border-t border-border bg-muted/20 px-6 py-5 lg:w-75 lg:border-l lg:border-t-0">
            {/* Customer */}
            <div className="space-y-2">
              <SectionHeader icon={User} label="Customer" tone="emerald" />
              <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-600">
                  {getInitials(order.customerName)}
                </span>
                <p className="truncate text-sm font-medium text-(--text-h)">{order.customerName}</p>
              </div>
            </div>

            {/* Shipping */}
            <div className="space-y-2">
              <SectionHeader icon={MapPin} label="Shipping" tone="violet" />

              {isLoadingAddress ? (
                <div className="flex h-24 flex-col items-center justify-center gap-2 rounded-lg border border-border bg-background">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <p className="text-[11px] text-muted-foreground">Loading address...</p>
                </div>
              ) : address ? (
                <div className="space-y-3 rounded-lg border border-border bg-background p-3">
                  <div>
                    <p className="text-sm font-semibold text-(--text-h)">{address.name}</p>
                    {address.company && (
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Building2 className="h-3 w-3 shrink-0" />
                        {address.company}
                      </p>
                    )}
                    <div className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                      <p>{address.street1}</p>
                      {address.street2 && <p>{address.street2}</p>}
                      {address.street3 && <p>{address.street3}</p>}
                      <p>
                        {address.city}, {address.state} {address.zip}
                      </p>
                      <p className="font-medium">{address.country}</p>
                    </div>
                  </div>

                  {(address.email || address.phone) && (
                    <div className="space-y-1.5 border-t border-border/60 pt-2.5">
                      {address.email && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3 shrink-0" />
                          <span className="truncate">{address.email}</span>
                        </div>
                      )}
                      {address.phone && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3 shrink-0" />
                          {address.phone}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="border-t border-border/60 pt-2.5">
                    <code className="select-all break-all font-mono text-[10px] text-muted-foreground/70">
                      {order.shipToAddressId}
                    </code>
                  </div>
                </div>
              ) : order.shipToAddressId ? (
                <div className="rounded-lg border border-border bg-background p-3">
                  <p className="text-xs font-medium text-(--text-h)">Shippo reference only</p>
                  <code className="mt-1 block break-all font-mono text-[10px] text-muted-foreground">
                    {order.shipToAddressId}
                  </code>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No shipping address on file.</p>
              )}
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <SectionHeader icon={Receipt} label="Summary" tone="amber" />
              <div className="space-y-2.5 rounded-lg border border-border bg-background p-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Weight</span>
                  <span className="font-medium text-(--text-h)">{order.totalWeight}g</span>
                </div>
                <div className="flex items-center justify-between border-t border-border/60 pt-2.5">
                  <span className="text-sm font-medium text-(--text-h)">Total</span>
                  <span className="font-serif text-xl font-bold text-primary">
                    {formatMoney(displayTotal, displayCurrency)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailsModal