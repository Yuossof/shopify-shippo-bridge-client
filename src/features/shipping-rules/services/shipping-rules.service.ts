import { axiosInstance } from "@/lib/axios";
import { errorHandler } from "@/lib/app-error";
import {
    CreateShippingRulePayload,
    ShippingRule,
    UpdateShippingRulePayload,
} from "../types/shipping-rules.types";

export const getShippingRulesService = async (): Promise<ShippingRule[]> => {
    try {
        const response = await axiosInstance.get("/shipping-rules");
        return response.data.rules || [];
    } catch (error) {
        throw errorHandler(error);
    }
};

export const createShippingRuleService = async (
    payload: CreateShippingRulePayload
): Promise<ShippingRule> => {
    try {
        const response = await axiosInstance.post("/shipping-rules", payload);
        return response.data.rule;
    } catch (error) {
        throw errorHandler(error);
    }
};

export const updateShippingRuleService = async (
    ruleId: string,
    payload: UpdateShippingRulePayload
): Promise<ShippingRule> => {
    try {
        const response = await axiosInstance.put(
            `/shipping-rules/${ruleId}`,
            payload
        );
        return response.data.rule;
    } catch (error) {
        throw errorHandler(error);
    }
};

export const deleteShippingRuleService = async (
    ruleId: string
): Promise<void> => {
    try {
        await axiosInstance.delete(`/shipping-rules/${ruleId}`);
    } catch (error) {
        throw errorHandler(error);
    }
};

export const reorderShippingRulesService = async (
    ruleIds: string[]
): Promise<void> => {
    try {
        await axiosInstance.put("/shipping-rules/reorder", { ruleIds });
    } catch (error) {
        throw errorHandler(error);
    }
};