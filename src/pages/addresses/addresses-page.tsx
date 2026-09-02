import { useEffect, useState, useCallback } from 'react'
import { Plus, MapPin } from 'lucide-react'
import { axiosInstance } from '@/lib/axios'
import { errorHandler } from '@/lib/app-error'
import { Button } from '@/components/ui/button'
import { Address } from '@/features/addresses/types/addresses.types'
import CreateAddressModal from '@/features/addresses/components/create-address-modal'
import AddressesTable from '@/features/addresses/components/addresses-table'
import AddressesLoadingState from '@/features/addresses/components/addresses-loading-state'
import AddressesErrorState from '@/features/addresses/components/addresses-error-state'
import AddressesEmptyState from '@/features/addresses/components/addresses-empty-state'

const AddressesPage = () => {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axiosInstance.get('/address')
      console.log(response.data)
      const data = response.data.addresses || []
      setAddresses(data)
    } catch (err: unknown) {
      const handled = errorHandler(err)
      setError(handled.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAddresses()
  }, [fetchAddresses])

  if (loading) {
    return <AddressesLoadingState />
  }

  if (error) {
    return <AddressesErrorState message={error} onRetry={fetchAddresses} />
  }

  return (
    <div className="relative mx-auto w-full space-y-8 p-4 font-sans sm:p-6 lg:px-8 2xl:max-w-[1800px]">
      <div className="flex items-center justify-between px-4 md:px-0">
        <div>
          <h1 className="text-lg font-bold text-[var(--text-h)] flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Addresses
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {addresses.length} address{addresses.length !== 1 ? 'es' : ''} stored
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="gap-1.5">
          <Plus className="h-4 w-4" />
          Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <AddressesEmptyState />
      ) : (
        <AddressesTable addresses={addresses} />
      )}

      <CreateAddressModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchAddresses}
      />
    </div>
  )
}

export default AddressesPage
