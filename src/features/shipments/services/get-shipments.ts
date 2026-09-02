import { errorHandler } from "@/lib/app-error"
import { axiosInstance } from "@/lib/axios"

export const getShipmentsService = async (page: number = 1, limit: number = 50) => {
    try {
        const response = await axiosInstance.get('/shipments', { params: { page, limit } })
        return response.data
    } catch (error) {
        throw errorHandler(error)
    }
}