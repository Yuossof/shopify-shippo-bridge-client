import { Reorder, useDragControls } from "framer-motion";
import {
    Card,
    Badge,
    Text,
    Button,
    InlineStack,
    EmptyState,
    Spinner,
} from "@shopify/polaris";
import { PlusIcon } from "@shopify/polaris-icons";
import { GripVertical } from "lucide-react";
import {
    CONDITION_TYPE_OPTIONS,
    ShippingRule,
} from "../types/shipping-rules.types";

interface ShippingRulesTableProps {
    rules: ShippingRule[];
    loading: boolean;
    reordering: boolean;
    deleting: string | null;
    onEdit: (rule: ShippingRule) => void;
    onDelete: (rule: ShippingRule) => void;
    onCreate: () => void;
    onReorder: (ruleIds: string[]) => void;
}

const formatCondition = (rule: ShippingRule): string => {
    const option = CONDITION_TYPE_OPTIONS.find(
        (opt) => opt.value === rule.conditionType
    );

    if (rule.conditionType === "ALWAYS_APPLY") {
        return `Always apply`;
    }

    const unit =
        rule.conditionType === "ORDER_WEIGHT_GREATER_THAN" ? "g" : "$";
    return `${option?.label ?? rule.conditionType} ${rule.conditionValue}${unit}`;
};

const RuleRow = ({
    rule,
    position,
    disabled,
    deleting,
    onEdit,
    onDelete,
}: {
    rule: ShippingRule;
    position: number;
    disabled: boolean;
    deleting: boolean;
    onEdit: (rule: ShippingRule) => void;
    onDelete: (rule: ShippingRule) => void;
}) => {
    const dragControls = useDragControls();

    return (
        <Reorder.Item
            key={rule._id}
            value={rule}
            dragListener={false}
            dragControls={dragControls}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            style={{
                listStyle: "none",
                opacity: disabled ? 0.5 : 1,
                pointerEvents: disabled ? "none" : "auto",
                transition: "opacity 0.2s ease",
                borderBottom: "1px solid var(--p-color-border)",
                background: "var(--p-surface)",
            }}
        >
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1.6fr 1.4fr 1fr 0.7fr 0.7fr 1.3fr",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    minWidth: "720px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "var(--p-color-text-subdued)",
                        cursor: disabled ? "default" : "grab",
                        touchAction: "none",
                    }}
                    onPointerDown={(e) => dragControls.start(e)}
                >
                    <span style={{ fontSize: "12px", fontWeight: 600 }}>{position}</span>
                    <GripVertical width={16} height={16} />
                </div>

                <Text variant="bodyMd" fontWeight="semibold" as="span">
                    {rule.name}
                </Text>

                <Text variant="bodySm" as="span">
                    {formatCondition(rule)}
                </Text>

                <div>
                    <Badge tone="info">{`${rule.actionMaxDeliveryDays} days max`}</Badge>
                </div>

                <div>
                    {rule.isFallbackDefault ? (
                        <Badge tone="attention">Fallback</Badge>
                    ) : (
                        <Badge tone="info">Conditional</Badge>
                    )}
                </div>

                <div>
                    <Badge tone={rule.isActive ? "success" : "critical"}>
                        {rule.isActive ? "Active" : "Inactive"}
                    </Badge>
                </div>

                <InlineStack gap="200">
                    <Button
                        size="slim"
                        onClick={() => onEdit(rule)}
                        disabled={deleting || disabled}
                    >
                        Edit
                    </Button>
                    <Button
                        size="slim"
                        tone="critical"
                        loading={deleting}
                        disabled={deleting || disabled}
                        onClick={() => onDelete(rule)}
                    >
                        Delete
                    </Button>
                </InlineStack>
            </div>
        </Reorder.Item>
    );
};

const ShippingRulesTable = ({
    rules,
    loading,
    reordering,
    deleting,
    onEdit,
    onDelete,
    onCreate,
    onReorder,
}: ShippingRulesTableProps) => {
    const disabled = reordering;

    if (loading) {
        return (
            <Card>
                <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
                    <Spinner size="small" />
                </div>
            </Card>
        );
    }

    if (rules.length === 0) {
        return (
            <Card>
                <EmptyState
                    heading="No shipping rules yet"
                    action={{
                        content: "Create your first rule",
                        onAction: onCreate,
                    }}
                    image=""
                    footerContent="Add rules to automatically pick the lowest rate within your target delivery time."
                >
                    <p>
                        Configure conditions and a max delivery window. The lowest matching
                        rate will be auto-selected for your orders.
                    </p>
                </EmptyState>
            </Card>
        );
    }

    return (
        <Card padding="0">
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px",
                    borderBottom: "1px solid var(--p-color-border)",
                }}
            >
                <InlineStack gap="300" blockAlign="center">
                    <Text variant="headingMd" as="h2">
                        Shipping Rules ({rules.length})
                    </Text>
                    {reordering && (
                        <InlineStack gap="100" blockAlign="center">
                            <Spinner size="small" />
                            <Text variant="bodySm" tone="subdued" as="span">
                                Saving order...
                            </Text>
                        </InlineStack>
                    )}
                </InlineStack>
                <Button
                    variant="primary"
                    onClick={onCreate}
                    icon={PlusIcon}
                    disabled={disabled}
                >
                    Add Rule
                </Button>
            </div>

            <div
                    style={{
                        overflowX: "auto",
                    }}
                >
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1.6fr 1.4fr 1fr 0.7fr 0.7fr 1.3fr",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 16px",
                    borderBottom: "1px solid var(--p-color-border)",
                    background: "var(--p-color-bg-subdued)",
                    color: "var(--p-color-text-subdued)",
                    fontSize: "13px",
                    fontWeight: 600,
                    minWidth: "720px",
                }}
            >
                <span />
                <span>Name</span>
                <span>Condition</span>
                <span>Max Delivery</span>
                <span>Type</span>
                <span>Status</span>
                <span>Actions</span>
            </div>

            <div style={{ opacity: disabled ? 0.6 : 1, transition: "opacity 0.2s ease" }}>
                <Reorder.Group
                    as="ol"
                    axis="y"
                    values={rules}
                    onReorder={(next) => {
                        onReorder(next.map((rule) => rule._id));
                    }}
                    style={{ margin: 0, padding: 0 }}
                >
                    {rules.map((rule, index) => (
                        <RuleRow
                            key={rule._id}
                            rule={rule}
                            position={index + 1}
                            disabled={disabled}
                            deleting={deleting === rule._id}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </Reorder.Group>
            </div>
            </div>

            <div style={{ padding: "16px" }}>
                <Text variant="bodyXs" tone="subdued" as="p">
                    Drag the grip handle to reorder rule priority. Rules are evaluated
                    top to bottom; the first matching rule wins.
                </Text>
            </div>
        </Card>
    );
};

export default ShippingRulesTable;