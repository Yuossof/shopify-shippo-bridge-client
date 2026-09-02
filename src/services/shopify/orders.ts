import { errorHandler } from "@/lib/app-error"
import { axiosInstance } from "@/lib/axios"

export const getOrderService = async (orderId: string) => {
    try {
        const response = await axiosInstance(`/orders/${orderId}`)
        console.log(response.data)
        return response.data
    } catch (error) {
        throw errorHandler(error)
    }
}