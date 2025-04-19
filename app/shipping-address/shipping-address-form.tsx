"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState, useTransition } from "react";
import { ShippingAddress } from "@/types";
import { shippingAddressSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader, MapPin } from "lucide-react";
import { updateUserAddress } from "@/lib/actions/user.action";
import { shippingAddressDefaultValues } from "@/lib/constant";

const ShippingAddressForm = ({ address }: { address: ShippingAddress }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues,
  });

  const [isPending, startTransition] = useTransition();
  const [latInput, setLatInput] = useState<string>("");
  const [lngInput, setLngInput] = useState<string>("");

  useEffect(() => {
    const { lat, lng } = form.getValues();
    if (lat !== undefined) setLatInput(lat.toString());
    if (lng !== undefined) setLngInput(lng.toString());
  }, [form]);

  const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (values) => {
    startTransition(async () => {
      try {
        const res = await updateUserAddress(values);
        if (!res.success) {
          toast.error(res.message || "Failed to save address");
          return;
        }
        toast.success("Shipping address saved successfully!");
        router.push("/payment-method");
      } catch (error) {
        toast.error("An unexpected error occurred. Please try again.");
        console.error("Submission error:", error);
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-start gap-4 mb-8">
        <div className="bg-primary/10 p-2 rounded-full">
          <MapPin className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Shipping Details</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your complete shipping information for accurate delivery
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Information Section */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                <p className="text-sm text-muted-foreground mt-1">Your contact details</p>
              </div>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="John Doe" 
                          {...field} 
                          className="focus:ring-1 focus:ring-primary border-gray-300"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="+1 (555) 123-4567" 
                          {...field} 
                          className="focus:ring-1 focus:ring-primary border-gray-300"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Address Information Section */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Address Information</h2>
                <p className="text-sm text-muted-foreground mt-1">Where should we deliver?</p>
              </div>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="streetAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Street Address</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="123 Main St" 
                          {...field} 
                          className="focus:ring-1 focus:ring-primary border-gray-300"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">City</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="New York" 
                            {...field} 
                            className="focus:ring-1 focus:ring-primary border-gray-300"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">State/Province</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="NY" 
                            {...field} 
                            className="focus:ring-1 focus:ring-primary border-gray-300"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Postal Code</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="10001" 
                            {...field} 
                            className="focus:ring-1 focus:ring-primary border-gray-300"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Country</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="United States" 
                            {...field} 
                            className="focus:ring-1 focus:ring-primary border-gray-300"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Coordinates Section */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Location Coordinates (Optional)</h2>
              <p className="text-sm text-muted-foreground mt-1">For precise delivery location</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="lat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Latitude</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="40.7128"
                        value={latInput}
                        onChange={(e) => {
                          const val = e.target.value;
                          setLatInput(val);
                          const parsed = parseFloat(val);
                          field.onChange(isNaN(parsed) ? undefined : parsed);
                        }}
                        className="focus:ring-1 focus:ring-primary border-gray-300"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lng"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Longitude</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="-74.0060"
                        value={lngInput}
                        onChange={(e) => {
                          const val = e.target.value;
                          setLngInput(val);
                          const parsed = parseFloat(val);
                          field.onChange(isNaN(parsed) ? undefined : parsed);
                        }}
                        className="focus:ring-1 focus:ring-primary border-gray-300"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full md:w-auto px-8 py-3 text-base font-medium bg-primary hover:bg-primary/90 transition-colors shadow-sm"
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
    </div>
  );
};

export default ShippingAddressForm;