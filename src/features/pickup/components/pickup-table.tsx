import { useState } from 'react';
import { axiosInstance } from '@/lib/axios';
import { errorHandler } from '@/lib/app-error';
import {
    IndexTable,
    Card,
    Text,
    Badge,
    Link,
    Box,
    InlineStack,
    Pagination,
    Spinner,
    Button,
    BlockStack,
    Banner,
} from '@shopify/polaris';
import SSEProgressToast from './sse-progress-toast';
import { FailedShipmentsAlert } from './failed-shipments-alert';

interface PaginationInfo {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

const PickupsTable = ({
    pickups = [],
    pagination,
    onPageChange,
    loading = false,
}: {
    pickups?: any[];
    pagination: PaginationInfo;
    onPageChange: (page: number) => void;
    loading?: boolean;
}) => {
    const resourceName = {
        singular: 'shipment',
        plural: 'shipments',
    };

    // --- SSE & Bulk Process States ---
    const [bulkLoading, setBulkLoading] = useState(false);
    const [progressStatus, setProgressStatus] = useState<string>('');
    const [liveMessage, setLiveMessage] = useState<string>('');
    const [collectedCount, setCollectedCount] = useState<number>(0);
    const [showToast, setShowToast] = useState(false);

    const getStatusTone = (status: string) => {
        switch (status) {
            case 'label_purchased':
                return 'success';
            case 'pending':
                return 'attention';
            default:
                return 'info';
        }
    };

    const [errorData, setErrorData] = useState<string[]>([]);
    const [showFailedShipmentsAlert, setShowFailedShipmentsAlert] = useState(false);

    const [bulkError, setBulkError] = useState<string | null>(null);

    const handlePickupAll = async () => {
        try {
            setBulkLoading(true);
            setBulkError(null);
            setProgressStatus('START_DB_FETCH');
            setLiveMessage('Connecting...');
            setCollectedCount(0);
            setErrorData([]);
            setShowFailedShipmentsAlert(false);
            setShowToast(true);

            const eventSource = new EventSource(
                `${import.meta.env.VITE_API_URL}/api/pickups/pickup-stream`,
                { withCredentials: true }
            );

            eventSource.onmessage = async (event) => {
                const parsedData = JSON.parse(event.data);

                if (parsedData.status === 'connected') {
                    setLiveMessage('Triggering background bulk pickup job...');
                    try {
                        await axiosInstance.post('/pickups/bulk');
                    } catch (err) {
                        const handled = errorHandler(err);
                        setProgressStatus('FAILED');
                        setLiveMessage(handled.message || 'Failed to initiate bulk pickup process.');
                        setBulkError(handled.message || 'Failed to initiate bulk pickup process.');
                        setBulkLoading(false);
                        eventSource.close();
                    }
                    return;
                }

                setProgressStatus(parsedData.status);
                setLiveMessage(parsedData.message);

                if (typeof parsedData.currentCount === 'number') {
                    setCollectedCount(parsedData.currentCount);
                }

                if (typeof parsedData.failedCount === 'number') {
                    const failedIds = Array.isArray(parsedData.failedIds) ? parsedData.failedIds : [];
                    setErrorData(failedIds);
                    setShowFailedShipmentsAlert(failedIds.length > 0);
                }

                if (
                    parsedData.status === 'SUCCESS'
                    || parsedData.status === 'FAILED'
                    || parsedData.status === 'EMPTY'
                    || parsedData.status === 'PARTIAL_SUCCESS'
                    || parsedData.status === 'COMPLETED_WITH_ERRORS'
                ) {
                    eventSource.close();
                    setBulkLoading(false);

                    if (parsedData.status === 'FAILED') {
                        setBulkError(parsedData.message || 'Bulk pickup process failed.');
                    }
                }
            };

            eventSource.onerror = (error) => {
                console.error('SSE Error:', error);
                setProgressStatus('FAILED');
                setLiveMessage('Connection to progress stream was lost.');
                setBulkError('Connection to progress stream was lost. Please try again.');
                eventSource.close();
                setBulkLoading(false);
            };

        } catch (error) {
            const handled = errorHandler(error);
            setBulkError(handled.message || 'An unexpected error occurred.');
            setBulkLoading(false);
        }
    }

    const rowMarkup = pickups.map(
        (
            {
                _id,
                orderId,
                provider,
                trackingNumber,
                trackingUrl,
                labelUrl,
                status,
                createdAt,
            },
            index,
        ) => {
            return (
                <IndexTable.Row id={_id} key={_id} position={index}>
                    <IndexTable.Cell>
                        <Text variant="bodyMd" fontWeight="bold" as="span">
                            #{orderId}
                        </Text>
                    </IndexTable.Cell>

                    <IndexTable.Cell>{provider}</IndexTable.Cell>

                    <IndexTable.Cell>
                        {trackingNumber ? (
                            <Link url={trackingUrl} external>
                                {trackingNumber}
                            </Link>
                        ) : (
                            '—'
                        )}
                    </IndexTable.Cell>

                    <IndexTable.Cell>
                        <div style={{ display: 'flex' }}>
                            <Badge tone={getStatusTone(status)}>{status}</Badge>
                        </div>
                    </IndexTable.Cell>

                    <IndexTable.Cell>
                        {labelUrl ? (
                            <Link url={labelUrl} external>
                                View Label
                            </Link>
                        ) : (
                            'N/A'
                        )}
                    </IndexTable.Cell>

                    <IndexTable.Cell>
                        <Text variant="bodyXs" tone="subdued" as="span">
                            {new Date(createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}
                        </Text>
                    </IndexTable.Cell>
                </IndexTable.Row>
            );
        },
    );

    return (
        <div dir="ltr" className='relative w-full'>
            <BlockStack gap="400">
                <Box paddingBlockEnd="400">
                    <InlineStack align="space-between" blockAlign="center">
                        <Text variant="headingMd" as="h2">
                            Recent Pickups
                        </Text>
                        <div className="flex flex-wrap items-center justify-end gap-2.5">
                            <Badge tone="info">{`${pagination.total}`}</Badge>
                            <Text as="span" variant="bodySm" tone="subdued">total</Text>
                            <div>
                                <Button
                                    onClick={handlePickupAll}
                                    variant="primary"
                                    loading={bulkLoading}
                                    disabled={loading}
                                >
                                    Pickup all
                                </Button>
                            </div>
                        </div>
                    </InlineStack>
                </Box>

                {bulkError && !bulkLoading && (
                    <Banner tone="critical" title="Bulk pickup failed">
                        <InlineStack align="space-between" blockAlign="center">
                            <Text variant="bodySm" as="span">{bulkError}</Text>
                            <Button onClick={handlePickupAll} size="slim">
                                Retry
                            </Button>
                        </InlineStack>
                    </Banner>
                )}

                <div className="w-full overflow-x-auto">
                <Card padding="0">
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                            <Spinner size="small" />
                        </div>
                    ) : (
                        <IndexTable
                            resourceName={resourceName}
                            itemCount={pickups.length}
                            selectable={false}
                            headings={[
                                { title: 'Order ID' },
                                { title: 'Provider' },
                                { title: 'Tracking Number' },
                                { title: 'Status' },
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
            </BlockStack>

            {/* Floating SSE progress popup — bottom right, Google Drive style */}
            {showToast && (
                <SSEProgressToast
                    status={progressStatus}
                    message={liveMessage}
                    count={collectedCount}
                    isLoading={bulkLoading}
                    failedCount={errorData.length}
                    onViewErrors={() => setShowFailedShipmentsAlert(true)}
                    onClose={() => setShowToast(false)}
                />
            )}

            {showFailedShipmentsAlert && (
                <div className="fixed bottom-20 right-4 z-[1001] sm:right-[380px] sm:bottom-5">
                <FailedShipmentsAlert count={errorData.length} failedIds={errorData} />
                </div>
            )}
        </div>
    );
};

export default PickupsTable;