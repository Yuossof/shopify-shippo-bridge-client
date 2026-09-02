import { errorHandler } from "@/lib/app-error";
import { axiosInstance } from "@/lib/axios";


export const getAddressService = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/address/${id}`)
        console.log(response)
        return response.data.address
    } catch (error) {
        throw errorHandler(error)
    }
}