'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { ShippingAddress } from '@/types';
import { shippingAddressSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader } from 'lucide-react';
import { updateUserAddress } from '@/lib/actions/user.action';
import { shippingAddressDefaultValues } from '@/lib/constant';
import { Card, CardContent } from '@/components/ui/card';

const ShippingAddressForm = ({ address }: { address: ShippingAddress }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues,
  });

  const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (values) => {
    startTransition(async () => {
      try {
        const res = await updateUserAddress(values);

        if (!res.success) {
          toast.error(res.message);
          return;
        }

        toast.success('Shipping address saved successfully!');
        router.push('/payment-method');
      } catch (error) {
        toast.error('An unexpected error occurred. Please try again.');
        console.error('Error updating address:', error);
      }
    });
  };

  // Add form state logging for debugging
  console.log('Form state:', {
    isSubmitting: form.formState.isSubmitting,
    isValid: form.formState.isValid,
    errors: form.formState.errors
  });

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6 sm:p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shipping Address</h1>
            <p className="text-gray-600">
              Enter your shipping information to proceed with your order
            </p>
          </div>

          <Form {...form}>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit(onSubmit)(e).catch(console.error);
              }} 
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          className="focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+1 (555) 123-4567"
                          className="focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="streetAddress"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123 Main St"
                          className="focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="New York"
                          className="focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        State/Province *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="NY"
                          className="focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="10001"
                          className="focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        Country *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="United States"
                          className="focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full md:w-auto px-8 py-4 text-base font-medium"
                  disabled={isPending || !form.formState.isValid}
                >
                  {isPending ? (
                    <Loader className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <ArrowRight className="w-5 h-5 mr-2" />
                  )}
                  Continue to Payment
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShippingAddressForm;