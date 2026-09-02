import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    CreateShippingRulePayload,
    ShippingRule,
    UpdateShippingRulePayload,
} from "@/features/shipping-rules/types/shipping-rules.types";
import {
    createShippingRuleService,
    deleteShippingRuleService,
    getShippingRulesService,
    reorderShippingRulesService,
    updateShippingRuleService,
} from "@/features/shipping-rules/services/shipping-rules.service";

interface ShippingRulesState {
    rules: ShippingRule[];
    loading: boolean;
    saving: boolean;
    deleting: string | null;
    reordering: boolean;
    error: string | null;
}

const initialState: ShippingRulesState = {
    rules: [],
    loading: false,
    saving: false,
    deleting: null,
    reordering: false,
    error: null,
};

export const fetchShippingRules = createAsyncThunk(
    "shippingRules/fetch",
    async (_, { rejectWithValue }) => {
        try {
            return await getShippingRulesService();
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to load shipping rules");
        }
    }
);

export const createShippingRule = createAsyncThunk(
    "shippingRules/create",
    async (payload: CreateShippingRulePayload, { rejectWithValue }) => {
        try {
            return await createShippingRuleService(payload);
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to create shipping rule");
        }
    }
);

export const updateShippingRule = createAsyncThunk(
    "shippingRules/update",
    async (
        { ruleId, payload }: { ruleId: string; payload: UpdateShippingRulePayload },
        { rejectWithValue }
    ) => {
        try {
            return await updateShippingRuleService(ruleId, payload);
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to update shipping rule");
        }
    }
);

export const deleteShippingRule = createAsyncThunk(
    "shippingRules/delete",
    async (ruleId: string, { rejectWithValue }) => {
        try {
            await deleteShippingRuleService(ruleId);
            return ruleId;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to delete shipping rule");
        }
    }
);

export const reorderRules = createAsyncThunk(
    "shippingRules/reorder",
    async (ruleIds: string[], { rejectWithValue }) => {
        try {
            await reorderShippingRulesService(ruleIds);
            return ruleIds;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to reorder shipping rules");
        }
    }
);

export const shippingRulesSlice = createSlice({
    name: "shippingRules",
    initialState,
    reducers: {
        clearShippingRulesError: (state) => {
            state.error = null;
        },
        optimisticReorder: (state, action: PayloadAction<string[]>) => {
            const ruleIds = action.payload;
            const ruleById = new Map(
                state.rules.map((rule) => [rule._id, rule])
            );

            state.rules = ruleIds
                .map((id, index) => {
                    const rule = ruleById.get(id);
                    if (!rule) return null;
                    return { ...rule, order: index };
                })
                .filter((rule): rule is ShippingRule => rule !== null);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchShippingRules.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchShippingRules.fulfilled, (state, action) => {
                state.loading = false;
                state.rules = action.payload;
            })
            .addCase(fetchShippingRules.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to load shipping rules";
            })
            .addCase(createShippingRule.pending, (state) => {
                state.saving = true;
                state.error = null;
            })
            .addCase(createShippingRule.fulfilled, (state, action) => {
                state.saving = false;
                state.rules = [...state.rules, action.payload];
            })
            .addCase(createShippingRule.rejected, (state, action) => {
                state.saving = false;
                state.error = (action.payload as string) || "Failed to create shipping rule";
            })
            .addCase(updateShippingRule.pending, (state) => {
                state.saving = true;
                state.error = null;
            })
            .addCase(updateShippingRule.fulfilled, (state, action) => {
                state.saving = false;
                state.rules = state.rules.map((rule) =>
                    rule._id === action.payload._id ? action.payload : rule
                );
            })
            .addCase(updateShippingRule.rejected, (state, action) => {
                state.saving = false;
                state.error = (action.payload as string) || "Failed to update shipping rule";
            })
            .addCase(deleteShippingRule.pending, (state, action) => {
                state.deleting = action.meta.arg;
                state.error = null;
            })
            .addCase(deleteShippingRule.fulfilled, (state, action) => {
                state.deleting = null;
                state.rules = state.rules.filter((rule) => rule._id !== action.payload);
            })
            .addCase(deleteShippingRule.rejected, (state, action) => {
                state.deleting = null;
                state.error = (action.payload as string) || "Failed to delete shipping rule";
            })
            .addCase(reorderRules.pending, (state) => {
                state.reordering = true;
                state.error = null;
            })
            .addCase(reorderRules.fulfilled, (state) => {
                state.reordering = false;
            })
            .addCase(reorderRules.rejected, (state, action) => {
                state.reordering = false;
                state.error = (action.payload as string) || "Failed to reorder shipping rules";
            });
    },
});

export const { clearShippingRulesError, optimisticReorder } = shippingRulesSlice.actions;

export const selectShippingRules = (state: any) => state.shippingRules.rules;
export const selectShippingRulesLoading = (state: any) => state.shippingRules.loading;
export const selectShippingRulesSaving = (state: any) => state.shippingRules.saving;
export const selectShippingRulesDeleting = (state: any) => state.shippingRules.deleting;
export const selectShippingRulesReordering = (state: any) => state.shippingRules.reordering;
export const selectShippingRulesError = (state: any) => state.shippingRules.error;

export default shippingRulesSlice.reducer;