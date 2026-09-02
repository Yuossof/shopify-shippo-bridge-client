import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';
import { Link } from 'react-router-dom';

interface ShippoApiKeyFormProps {
    setKey: React.Dispatch<React.SetStateAction<string>>;
    handleStoreApiKey: (e: React.FormEvent<HTMLFormElement>) => Promise<void> | void;
    isLoading: boolean;
}

const ShippoApiKeyForm: React.FC<ShippoApiKeyFormProps> = ({ setKey, handleStoreApiKey, isLoading }) => {
    return (
        <div className="container flex justify-center items-center mt-50">

            <form onSubmit={handleStoreApiKey} className="flex flex-col gap-3 justify-center w-1/4">
                {/* <p className="text-green-400 mb-4 text-sm">{successMessage}</p> */}
                <div className='w-full flex justify-center my-3'>
                    <p className='text-xl! font-bold'>Enter Shippo Api key</p>
                </div>
                <div className="flex flex-col gap-3 justify-center">
                    <Input
                        onChange={(e) => setKey(e.target.value)}
                        type="text"
                        placeholder="Enter Shippo api key"
                    />
                    <Link to="#" className='text-xs! text-blue-500 ml-1 hover:underline'>How can I get it?</Link>
                    <Button disabled={isLoading} type="submit" className="cursor-pointer">Submit</Button>
                </div>
            </form>
        </div>
    )
}

export default ShippoApiKeyForm;