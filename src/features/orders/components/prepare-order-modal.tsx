// @ts-nocheck
import { useState } from "react"
import {
  Modal,
  BlockStack,
  InlineGrid,
  TextField,
  Box,
  Text,
  InlineStack,
  Bleed,
  Divider
} from "@/components/ui/admin-primitives"

import { Order } from "../types/orders.types"
import { createShipmentService } from "@/services/shippo/shipments"
import { SelectAddress } from "./select-address"
import { HandledError } from "@/lib/app-error"
import toast from "react-hot-toast"
import { IShippoRate } from "../types/rates"
import ListRates from "./list-rates"
import { createTransactionService } from "@/services/shippo/transactions"
import OrderItemsList, { SelectedFulfillmentItem } from "./order-items-list"

type OrderDetailsModalProps = {
  order?: Order | null
  onClose?: () => void
}

const PrepareOrderModal = ({ order, onClose }: OrderDetailsModalProps) => {
  const [selectedAddress, setSelectedAddress] = useState("")
  const [units, setUnits] = useState({ distance_unit: "in", mass_unit: "lb" })
  const [isLoading, setIsLoading] = useState(false)
  const [rates, setRates] = useState<IShippoRate[]>([])
  const [selectedRate, setSelectedRate] = useState<IShippoRate | null>(null)

  const [selectedFulfillments, setSelectedFulfillments] = useState<SelectedFulfillmentItem[]>([])
  const [createdShipment, setCreatedShipment] = useState<any | null>(null)

  const handleCreateShipment = async () => {
    if (!selectedAddress) {
      toast.error("Please select a sender address first")
      return
    }
    if (!order?.shipToAddressId || order.orderItems?.length === 0) return
    if (selectedFulfillments.length === 0) {
      toast.error("Please select at least one item to fulfill")
      return
    }

    setIsLoading(true)

    const parcels = (order.orderItems ?? []).map((item) => ({
      width: "2",
      height: "2",
      weight: "4",
      length: String(item.quantity),
      distance_unit: units.distance_unit,
      mass_unit: units.mass_unit,
      shopifyLineItemId: item.shopifyLineItemId
    }))

    try {
      const res = await createShipmentService({
        address_from: selectedAddress as string,
        address_to: order.shipToAddressId as string,
        parcels: parcels,
      }, order._id as string, selectedFulfillments)

      const responseData = res.data;

      console.log("Shippo Response Data:", responseData)

      if (responseData && responseData.rates) {
        const finalRates = responseData.rates.rates || responseData.rates;
        setRates(Array.isArray(finalRates) ? finalRates : []);

        const autoSelectedRate = responseData.autoSelectedRate;
        if (autoSelectedRate) {
          const matched = (Array.isArray(finalRates) ? finalRates : []).find(
            (r) => r.object_id === autoSelectedRate.object_id
          );
          if (matched) {
            setSelectedRate(matched);
          }
        }

        setCreatedShipment(responseData.shipment)
      } else {
        toast.error("No rates found for this shipment")
      }
    } catch (error) {
      const err = error as HandledError
      toast.error(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCreateTransactions() {
    if (!selectedRate || !createdShipment) {
      toast.error("Please select a rate first")
      return
    }

    try {
      setIsLoading(true)
      const transaction = await createTransactionService(
        {
          rateId: selectedRate.object_id as string,
          shipmentId: createdShipment._id as string,
          carrier_account: selectedRate.carrier_account,
          provider: selectedRate.provider
        }
      )

      console.log(transaction, "tr")
      toast.success("Shipping label purchased successfully!")

      if (transaction.shipment?.labelUrl) {
        window.open(transaction.shipment.labelUrl, '_blank')
      }
      onClose?.()
    } catch (error) {
      const err = error as HandledError
      toast.error(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!order) return null

  const primaryAction = rates.length > 0
    ? {
      content: 'Confirm & Buy Label',
      onAction: handleCreateTransactions,
      loading: isLoading,
      disabled: !selectedRate,
    }
    : {
      content: 'Create Shipment',
      onAction: handleCreateShipment,
      loading: isLoading,
    }

  return (
    <Modal
      open={!!order}
      onClose={onClose}
      title={`Prepare Shipment for Order #${order.shopifyOrderId}`}
      primaryAction={primaryAction}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: onClose,
        },
      ]}
    >
      <Modal.Section>
        <BlockStack gap="500">

          <BlockStack gap="400">
            <SelectAddress
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
            />

            <InlineGrid columns={2} gap="400">
              <TextField
                label="Distance Unit"
                value={units.distance_unit}
                onChange={(value) => setUnits(prev => ({ ...prev, distance_unit: value }))}
                autoComplete="off"
                placeholder="in"
              />
              <TextField
                label="Mass Unit"
                value={units.mass_unit}
                onChange={(value) => setUnits(prev => ({ ...prev, mass_unit: value }))}
                autoComplete="off"
                placeholder="lb"
              />
            </InlineGrid>
          </BlockStack>

          {rates && rates.length > 0 && (
            <Box paddingBlockStart="200">
              <BlockStack gap="300">
                <Divider />
                <Text variant="headingSm" as="h3">
                  Available Shipping Rates
                </Text>
                <ListRates
                  rates={rates}
                  selectedRateId={selectedRate?.object_id}
                  onSelectRate={setSelectedRate}
                />
              </BlockStack>
            </Box>
          )}

          <Box paddingBlockStart="200">
            <BlockStack gap="300">
              <Divider />
              <OrderItemsList
                items={order.orderItems}
                selectedItems={selectedFulfillments}
                setSelectedItems={setSelectedFulfillments}
              />
            </BlockStack>
          </Box>

          <Bleed marginInline="400" marginBlockEnd="400">
            <Box background="bg-surface-secondary" padding="400">
              <InlineStack align="space-between" blockAlign="center">
                <Text variant="bodyXs" tone="subdued" as="span">
                  Total Weight: {order.totalWeight || 0}g
                </Text>
                <InlineStack gap="150" blockAlign="center">
                  <Text variant="bodySm" tone="subdued" as="span">
                    Selected:
                  </Text>
                  <Text variant="bodyMd" fontWeight="bold" as="span">
                    {selectedFulfillments.length} {selectedFulfillments.length === 1 ? 'item' : 'items'}
                  </Text>
                </InlineStack>
              </InlineStack>
            </Box>
          </Bleed>

        </BlockStack>
      </Modal.Section>
    </Modal>
  )
}

export default PrepareOrderModal
