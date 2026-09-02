import { Order } from "./types/orders.types"

export const formatDate = (dateObj?: Order["createdAt"]) => {
  if (!dateObj?.$date) return "N/A"

  return new Date(dateObj.$date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export const calculateTotal = (items?: Order["orderItems"]) => {
  if (!items || items.length === 0) return 0

  return items.reduce((sum, item) => {
    const price = Number.parseFloat(item.price ?? "0")
    const quantity = item.quantity ?? 0

    return sum + price * quantity
  }, 0)
}