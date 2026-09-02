import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { axiosInstance } from '@/lib/axios';
import { errorHandler, applyFormServerErrors } from '@/lib/app-error';
import { AddressFormValues } from '../types/addresses.types';

export default function CreateAddressForm() {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const form = useForm<AddressFormValues>({
        defaultValues: {
            name: '',
            company: '',
            street1: '',
            street2: '',
            city: '',
            state: '',
            zip: '',
            country: '',
            phone: '',
            email: '',
            is_residential: false,
            metadata: '',
        },
    });

    const onSubmit = async (data: AddressFormValues) => {
        setLoading(true);
        setSuccessMessage(null);
        try {
            const response = await axiosInstance.post('/address', data);
            if (response.data.success) {
                setSuccessMessage('Address created and verified successfully!');
                form.reset();
            }
        } catch (error: unknown) {
            const handled = errorHandler(error);
            if (handled.fieldErrors) {
                applyFormServerErrors(handled.fieldErrors, form);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-background p-6">
            <Card className="w-full max-w-2xl shadow-lg border-border bg-card">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-card-foreground">Add New Address</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Enter the address details below. It will be automatically validated via Shippo.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {successMessage && (
                                <div className="p-4 rounded-lg text-sm font-medium bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                                    {successMessage}
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground font-medium">Full Name *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Shawn Ippotle" {...field} className="focus-visible:ring-indigo-500" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="company"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground font-medium">Company (Optional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Shippo" {...field} className="focus-visible:ring-indigo-500" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="street1"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground font-medium">Street Address *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="215 Clayton St." {...field} className="focus-visible:ring-indigo-500" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="street2"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground font-medium">Apartment, suite, unit, etc. (Optional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Apt 4B" {...field} className="focus-visible:ring-indigo-500" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground font-medium">City *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="San Francisco" {...field} className="focus-visible:ring-indigo-500" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="state"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground font-medium">State / Province *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="CA" {...field} className="focus-visible:ring-indigo-500" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="zip"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground font-medium">ZIP / Postal Code *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="94117" {...field} className="focus-visible:ring-indigo-500" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="country"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground font-medium">Country Code (2 Letters) *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="US" maxLength={2} {...field} className="focus-visible:ring-indigo-500 uppercase" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground font-medium">Phone</FormLabel>
                                            <FormControl>
                                                <Input placeholder="+1 555 341 9393" {...field} className="focus-visible:ring-indigo-500" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground font-medium">Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="shippotle@shippo.com" {...field} className="focus-visible:ring-indigo-500" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="metadata"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground font-medium">Metadata / Extra Info</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Customer ID 123456" {...field} className="focus-visible:ring-indigo-500" />
                                        </FormControl>
                                        <FormDescription className="text-xs text-muted-foreground">
                                            Any additional identifiers you want to link to this address.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="is_residential"
                                render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted/40 border-border">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none ml-2">
                                            <FormLabel className="text-foreground font-medium cursor-pointer">This is a residential address</FormLabel>
                                            <FormDescription className="text-xs text-muted-foreground">
                                                Check this if the address is a home rather than a business location.
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-sm disabled:bg-indigo-400"
                            >
                                {loading ? 'Validating & Saving...' : 'Save & Verify Address'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
