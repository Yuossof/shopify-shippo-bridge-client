import { useState } from 'react';
import { axiosInstance } from '@/lib/axios';
import {
  IndexTable,
  Card,
  Text,
  Badge,
  Link,
  Box,
  InlineStack,
  BlockStack,
  Pagination,
  Spinner,
  Modal,
  Thumbnail,
  Banner,
  Divider,
  Button,
} from '@shopify/polaris';
import { LabelPrinterIcon } from '@shopify/polaris-icons';
import { OrderLineItem } from '@/shared/types/order';

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Shipment {
  _id: string;
  orderId: string;
  shopifyOrderId: string;
  provider: string;
  trackingNumber?: string;
  trackingUrl?: string;
  labelUrl?: string;
  status: string;
  pickupRequested: string;
  createdAt: string;
}


const getStatusInfo = (status: string) => {
  switch (status) {
    case 'label_purchased':
      return { tone: 'success' as const, text: 'Label Purchased' };
    case 'pending':
      return { tone: 'attention' as const, text: 'Pending' };
    case 'failed':
      return { tone: 'critical' as const, text: 'Failed' };
    default:
      return { tone: 'info' as const, text: status || 'Unknown' };
  }
};

const getPickupStatus = (pickupRequested: string) => {
  switch (pickupRequested) {
    case 'not_requested':
      return { tone: 'info' as const, text: 'Not Requested' };
    case 'requested':
      return { tone: 'success' as const, text: 'Requested' };
    case 'not_supported':
      return { tone: 'warning' as const, text: 'Not Supported' };
    case 'failed':
      return { tone: 'critical' as const, text: 'Failed' };
    default:
      return { tone: 'critical' as const, text: 'Failed' };
  }
};

