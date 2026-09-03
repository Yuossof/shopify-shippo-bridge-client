import { useCallback, useEffect, useState } from 'react'
import { HandledError } from '@/lib/app-error'
import toast from 'react-hot-toast'
import { Banner, Button, InlineStack, Text } from '@/components/ui/admin-primitives'
import PickupTable from './pickup-table'
import { getPickupsService } from '../services/get-pickups'

interface Pagination {
    total: number
    page: number
    limit: number
    totalPages: number
}

const PickupWrapper = () => {
    const [pickups, setPickups] = useState([])
    const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 50, totalPages: 1 })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchPickups = useCallback(async (page: number = 1, limit: number = 50) => {
        try {
            setLoading(true)
            setError(null)
            const data = await getPickupsService(page, limit)
            setPickups(data.pickups)
            if (data.pagination) {
                setPagination(data.pagination)
            }
        } catch (error) {
            const err = error as HandledError
            setError(err.message)
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchPickups()
    }, [fetchPickups])

    const handlePageChange = (newPage: number) => {
        fetchPickups(newPage, pagination.limit)
    }

    return (
        <div className="relative mx-auto  w-full space-y-8 p-4 font-sans sm:p-6 lg:px-8 2xl:max-w-[1800px]" dir="ltr">
            {error && !loading && (
                <Banner tone="critical" title="Failed to load pickups">
                    <InlineStack align="space-between" blockAlign="center">
                        <Text variant="bodySm" as="span">{error}</Text>
                        <Button onClick={() => fetchPickups(pagination.page, pagination.limit)} size="slim">
                            Retry
                        </Button>
                    </InlineStack>
                </Banner>
            )}
            <PickupTable pickups={pickups} pagination={pagination} onPageChange={handlePageChange} loading={loading} />
        </div>
    )
}

export default PickupWrapper