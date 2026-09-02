import {  useState } from 'react'
import ShippoApiKeyForm from './shippo-api-key-form';

import { toast } from 'react-hot-toast';

import { axiosInstance } from "../../../../lib/axios"
import { errorHandler } from '@/lib/app-error';


const Wrapper = () => {
  const [shippoApiKey, setShippoApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false)


  const handleStoreApiKey = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const response = await axiosInstance.post("/settings/shippo", {
        shippo_api_key: shippoApiKey,
      })

      console.log(response)
      toast.success(response.data.message)
    } catch (error) {
      const err = errorHandler(error)
      toast.error(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center ">
      <ShippoApiKeyForm
        setKey={setShippoApiKey}
        handleStoreApiKey={handleStoreApiKey}
        isLoading={isLoading}
      />
    </div>
  )
}

export default Wrapper