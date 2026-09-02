import { CreateShipmentDTO } from "@/dto/shippo/create-shipment";
import { SelectedFulfillmentItem } from "@/features/orders/components/order-items-list";
import { errorHandler } from "@/lib/app-error";
import { axiosInstance } from "@/lib/axios";

export const createShipmentService = async (data: CreateShipmentDTO, orderId: string, selectedFulfillments: SelectedFulfillmentItem[]) => {
    try {
        const response = await axiosInstance.post("/shipments", {
            shipmentData: data,
            orderId: orderId,
            items: selectedFulfillments
        })
        console.log(response.data)
        return response.data
    } catch (error) {
        throw errorHandler(error);
    }
}