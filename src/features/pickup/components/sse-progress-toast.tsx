// components/SSEProgressToast.tsx
import { useState, useEffect } from 'react';
import { Text, Icon, ProgressBar } from '@shopify/polaris';
import {
    CheckCircleIcon,
    AlertCircleIcon,
    XIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from '@shopify/polaris-icons';

interface SSEProgressToastProps {
    status: string;
    message: string;
    count: number;
    failedCount?: number; 
    isLoading: boolean;
    onClose: () => void;
    onViewErrors?: () => void; 
}

const TERMINAL_STATUSES = ['SUCCESS', 'FAILED', 'EMPTY', 'PARTIAL_SUCCESS', 'COMPLETED_WITH_ERRORS'];

const SSEProgressToast = ({
    status,
    message,
    count,
    failedCount = 0,
    isLoading,
    onClose,
    onViewErrors
}: SSEProgressToastProps) => {
    const [collapsed, setCollapsed] = useState(false);
    const [visible, setVisible] = useState(false);
    const [leaving, setLeaving] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 20);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (TERMINAL_STATUSES.includes(status) && failedCount === 0) {
            const t = setTimeout(() => handleClose(), 4000);
            return () => clearTimeout(t);
        }
    }, [status, failedCount]);

    const handleClose = () => {
        setLeaving(true);
        setTimeout(onClose, 250);
    };

    const getVisual = () => {
        if (status === 'PARTIAL_SUCCESS' || status === 'COMPLETED_WITH_ERRORS') {
            return { icon: AlertCircleIcon, color: '#E39000', label: 'Completed with errors' };
        }
        if (status === 'SUCCESS') return { icon: CheckCircleIcon, color: '#008060', label: 'Completed' };
        if (status === 'FAILED') return { icon: AlertCircleIcon, color: '#D82C0D', label: 'Failed' };
        if (status === 'EMPTY') return { icon: AlertCircleIcon, color: '#8A8A8A', label: 'Nothing to process' };
        return { icon: null, color: '#2C6ECB', label: 'In progress' };
    };

    const { icon, color, label } = getVisual();

    return (
        <>
            <style>{`
                @keyframes toast-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .sse-toast {
                    transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.28s ease;
                }
                .sse-toast-enter {
                    transform: translateY(16px);
                    opacity: 0;
                }
                .sse-toast-visible {
                    transform: translateY(0);
                    opacity: 1;
                }
                .sse-toast-leave {
                    transform: translateY(8px);
                    opacity: 0;
                }
                .sse-toast-spinner {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    border: 2px solid var(--toast-border);
                    border-top-color: #2C6ECB;
                    animation: toast-spin 0.7s linear infinite;
                }
                .failed-errors-btn:hover {
                    background-color: var(--toast-critical-bg);
                }
            `}</style>

            <div
                className={`sse-toast ${leaving ? 'sse-toast-leave' : visible ? 'sse-toast-visible' : 'sse-toast-enter'}`}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '340px',
                    background: 'var(--toast-bg)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.1)',
                    border: '1px solid var(--toast-border)',
                    overflow: 'hidden',
                    zIndex: 1000,
                    fontFamily: 'inherit',
                }}
            >
                {/* Header — always visible, click to collapse */}
                <div
                    onClick={() => setCollapsed((c) => !c)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        cursor: 'pointer',
                        background: 'var(--toast-header-bg)',
                        borderBottom: collapsed ? 'none' : '1px solid var(--toast-divider)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isLoading ? (
                            <span className="sse-toast-spinner" />
                        ) : icon ? (
                            <span style={{ color, display: 'flex' }}>
                                <Icon source={icon} />
                            </span>
                        ) : null}
                        <Text variant="bodySm" fontWeight="semibold" as="span">
                            {label}
                        </Text>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span
                            style={{ display: 'flex', color: 'var(--toast-muted)' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setCollapsed((c) => !c);
                            }}
                        >
                            <Icon source={collapsed ? ChevronUpIcon : ChevronDownIcon} />
                        </span>
                        <span
                            style={{ display: 'flex', color: 'var(--toast-muted)', cursor: 'pointer' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClose();
                            }}
                        >
                            <Icon source={XIcon} />
                        </span>
                    </div>
                </div>

                {/* Body — collapsible */}
                {!collapsed && (
                    <div style={{ padding: '14px 16px' }}>
                        <Text variant="bodySm" tone="subdued" as="p">
                            {message}
                        </Text>

                        {isLoading && (
                            <div style={{ marginTop: '10px' }}>
                                <ProgressBar size="small" tone="primary" animated progress={count > 0 ? undefined : 15} />
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                            {count > 0 && (
                                <Text variant="bodyXs" tone="subdued" as="span">
                                    {count} shipment{count > 1 ? 's' : ''} processed
                                </Text>
                            )}
                        </div>

                        {/* قسم عرض الشحنات الفاشلة */}
                        {failedCount > 0 && (
                            <div style={{
                                marginTop: '12px',
                                padding: '8px 12px',
                                background: 'var(--toast-critical-bg)',
                                border: '1px solid var(--toast-critical-border)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ color: '#D82C0D', display: 'flex' }}>
                                        <Icon source={AlertCircleIcon} />
                                    </span>
                                    <Text variant="bodySm" as="span" tone="critical">
                                        {failedCount} failed
                                    </Text>
                                </div>
                                {onViewErrors && (
                                    <button
                                        className="failed-errors-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onViewErrors();
                                        }}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#D82C0D',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            transition: 'background 0.2s'
                                        }}
                                    >
                                        View details
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default SSEProgressToast;
