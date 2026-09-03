import { useEffect, useState } from "react";
import {
    Modal,
    TextField,
    Select,
    Checkbox,
    BlockStack,
    FormLayout,
    Banner,
} from "@/components/ui/admin-primitives";
import toast from "react-hot-toast";
import {
    CONDITION_TYPE_OPTIONS,
    RuleConditionType,
    ShippingRule,
} from "../types/shipping-rules.types";

interface ShippingRuleFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: {
        name: string;
        conditionType: RuleConditionType;
        conditionValue: number;
        actionMaxDeliveryDays: number;
        isFallbackDefault: boolean;
    }) => void;
    saving?: boolean;
    rule?: ShippingRule | null;
}

const initialForm = {
    name: "",
    conditionType: "ORDER_VALUE_GREATER_THAN" as RuleConditionType,
    conditionValue: "0",
    actionMaxDeliveryDays: "5",
    isFallbackDefault: false,
};

const ShippingRuleFormModal = ({
    open,
    onClose,
    onSubmit,
    saving = false,
    rule = null,
}: ShippingRuleFormModalProps) => {
    const [form, setForm] = useState(initialForm);

    useEffect(() => {
        if (open) {
            if (rule) {
                setForm({
                    name: rule.name,
                    conditionType: rule.conditionType,
                    conditionValue: String(rule.conditionValue ?? 0),
                    actionMaxDeliveryDays: String(rule.actionMaxDeliveryDays),
                    isFallbackDefault: rule.isFallbackDefault,
                });
            } else {
                setForm(initialForm);
            }
        }
    }, [open, rule]);

    const selectedCondition = CONDITION_TYPE_OPTIONS.find(
        (opt) => opt.value === form.conditionType
    );

    const selectedConditionIsFallback =
        form.conditionType === "ALWAYS_APPLY" && form.isFallbackDefault;

    const handleSubmit = () => {
        if (!form.name.trim()) {
            toast.error("Rule name is required");
            return;
        }

        const maxDays = Number(form.actionMaxDeliveryDays);
        if (Number.isNaN(maxDays) || maxDays < 0) {
            toast.error("Max delivery days must be a valid non-negative number");
            return;
        }

        const conditionValue = Number(form.conditionValue);
        if (selectedCondition?.usesValue && Number.isNaN(conditionValue)) {
            toast.error("Condition value must be a valid number");
            return;
        }

        onSubmit({
            name: form.name.trim(),
            conditionType: form.conditionType,
            conditionValue: selectedCondition?.usesValue ? conditionValue : 0,
            actionMaxDeliveryDays: maxDays,
            isFallbackDefault: form.isFallbackDefault,
        });
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={rule ? "Edit Shipping Rule" : "Add Shipping Rule"}
            primaryAction={{
                content: rule ? "Save Changes" : "Create Rule",
                onAction: handleSubmit,
                loading: saving,
                disabled: saving,
            }}
            secondaryActions={[{ content: "Cancel", onAction: onClose }]}
        >
            <Modal.Section>
                <BlockStack gap="400">
                    {selectedConditionIsFallback && (
                        <Banner tone="warning" title="Fallback default rule">
                            This rule will be applied when no other conditional rule matches.
                        </Banner>
                    )}

                    <FormLayout>
                        <TextField
                            label="Rule Name"
                            value={form.name}
                            onChange={(value: string) =>
                                setForm((prev) => ({ ...prev, name: value }))
                            }
                            placeholder="e.g. Express for orders over $50"
                            autoComplete="off"
                        />

                        <Select
                            label="Condition"
                            value={form.conditionType}
                            onChange={(value: string) =>
                                setForm((prev) => ({
                                    ...prev,
                                    conditionType: value as RuleConditionType,
                                }))
                            }
                            options={CONDITION_TYPE_OPTIONS.map((opt) => ({
                                label: opt.label,
                                value: opt.value,
                            }))}
                        />

                        {selectedCondition?.usesValue && (
                            <TextField
                                label={
                                    form.conditionType === "ORDER_WEIGHT_GREATER_THAN"
                                        ? "Condition Value (grams)"
                                        : "Condition Value ($)"
                                }
                                value={form.conditionValue}
                                onChange={(value: string) =>
                                    setForm((prev) => ({ ...prev, conditionValue: value }))
                                }
                                type="number"
                                autoComplete="off"
                            />
                        )}

                        <TextField
                            label="Max Delivery Days"
                            value={form.actionMaxDeliveryDays}
                            onChange={(value: string) =>
                                setForm((prev) => ({
                                    ...prev,
                                    actionMaxDeliveryDays: value,
                                }))
                            }
                            type="number"
                            helpText="Rates with estimated_days at or below this value are eligible."
                            autoComplete="off"
                        />

                        <Checkbox
                            label="Set as fallback default rule"
                            checked={form.isFallbackDefault}
onChange={(value: boolean) =>
                                    setForm((prev) => ({ ...prev, isFallbackDefault: value }))
                            }
                            helpText="Applied when no conditional rule matches the order."
                        />
                    </FormLayout>
                </BlockStack>
            </Modal.Section>
        </Modal>
    );
};

export default ShippingRuleFormModal;
