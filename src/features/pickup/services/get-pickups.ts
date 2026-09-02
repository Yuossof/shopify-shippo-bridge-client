import { errorHandler } from "@/lib/app-error"
import { axiosInstance } from "@/lib/axios"

export const getPickupsService = async (page: number = 1, limit: number = 50) => {
    try {
        const response = await axiosInstance.get('/pickups', { params: { page, limit } })
        return response.data
    } catch (error) {
        throw errorHandler(error)
    }
}