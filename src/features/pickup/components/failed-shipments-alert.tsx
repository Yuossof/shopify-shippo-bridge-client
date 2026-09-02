import { useState } from "react"
import { InfoIcon } from "lucide-react"

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

export function FailedShipmentsAlert({ count, failedIds = [] }: { count: number; failedIds?: string[] }) {
    const [showDetails, setShowDetails] = useState(false)

    if (!count) return null

    return (
        <div className="grid w-full max-w-md items-start gap-4">
            <Alert>
                <InfoIcon />
                <AlertTitle>Failed Shipments: {count}</AlertTitle>
                <AlertDescription>
                    <button
                        type="button"
                        className="mt-2 text-left underline underline-offset-4"
                        onClick={() => setShowDetails((prev) => !prev)}
                    >
                        {showDetails ? "Hide failed IDs" : "View failed IDs"}
                    </button>
                    {showDetails && failedIds.length > 0 && (
                        <ul className="mt-2 max-h-40 list-inside list-disc overflow-auto text-xs">
                            {failedIds.map((id) => (
                                <li key={id}>{id}</li>
                            ))}
                        </ul>
                    )}
                </AlertDescription>
            </Alert>
        </div>
    )
}
