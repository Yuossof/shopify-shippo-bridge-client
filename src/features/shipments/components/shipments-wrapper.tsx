import { useCallback, useEffect, useState } from 'react'
import { getShipmentsService } from '../services/get-shipments'
import { HandledError } from '@/lib/app-error'
import toast from 'react-hot-toast'
import ShipmentsTable from './shipmets-table'

interface Pagination {
    total: number
    page: number
    limit: number
    totalPages: number
}

const ShipmentsWrapper = () => {
    const [shipments, setShipments] = useState([])
    const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 50, totalPages: 1 })
    const [loading, setLoading] = useState(true)

    const fetchShipments = useCallback(async (page: number = 1, limit: number = 50) => {
        try {
            setLoading(true)
            const data = await getShipmentsService(page, limit)
            console.log(data.shipments)
            setShipments(data.shipments)
            if (data.pagination) {
                setPagination(data.pagination)
            }
        } catch (error) {
            const err = error as HandledError
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchShipments()
    }, [fetchShipments])

    const handlePageChange = (newPage: number) => {
        fetchShipments(newPage, pagination.limit)
    }

    return (
        <div className="relative mx-auto  w-full space-y-8 p-4 font-sans sm:p-6 lg:px-8 2xl:max-w-[1800px]" dir="ltr">
            <ShipmentsTable shipments={shipments} pagination={pagination} onPageChange={handlePageChange} loading={loading} />
        </div>
    )
}

export default ShipmentsWrapper