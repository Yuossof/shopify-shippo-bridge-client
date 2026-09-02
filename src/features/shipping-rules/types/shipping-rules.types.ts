export type RuleConditionType =
    | "ORDER_VALUE_GREATER_THAN"
    | "ORDER_WEIGHT_GREATER_THAN"
    | "ALWAYS_APPLY";

export interface ShippingRule {
    _id: string;
    storeUrl: string;
    name: string;
    conditionType: RuleConditionType;
    conditionValue: number;
    actionMaxDeliveryDays: number;
    isFallbackDefault: boolean;
    isActive: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateShippingRulePayload {
    name: string;
    conditionType: RuleConditionType;
    conditionValue: number;
    actionMaxDeliveryDays: number;
    isFallbackDefault: boolean;
}

export type UpdateShippingRulePayload = Partial<CreateShippingRulePayload>;

export const CONDITION_TYPE_OPTIONS: { value: RuleConditionType; label: string; usesValue: boolean }[] = [
    { value: "ORDER_VALUE_GREATER_THAN", label: "Order value greater than or equal to", usesValue: true },
    { value: "ORDER_WEIGHT_GREATER_THAN", label: "Order weight greater than or equal to", usesValue: true },
    { value: "ALWAYS_APPLY", label: "Always apply", usesValue: false },
];