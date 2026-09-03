// @ts-nocheck
import { useState } from "react"
import {
  IndexTable,
  Card,
  Text,
  Badge,
  Box,
  InlineStack,
  Avatar,
  Button,
  Pagination
} from "@/components/ui/admin-primitives"

import { calculateTotal, formatDate } from "../orders.utils"
import { Order } from "../types/orders.types"
import PrepareOrderModal from "./prepare-order-modal"

interface PaginationInfo {
  total: number
  page: number
  limit: number
  totalPages: number
}

type OrdersTableProps = {
  orders: Order[]
  onSelectOrder: (order: Order) => void
  pagination: PaginationInfo
  onPageChange: (page: number) => void
}

const getInitials = (name?: string) => {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/)
  return (parts[0]?.[0] ?? "").concat(parts[1]?.[0] ?? "").toUpperCase()
}

const OrdersTable = ({ orders, onSelectOrder, pagination, onPageChange }: OrdersTableProps) => {
  const [show, setShow] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const resourceName = {
    singular: 'order',
    plural: 'orders',
  }

  const rowMarkup = orders.map((order, index) => {
    const orderId = order._id?.$oid || order.shopifyOrderId
    const totalAmount = calculateTotal(order.orderItems)
    const currency = order.orderItems?.[0]?.price_set?.shop_money?.currency_code || "USD"

    // 💡 Helper for Shopify Fulfillment Badge Colors
    const getFulfillmentTone = (status?: string | null) => {
      switch (status?.toLowerCase()) {
        case 'fulfilled':
          return 'success'
        case 'partially_fulfilled':
          return 'warning'
        default:
          return 'attention' // unfulfilled / null
      }
    }

    // 💡 Helper for Shippo Shipping Badge Colors
    const getShippingTone = (status?: string) => {
      switch (status?.toLowerCase()) {
        case 'delivered':
          return 'success'
        case 'in_transit':
          return 'progress'
        case 'label_purchased':
          return 'info'
        default:
          return 'subdued' // pending
      }
    }

    return (
      <IndexTable.Row
        id={String(orderId)}
        key={String(orderId)}
        position={index}
        onClick={() => onSelectOrder(order)}
      >
        {/* Order ID */}
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            #{order.shopifyOrderId}
          </Text>
        </IndexTable.Cell>

        {/* Customer */}
        <IndexTable.Cell>
          <InlineStack gap="300" blockAlign="center">
            <Avatar
              size="md"
              name={order.customerName || "Customer"}
              initials={getInitials(order.customerName)}
            />
            <Box>
              <Text variant="bodyMd" fontWeight="semibold" as="span">
                {order.customerName || "No Name"}
              </Text>
              <Box>
                <Text variant="bodyXs" tone="subdued" as="span">
                  {formatDate(order.createdAt)}
                </Text>
              </Box>
            </Box>
          </InlineStack>
        </IndexTable.Cell>

        {/* Store URL */}
        <IndexTable.Cell>
          <Text tone="subdued" as="span">{order.storeUrl}</Text>
        </IndexTable.Cell>

        {/* Items Count */}
        <IndexTable.Cell>
          <div style={{ textAlign: 'center' }}>
            {order.orderItems?.length || 0}
          </div>
        </IndexTable.Cell>

        {/* Total Price */}
        <IndexTable.Cell>
          <div style={{ textAlign: 'right' }}>
            <Text fontWeight="semibold" as="span">
              {totalAmount.toLocaleString()} {currency}
            </Text>
          </div>
        </IndexTable.Cell>

        {/* 💡 Column 1: Fulfillment Status (Shopify) */}
        <IndexTable.Cell>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Badge tone={getFulfillmentTone(order.fulfillmentStatus)}>
              {order.fulfillmentStatus === 'partially_fulfilled'
                ? 'Partial'
                : order.fulfillmentStatus || 'Unfulfilled'}
            </Badge>
          </div>
        </IndexTable.Cell>

        {/* 💡 Column 2: Shipping Status (Shippo) */}
        <IndexTable.Cell>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Badge tone={getShippingTone(order.shippingStatus)}>
              {order.shippingStatus === 'label_purchased'
                ? 'Label Ready'
                : order.shippingStatus || 'Pending'}
            </Badge>
          </div>
        </IndexTable.Cell>

        {/* Action Button */}
        <IndexTable.Cell>
          <div style={{ display: 'flex', justifyContent: 'center' }} onClick={(e) => e.stopPropagation()}>
            <Button
              size="slim"
              // variant="primary"
              onClick={() => {
                setSelectedOrder(order)
                setShow(true)
              }}
            >
              Prepare Order
            </Button>
          </div>
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  })

  return (
    <div dir="ltr" className="w-full">
      {show && selectedOrder && (
        <PrepareOrderModal
          order={selectedOrder}
          onClose={() => {
            setShow(false)
            setSelectedOrder(null)
          }}
        />
      )}

      <Box paddingBlockEnd="400">
        <InlineStack align="space-between" blockAlign="center">
          <Text variant="headingMd" as="h2">
            Recent orders
          </Text>
          <Badge tone="info">{pagination.total} total</Badge>
        </InlineStack>
      </Box>

      <div className="w-full overflow-x-auto ">
        <Card padding="0">
          <IndexTable
            resourceName={resourceName}
            itemCount={orders.length}
            selectable={false}
            headings={[
              { title: 'Order' },
              { title: 'Customer' },
              { title: 'Store' },
              { title: 'Items', alignment: 'center' },
              { title: 'Total', alignment: 'right' },
              { title: 'Fulfillment', alignment: 'center' },
              { title: 'Shipping', alignment: 'center' },
              { title: 'Action', alignment: 'center' },
            ]}
          >
            {rowMarkup}
          </IndexTable>
        </Card>
      </div>

      {pagination.totalPages > 1 && (
        <Box paddingBlockStart="400">
          <InlineStack align="center">
            <Pagination
              hasPrevious={pagination.page > 1}
              onPrevious={() => onPageChange(pagination.page - 1)}
              hasNext={pagination.page < pagination.totalPages}
              onNext={() => onPageChange(pagination.page + 1)}
              label={`Page ${pagination.page} of ${pagination.totalPages}`}
            />
          </InlineStack>
        </Box>
      )}
    </div>
  )
}

export default OrdersTable
