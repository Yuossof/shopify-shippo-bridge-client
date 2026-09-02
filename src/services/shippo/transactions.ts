import { errorHandler } from "@/lib/app-error"
import { axiosInstance } from "@/lib/axios"

export const createTransactionService = async (data: any) => {
    try {
        const response = await axiosInstance.post("/transactions", data)
        console.log(response.data)
        return response.data.transaction
    } catch (error) {
        throw errorHandler(error)
    }
}