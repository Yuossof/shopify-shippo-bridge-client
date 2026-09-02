import { errorHandler } from "@/lib/app-error";
import { axiosInstance } from "@/lib/axios";

export async function getOrderService(orderId: string) {
    try {
        const response = await axiosInstance.get(`/orders/${orderId}`)
        console.log(response.data)
        return response.data.data.items
    } catch (error) {
        throw errorHandler(error)
    }
}