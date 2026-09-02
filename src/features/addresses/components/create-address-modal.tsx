import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { Country, State, City } from 'country-state-city';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

type CreateAddressModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function CreateAddressModal({ open, onClose, onSuccess }: CreateAddressModalProps) {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

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

  const selectedCountry = form.watch('country');
  const selectedState = form.watch('state');

  const countries = useMemo(() => Country.getAllCountries(), []);

  const states = useMemo(() => {
    if (!selectedCountry) return [];
    return State.getStatesOfCountry(selectedCountry);
  }, [selectedCountry]);

  const cities = useMemo(() => {
    if (!selectedCountry) return [];
    if (selectedState) {
      return City.getCitiesOfState(selectedCountry, selectedState);
    }
    return City.getCitiesOfCountry(selectedCountry) ?? [];
  }, [selectedCountry, selectedState]);

  useEffect(() => {
    form.setValue('state', '');
    form.setValue('city', '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry]);

  useEffect(() => {
    form.setValue('city', '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedState]);

  const onSubmit = async (data: AddressFormValues) => {
    setLoading(true);
    setGeneralError(null);
    try {
      const response = await axiosInstance.post('/address', data);
      if (response.data.success) {
        form.reset();
        onSuccess();
        onClose();
      }
    } catch (error: unknown) {
      const handled = errorHandler(error);
      const didSetFieldErrors = handled.fieldErrors
        ? applyFormServerErrors(handled.fieldErrors, form)
        : false;

      // لو مفيش أي field اتظبط بالخطأ، اعرض الرسالة العامة فوق الفورم
      if (!didSetFieldErrors) {
        setGeneralError(handled.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-background shadow-xl animate-in zoom-in-95 duration-150"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border bg-muted/30 p-5">
          <div>
            <h2 className="text-lg font-bold text-(--text-h)">Add New Address</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Enter the address details below. It will be automatically validated via Shippo.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-muted p-1.5 text-muted-foreground transition-colors hover:bg-muted/80"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto p-5">
          {generalError && (
            <div className="mb-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{generalError}</span>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

              {/* الدولة الأول، عشان هي اللي بتفلتر الـ state والـ city */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Country *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="focus:ring-indigo-500">
                            <SelectValue placeholder="Select a country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-64">
                          {countries.map((c) => (
                            <SelectItem key={c.isoCode} value={c.isoCode}>
                              {c.flag} {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        State / Province {states.length > 0 && '*'}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!selectedCountry || states.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger className="focus:ring-indigo-500">
                            <SelectValue
                              placeholder={
                                !selectedCountry
                                  ? 'Select a country first'
                                  : states.length === 0
                                    ? 'No states for this country'
                                    : 'Select a state'
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-64">
                          {states.map((s) => (
                            <SelectItem key={s.isoCode} value={s.isoCode}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">City *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!selectedCountry || cities.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger className="focus:ring-indigo-500">
                            <SelectValue
                              placeholder={
                                !selectedCountry
                                  ? 'Select a country first'
                                  : cities.length === 0
                                    ? 'No cities found'
                                    : 'Select a city'
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-64">
                          {cities.map((city, idx) => (
                            <SelectItem key={`${city.name}-${idx}`} value={city.name}>
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              </div>

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

              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold disabled:bg-indigo-400"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Validating & Saving...
                    </span>
                  ) : (
                    'Save & Verify Address'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
