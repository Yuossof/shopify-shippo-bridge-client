export type PriceSet = {
  shop_money?: {
    currency_code?: string
  }
}

export type OrderItem = {
  id?: string
  title?: string
  price?: string
  quantity?: number
  vendor?: string
  price_set?: PriceSet,
  grams?: string,
  shopifyLineItemId: string
}

export type Order = {
  _id?: {
    $oid?: string
  }
  shopifyOrderId?: string | number
  createdAt?: {
    $date?: string
  }
  customerName?: string
  storeUrl?: string
  orderItems?: OrderItem[]
  shippingStatus?: string
  shipToAddressId?: string
  totalWeight?: number
}