const formatMoney = (amount: string | number, currency?: string) => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (Number.isNaN(numericAmount)) return String(amount);
  if (!currency) return numericAmount.toFixed(2);
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(numericAmount);
  } catch {
    return `${numericAmount.toFixed(2)} ${currency}`;
  }
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const ShipmentsTable = ({
  shipments = [],
  pagination,
  onPageChange,
  loading = false,
}: {
  shipments?: Shipment[];
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  loading?: boolean;
}) => {
  const resourceName = {
    singular: 'shipment',
    plural: 'shipments',
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [orderItems, setOrderItems] = useState<OrderLineItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [itemsError, setItemsError] = useState<string | null>(null);

  const fetchOrderItems = async (shipmentId: string, shopifyOrderId: string) => {
    setItemsLoading(true);
    setItemsError(null);
    try {
      const response = await axiosInstance.get(
        `/shipments/shipment?shipmentId=${shipmentId}&orderId=${shopifyOrderId}`,
      );
      setOrderItems(Array.isArray(response.data.items) ? response.data.items : []);
    } catch (error) {
      setOrderItems([]);
      setItemsError('Failed to load order items. Please try again.');
    } finally {
      setItemsLoading(false);
    }
  };

  const handleRowClick = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setModalOpen(true);
    fetchOrderItems(shipment._id, shipment.shopifyOrderId);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedShipment(null);
    setOrderItems([]);
    setItemsError(null);
  };

  const handlePrintLabel = (labelUrl: string) => {
    // Cross-origin PDFs can't be auto-printed due to browser security rules,
    // so we open it in a new tab where the merchant can print via the
    // browser's own PDF viewer (Ctrl+P / the viewer's print icon).
    window.open(labelUrl, '_blank', 'noopener,noreferrer');
  };

  const orderTotal = orderItems.reduce(
    (sum, item) => sum + parseFloat(item.price || '0') * (item.quantity || 0),
    0,
  );
  const orderCurrency = orderItems[0]?.currency;

  const rowMarkup = shipments.map((shipment, index) => {
    const {
      _id,
      shopifyOrderId,
      provider,
      trackingNumber,
      trackingUrl,
      labelUrl,
      status,
      pickupRequested,
      createdAt,
    } = shipment;

    const statusInfo = getStatusInfo(status);
    const pickupInfo = getPickupStatus(pickupRequested);

    return (
      <IndexTable.Row
        id={_id}
        key={_id}
        position={index}
        onClick={() => handleRowClick(shipment)}
      >
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            #{shopifyOrderId}
          </Text>
        </IndexTable.Cell>

        <IndexTable.Cell>{provider}</IndexTable.Cell>

        <IndexTable.Cell>
          {trackingNumber ? (
            <span onClick={(e) => e.stopPropagation()}>
              <Link url={trackingUrl} external>
                {trackingNumber}
              </Link>
            </span>
          ) : (
            '—'
          )}
        </IndexTable.Cell>

        <IndexTable.Cell>
          <div style={{ display: 'flex' }}>
            <Badge tone={statusInfo.tone}>{statusInfo.text}</Badge>
          </div>
        </IndexTable.Cell>

        <IndexTable.Cell>
          <span className="flex"><Badge tone={pickupInfo.tone}>{pickupInfo.text}</Badge></span>
        </IndexTable.Cell>

        <IndexTable.Cell>
          {labelUrl ? (
            <span onClick={(e) => e.stopPropagation()}>
              <Link url={labelUrl} external>
                View Label
              </Link>
            </span>
          ) : (
            'N/A'
          )}
        </IndexTable.Cell>

        <IndexTable.Cell>
          <Text variant="bodyXs" tone="subdued" as="span">
            {formatDate(createdAt)}
          </Text>
        </IndexTable.Cell>
      </IndexTable.Row>
    );
  });

  return (
    <div dir="ltr" className="w-full">
      <Box paddingBlockEnd="400">
        <InlineStack align="space-between" blockAlign="center">
          <Text variant="headingMd" as="h2">
            Recent Shipments
          </Text>
          <Badge tone="info">{pagination.total} total</Badge>
        </InlineStack>
      </Box>

      <div className="w-full overflow-x-auto">
        <Card padding="0">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <Spinner size="small" />
          </div>
        ) : (
          <IndexTable
            resourceName={resourceName}
            itemCount={shipments.length}
            selectable={false}
            emptyState={
              <Box padding="800">
                <Text as="p" tone="subdued" alignment="center">
                  No shipments yet.
                </Text>
              </Box>
            }
            headings={[
              { title: 'Order ID' },
              { title: 'Provider' },
              { title: 'Tracking Number' },
              { title: 'Status' },
              { title: 'Pickup Status' },
              { title: 'Shipping Label' },
              { title: 'Date' },
            ]}
          >
            {rowMarkup}
          </IndexTable>
        )}
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

      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        title={
          selectedShipment
            ? `Order Items — #${selectedShipment.shopifyOrderId}`
            : 'Order Items'
        }
      >
        <Modal.Section>
          {selectedShipment && (
            <Box paddingBlockEnd="400">
              <Card>
                <InlineStack align="space-between" blockAlign="start" wrap gap="400">
                  <BlockStack gap="200">
                    <InlineStack gap="200" wrap>
                      <Badge tone={getStatusInfo(selectedShipment.status).tone}>
                        {getStatusInfo(selectedShipment.status).text}
                      </Badge>
                      <Badge tone={getPickupStatus(selectedShipment.pickupRequested).tone}>
                        {`Pickup: ${getPickupStatus(selectedShipment.pickupRequested).text}`}
                      </Badge>
                    </InlineStack>

                    <BlockStack gap="100">
                      <InlineStack gap="150">
                        <Text as="span" tone="subdued" variant="bodySm">
                          Carrier:
                        </Text>
                        <Text as="span" variant="bodySm" fontWeight="medium">
                          {selectedShipment.provider}
                        </Text>
                      </InlineStack>

                      {selectedShipment.trackingNumber && (
                        <InlineStack gap="150">
                          <Text as="span" tone="subdued" variant="bodySm">
                            Tracking:
                          </Text>
                          <Link url={selectedShipment.trackingUrl} external>
                            {selectedShipment.trackingNumber}
                          </Link>
                        </InlineStack>
                      )}

                      <InlineStack gap="150">
                        <Text as="span" tone="subdued" variant="bodySm">
                          Created:
                        </Text>
                        <Text as="span" variant="bodySm">
                          {formatDate(selectedShipment.createdAt)}
                        </Text>
                      </InlineStack>
                    </BlockStack>
                  </BlockStack>

                  {selectedShipment.labelUrl && (
                    <Button
                      icon={LabelPrinterIcon}
                      variant="primary"
                      onClick={() => handlePrintLabel(selectedShipment.labelUrl as string)}
                    >
                      Print Label
                    </Button>
                  )}
                </InlineStack>
              </Card>
            </Box>
          )}

          {itemsLoading && (
            <Box padding="800">
              <InlineStack align="center">
                <Spinner size="small" />
              </InlineStack>
            </Box>
          )}

          {!itemsLoading && itemsError && <Banner tone="critical">{itemsError}</Banner>}

          {!itemsLoading && !itemsError && orderItems.length === 0 && (
            <Box padding="800">
              <Text as="p" tone="subdued" alignment="center">
                No items found for this order.
              </Text>
            </Box>
          )}

          {!itemsLoading && !itemsError && orderItems.length > 0 && (
            <BlockStack gap="400">
              <BlockStack gap="300">
                {orderItems.map((item, idx) => (
                  <Box key={item.lineItemId || idx}>
                    <InlineStack gap="400" blockAlign="center" wrap={false}>
                      <Thumbnail source={item.imageUrl} alt={item.title} size="large" />
                      <Box width="100%">
                        <BlockStack gap="100">
                          <Text as="h3" variant="bodyMd" fontWeight="semibold">
                            {item.title}
                          </Text>
                          <Text as="span" tone="subdued" variant="bodySm">
                            {`SKU: ${item.sku || '—'}`}
                          </Text>
                          <InlineStack align="space-between">
                            <Text as="span" variant="bodySm" tone="subdued">
                              {`Qty: ${item.quantity}`}
                            </Text>
                            <Text as="span" variant="bodyMd" fontWeight="semibold">
                              {formatMoney(item.price, item.currency)}
                            </Text>
                          </InlineStack>
                        </BlockStack>
                      </Box>
                    </InlineStack>
                    {idx < orderItems.length - 1 && (
                      <Box paddingBlockStart="300">
                        <Divider />
                      </Box>
                    )}
                  </Box>
                ))}
              </BlockStack>

              <Divider />

              <InlineStack align="end">
                <Text as="span" variant="headingSm">
                  {`Total: ${formatMoney(orderTotal, orderCurrency)}`}
                </Text>
              </InlineStack>
            </BlockStack>
          )}
        </Modal.Section>
      </Modal>
    </div>
  );
};

export default ShipmentsTable;