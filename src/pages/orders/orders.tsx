import { useCallback, useEffect, useState } from "react"
import { axiosInstance } from "../../lib/axios"
import OrdersLoadingState from "@/features/orders/components/orders-loading-state"
import OrdersErrorState from "@/features/orders/components/orders-error-state"
import OrdersEmptyState from "@/features/orders/components/orders-empty-state"
import OrdersTable from "@/features/orders/components/orders-table"
import OrderDetailsModal from "@/features/orders/components/order-details-modal"
import { Order } from "@/features/orders/types/orders.types"

interface Pagination { total: number; page: number; limit: number; totalPages: number }

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 50, totalPages: 1 })

  const fetchOrders = useCallback(async (page: number = 1, limit: number = 50) => {
    try { setLoading(true); const response = await axiosInstance.get("/orders", { params: { page, limit } }); const data = Array.isArray(response.data) ? response.data : response.data.orders || [response.data]; setOrders(data); if (response.data.pagination) setPagination(response.data.pagination) }
    catch { setError("Failed to load orders. Please check your connection.") } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchOrders(pagination.page) }, [])
  const handlePageChange = (newPage: number) => { setPagination(prev => ({ ...prev, page: newPage })); fetchOrders(newPage, pagination.limit) }
  if (loading) return <OrdersLoadingState />
  if (error) return <OrdersErrorState message={error} onRetry={() => window.location.reload()} />
  if (orders.length === 0) return <OrdersEmptyState />

  return <main className="relative mx-auto flex w-full flex-col gap-8 p-4 sm:p-6 lg:px-8 2xl:max-w-[1800px]" dir="ltr">
    <header className="flex flex-col gap-2 border-b pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-medium text-primary">Fulfillment queue</p><h1 className="text-3xl font-semibold tracking-tight">Orders</h1><p className="mt-1 text-sm text-muted-foreground">Review, prepare, and move storefront orders forward.</p></div><div className="rounded-lg border bg-card px-3 py-2 text-sm text-muted-foreground"><span className="font-semibold text-foreground">{pagination.total}</span> total orders</div></header>
    <OrdersTable orders={orders} onSelectOrder={setSelectedOrder} pagination={pagination} onPageChange={handlePageChange} />
    <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
  </main>
}
export default Orders
