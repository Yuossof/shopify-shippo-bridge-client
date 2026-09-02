import { isAxiosError } from "axios";
import { UseFormReturn } from "react-hook-form";

interface AppErrorOptions {
    statusCode?: number;
    isOperational?: boolean;
    context?: Record<string, any>;
}

export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;
    public context: Record<string, any>;

    constructor(message: string, options: AppErrorOptions = {}) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = options.statusCode || 500;
        this.isOperational = options.isOperational !== undefined ? options.isOperational : true;
        this.context = options.context || {};

        if ((Error as any).captureStackTrace) {
            (Error as any).captureStackTrace(this, this.constructor);
        }
    }
}

interface BackendErrorResponse {
    success?: boolean;
    message: string;
    errors?: Record<string, any>;
    fieldErrors?: Record<string, string>;
}

export interface HandledError {
    message: string;
    code: number | null;
    fieldErrors?: Record<string, string>;
}

interface ShippoValidationMessage {
    source: string;
    type: string;
    text: string;
    code?: string;
}

const extractShippoMessages = (errors: Record<string, any>): ShippoValidationMessage[] => {
    const messages: ShippoValidationMessage[] = [];

    if (errors?.validation_results?.messages && Array.isArray(errors.validation_results.messages)) {
        messages.push(...errors.validation_results.messages);
    }

    if (errors?.messages && Array.isArray(errors.messages)) {
        messages.push(...errors.messages);
    }

    return messages;
};

const tryMapZodErrors = (
    fieldErrors: Record<string, string>,
    form: UseFormReturn<any>
): Record<string, string> | null => {
    const formFields: string[] = Object.keys(form.getValues());
    const mapped: Record<string, string> = {};

    Object.entries(fieldErrors).forEach(([field, message]) => {
        const normalizedField = field.replace('body.', '');
        if (formFields.includes(normalizedField)) {
            mapped[normalizedField] = message;
        }
    });

    return Object.keys(mapped).length > 0 ? mapped : null;
};

export const errorHandler = (error: unknown): HandledError => {
    if (isAxiosError<BackendErrorResponse>(error)) {
        const data = error.response?.data as any;

        let message = data?.message
            ?? (typeof data?.error === 'string' ? data.error : null)
            ?? (typeof data?.errors === 'string' ? data.errors : null)
            ?? error.message
            ?? "Something went wrong";

        const fieldErrors = data?.fieldErrors;

        if (fieldErrors && typeof fieldErrors === 'object') {
            return {
                message,
                code: error.response?.status ?? null,
                fieldErrors,
            };
        }

        const shippoFieldErrors = data?.errors;
        if (shippoFieldErrors && typeof shippoFieldErrors === 'object') {
            const shippoMessages = extractShippoMessages(shippoFieldErrors);
            if (shippoMessages.length > 0) {
                message = shippoMessages.map((m) => m.text).join('. ');
            }
        }

        return {
            message,
            code: error.response?.status ?? null,
            fieldErrors: data?.fieldErrors,
        };
    } else if (error instanceof AppError) {
        return {
            message: error.message,
            code: error.statusCode,
            fieldErrors: error.context?.errors,
        };
    } else if (error instanceof Error) {
        return {
            message: error.message,
            code: null,
        };
    }

    return {
        message: "Unknown error",
        code: null,
    };
};

export const applyFormServerErrors = (
    fieldErrors: Record<string, string> | undefined,
    form: UseFormReturn<any>
): boolean => {
    if (!fieldErrors || typeof fieldErrors !== 'object') return false;

    const mapped = tryMapZodErrors(fieldErrors, form);
    if (mapped) {
        let hasSetError = false;
        Object.entries(mapped).forEach(([field, msg]) => {
            form.setError(field as any, {
                type: 'server',
                message: msg,
            });
            hasSetError = true;
        });
        return hasSetError;
    }

    let hasSetError = false;
    Object.entries(fieldErrors).forEach(([field, msg]) => {
        const normalizedField = field.replace('body.', '');
        if (form.getValues(normalizedField as any) !== undefined) {
            form.setError(normalizedField as any, {
                type: 'server',
                message: msg,
            });
            hasSetError = true;
        }
    });

    return hasSetError;
};
