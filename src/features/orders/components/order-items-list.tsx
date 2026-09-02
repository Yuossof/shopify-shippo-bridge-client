import React, { useMemo } from "react"
import {
  Card,
  IndexTable,
  Text,
  Badge,
  Button,
  Thumbnail,
  InlineStack,
  Box,
  BlockStack,
  IndexTableProps
} from "@shopify/polaris"

interface ShopifyLineItem {
  shopifyLineItemId: number
  title: string
  sku: string | null
  fulfillable_quantity?: number
  fulfillableQuantity?: number
  fulfilledQuantity?: number    // Added to map database updates
  quantity: number
  gift_card: boolean
  image_url?: string
}

export interface SelectedFulfillmentItem {
  shopifyLineItemId: number
  quantity: number
}

interface OrderItemsSelectorModalProps {
  items: ShopifyLineItem[]
  selectedItems: SelectedFulfillmentItem[]
  setSelectedItems: (items: SelectedFulfillmentItem[]) => void
  onConfirm?: (selected: SelectedFulfillmentItem[]) => void
  onCancel?: () => void
}

export default function OrderItemsSelectorModal({
  items,
  selectedItems,
  setSelectedItems,
  onConfirm,
  onCancel,
}: OrderItemsSelectorModalProps) {

  // Calculate remaining quantity strictly by checking both Shopify fields and DB custom fields
  const getFulfillableQty = (item: ShopifyLineItem) => {
    if (typeof item.fulfilledQuantity !== 'undefined') {
      return item.quantity - item.fulfilledQuantity;
    }
    if (typeof item.fulfillable_quantity !== 'undefined') return item.fulfillable_quantity;
    if (typeof item.fulfillableQuantity !== 'undefined') return item.fulfillableQuantity;
    return item.quantity;
  }

  // Filter out any item that has 0 remaining quantity so it completely disappears from the selector list
  const fulfillableItems = useMemo(
    () => items.filter((item) => getFulfillableQty(item) > 0),
    [items]
  )

  const selectedResources = useMemo(
    () => selectedItems.map((item) => String(item.shopifyLineItemId)),
    [selectedItems]
  )

  const handleSelectionChange: IndexTableProps['onSelectionChange'] = (
    selectionType,
    toggleType,
    selection
  ) => {
    if (selectionType === 'all') {
      const allMapped = fulfillableItems.map((item) => ({
        shopifyLineItemId: item.shopifyLineItemId,
        quantity: getFulfillableQty(item),
      }))
      setSelectedItems(allMapped)
    } else if (selectionType === 'none') {
      setSelectedItems([])
    } else if (selectionType === 'single' && typeof selection === 'string') {
      const itemId = Number(selection)
      const isAlreadySelected = selectedItems.some((si) => si.shopifyLineItemId === itemId)

      if (isAlreadySelected) {
        setSelectedItems(selectedItems.filter((si) => si.shopifyLineItemId !== itemId))
      } else {
        const targetItem = items.find((item) => item.shopifyLineItemId === itemId)
        if (targetItem) {
          setSelectedItems([
            ...selectedItems,
            {
              shopifyLineItemId: itemId,
              quantity: getFulfillableQty(targetItem),
            },
          ])
        }
      }
    }
  }

  const handleConfirm = () => {
    onConfirm?.(selectedItems)
  }

  const resourceName = {
    singular: 'item',
    plural: 'items',
  }

  // We should render only fulfillableItems so already fully fulfilled items do not appear at all
  const rowMarkup = fulfillableItems.map((item, index) => {
    const fulfillableQty = getFulfillableQty(item)
    const isSelected = selectedResources.includes(String(item.shopifyLineItemId))

    return (
      <IndexTable.Row
        id={String(item.shopifyLineItemId)}
        key={item.shopifyLineItemId}
        position={index}
        selected={isSelected}
      >
        <IndexTable.Cell>
          <InlineStack gap="300" blockAlign="center">
            <Thumbnail
              size="small"
              source={item.image_url || ""}
              alt={item.title}
            />
            <BlockStack gap="100">
              <Text variant="bodyMd" fontWeight="semibold" as="span">
                {item.title}
              </Text>
            </BlockStack>
          </InlineStack>
        </IndexTable.Cell>

        <IndexTable.Cell>
          <div style={{ textAlign: 'center' }}>
            <Text variant="bodyMd" tone="subdued" as="span" numeric>
              {item.sku || "—"}
            </Text>
          </div>
        </IndexTable.Cell>

        <IndexTable.Cell>
          <div style={{ textAlign: 'right' }}>
            <Text variant="bodyMd" tone="subdued" as="span" numeric>
              {fulfillableQty} / {item.quantity}
            </Text>
          </div>
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  })

  return (
    <Card padding="0">
      <Box padding="400" borderBlockEndWidth="025" borderColor="border-secondary">
        <InlineStack align="space-between" blockAlign="center">
          <Text variant="headingSm" as="h3">
            Select items to fulfill
          </Text>
          <Text variant="bodyXs" tone="subdued" as="span" numeric>
            {selectedItems.length} / {fulfillableItems.length} selected
          </Text>
        </InlineStack>
      </Box>

      <IndexTable
        resourceName={resourceName}
        itemCount={fulfillableItems.length}
        selectedItemsCount={
          selectedItems.length === fulfillableItems.length ? 'All' : selectedItems.length
        }
        onSelectionChange={handleSelectionChange}
        headings={[
          { title: 'Item' },
          { title: 'SKU', alignment: 'center' },
          { title: 'Qty', alignment: 'right' },
        ]}
      >
        {rowMarkup}
      </IndexTable>

      {onConfirm && (
        <Box padding="400" borderBlockStartWidth="025" borderColor="border-secondary">
          <InlineStack align="end" gap="200">
            {onCancel && (
              <Button onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button
              variant="primary"
              onClick={handleConfirm}
              disabled={selectedItems.length === 0}
            >
              Create fulfillment ({selectedItems.length})
            </Button>
          </InlineStack>
        </Box>
      )}
    </Card>
  )
}