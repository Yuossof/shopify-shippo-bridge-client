import React, { useEffect, useState } from "react";
import { Select } from "@shopify/polaris";
import { IAddress } from "@/dto/shippo/address";
import { axiosInstance } from "@/lib/axios";

type Props = {
  selectedAddress: string;
  setSelectedAddress: React.Dispatch<React.SetStateAction<string>>;
}

export function SelectAddress({ selectedAddress, setSelectedAddress }: Props) {
  const [items, setItems] = useState<IAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAddresses = async () => {
      try {
        const response = await axiosInstance.get('/address');
        console.log(response);
        const addresses = response.data.addresses ?? response.data.address ?? [];
        setItems(Array.isArray(addresses) ? addresses : []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getAddresses();
  }, []);

  // 1. تجهيز الخيارات بصيغة Polaris (تتطلب label و value)
  const options = [
    { label: "Choose address", value: "" },
    ...items.map((item) => ({
      label: item.name || "Unnamed Address",
      value: item.address_object_id,
    })),
  ];

  return (
    <Select
      label="Select Address"
      options={options}
      onChange={(value) => setSelectedAddress(value)}
      value={selectedAddress}
      disabled={isLoading}
    />
  );
}