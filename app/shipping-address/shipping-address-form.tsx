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

  // Sync form values with state on mount
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
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <MapPin className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Shipping Address</h1>
          <p className="text-sm text-muted-foreground">Enter your complete shipping information</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="font-medium text-lg text-gray-800">Personal Information</h2>

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} className="focus-visible:ring-primary" />
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
                      <Input placeholder="+1 (555) 123-4567" {...field} className="focus-visible:ring-primary" />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h2 className="font-medium text-lg text-gray-800">Address Information</h2>

              <FormField
                control={form.control}
                name="streetAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} className="focus-visible:ring-primary" />
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
                        <Input placeholder="New York" {...field} className="focus-visible:ring-primary" />
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
                        <Input placeholder="NY" {...field} className="focus-visible:ring-primary" />
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
                        <Input placeholder="10001" {...field} className="focus-visible:ring-primary" />
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
                        <Input placeholder="United States" {...field} className="focus-visible:ring-primary" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Coordinates */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="font-medium text-lg text-gray-800 mb-4">Location Coordinates (Optional)</h2>
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
                        className="focus-visible:ring-primary"
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
                        className="focus-visible:ring-primary"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full md:w-auto px-6 py-3 bg-primary hover:bg-primary/90 transition-colors"
            >
              {isPending ? (
                <Loader className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <ArrowRight className="w-4 h-4 mr-2" />
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
