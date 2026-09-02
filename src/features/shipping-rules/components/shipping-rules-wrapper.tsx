import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BlockStack, InlineStack, Text } from "@shopify/polaris";
import toast from "react-hot-toast";
import ShippingRulesTable from "./shipping-rules-table";
import ShippingRuleFormModal from "./shipping-rule-form-modal";
import {
    createShippingRule,
    deleteShippingRule,
    fetchShippingRules,
    optimisticReorder,
    reorderRules,
    selectShippingRules,
    selectShippingRulesDeleting,
    selectShippingRulesError,
    selectShippingRulesLoading,
    selectShippingRulesReordering,
    selectShippingRulesSaving,
    updateShippingRule,
} from "@/redux/features/shippingRulesSlice";
import { ShippingRule } from "../types/shipping-rules.types";

const ShippingRulesWrapper = () => {
    const dispatch = useDispatch();
    const rules = useSelector(selectShippingRules);
    const loading = useSelector(selectShippingRulesLoading);
    const saving = useSelector(selectShippingRulesSaving);
    const deleting = useSelector(selectShippingRulesDeleting);
    const reordering = useSelector(selectShippingRulesReordering);
    const error = useSelector(selectShippingRulesError);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<ShippingRule | null>(null);
    const reorderTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const loadRules = useCallback(() => {
        dispatch(fetchShippingRules() as any);
    }, [dispatch]);

    useEffect(() => {
        loadRules();
    }, [loadRules]);

    useEffect(() => {
        return () => {
            if (reorderTimer.current) {
                clearTimeout(reorderTimer.current);
            }
        };
    }, []);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleCreate = () => {
        setEditingRule(null);
        setModalOpen(true);
    };

    const handleEdit = (rule: ShippingRule) => {
        setEditingRule(rule);
        setModalOpen(true);
    };

    const handleDelete = (rule: ShippingRule) => {
        dispatch(deleteShippingRule(rule._id) as any)
            .unwrap()
            .then(() => toast.success("Shipping rule deleted"))
            .catch(() => toast.error("Failed to delete shipping rule"));
    };

    const handleReorder = (ruleIds: string[]) => {
        if (reordering) return;

        dispatch(optimisticReorder(ruleIds));

        if (reorderTimer.current) {
            clearTimeout(reorderTimer.current);
        }

        reorderTimer.current = setTimeout(() => {
            reorderTimer.current = null;
            dispatch(reorderRules(ruleIds) as any)
                .unwrap()
                .then(() => toast.success("Shipping rule order saved"))
                .catch(() => {
                    toast.error("Failed to save shipping rule order");
                    dispatch(fetchShippingRules() as any);
                });
        }, 1000);
    };

    const handleSubmit = async (data: {
        name: string;
        conditionType: ShippingRule["conditionType"];
        conditionValue: number;
        actionMaxDeliveryDays: number;
        isFallbackDefault: boolean;
    }) => {
        try {
            if (editingRule) {
                await (dispatch(
                    updateShippingRule({
                        ruleId: editingRule._id,
                        payload: data,
                    }) as any
                )).unwrap();
                toast.success("Shipping rule updated");
            } else {
                await (dispatch(createShippingRule(data) as any)).unwrap();
                toast.success("Shipping rule created");
            }
            setModalOpen(false);
            setEditingRule(null);
        } catch (err: any) {
            toast.error(err?.message || "Failed to save shipping rule");
        }
    };

    return (
        <div className="relative mx-auto w-full space-y-8 p-4 font-sans sm:p-6 lg:px-8 2xl:max-w-[1800px]" dir="ltr">
            <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center" gap="400">
                    <BlockStack gap="100">
                        <Text variant="headingLg" as="h1">
                            Shipping Rules
                        </Text>
                        <Text variant="bodySm" tone="subdued" as="p">
                            Automatically select the lowest rate within your target delivery window.
                        </Text>
                    </BlockStack>
                </InlineStack>

                <ShippingRulesTable
                    rules={rules}
                    loading={loading}
                    reordering={reordering}
                    deleting={deleting}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onCreate={handleCreate}
                    onReorder={handleReorder}
                />
            </BlockStack>

            <ShippingRuleFormModal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingRule(null);
                }}
                onSubmit={handleSubmit}
                saving={saving}
                rule={editingRule}
            />
        </div>
    );
};

export default ShippingRulesWrapper;