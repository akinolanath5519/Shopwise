'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { paymentMethodSchema } from '@/lib/validators';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from '@/lib/constant';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader, CreditCard, Banknote, Wallet, QrCode } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { updateUserPaymentMethod } from '@/lib/actions/user.action';

const paymentMethodIcons = {
  'Credit Card': <CreditCard className="w-5 h-5" />,
  'PayPal': <Banknote className="w-5 h-5" />,
  'Apple Pay': <Wallet className="w-5 h-5" />,
  'Google Pay': <Wallet className="w-5 h-5" />,
  'Bank Transfer': <QrCode className="w-5 h-5" />
};

const PaymentMethodForm = ({
  preferredPaymentMethod,
}: {
  preferredPaymentMethod: string | null;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
    },
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = async (values: z.infer<typeof paymentMethodSchema>) => {
    startTransition(async () => {
      const res = await updateUserPaymentMethod(values);

      if (!res.success) {
        toast.error(res.message); 
        return;
      }

      router.push('/place-order');
    });
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <div className="mb-8 text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Payment Method</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Choose how you'd like to pay for your order
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid gap-3"
                    >
                      {PAYMENT_METHODS.map((method) => (
                        <FormItem key={method} className="space-y-0">
                          <FormControl>
                            <div className="relative">
                              <RadioGroupItem
                                value={method}
                                id={method}
                                className="peer sr-only"
                              />
                              <label
                                htmlFor={method}
                                className={cn(
                                  "flex items-center justify-between p-4 border rounded-lg cursor-pointer",
                                  "hover:border-primary transition-all duration-200 hover:shadow-sm",
                                  "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5",
                                  "peer-focus-visible:ring-2 peer-focus-visible:ring-primary/50"
                                )}
                              >
                                <div className="flex items-center gap-4">
                                  <div className={cn(
                                    "p-2 rounded-lg",
                                    field.value === method 
                                      ? "bg-primary text-white" 
                                      : "bg-gray-100 text-gray-600"
                                  )}>
                                    {paymentMethodIcons[method as keyof typeof paymentMethodIcons] || 
                                     <CreditCard className="w-5 h-5" />}
                                  </div>
                                  <FormLabel className="font-medium text-gray-900 cursor-pointer">
                                    {method}
                                  </FormLabel>
                                </div>
                                <div className={cn(
                                  "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors",
                                  field.value === method 
                                    ? "border-primary" 
                                    : "border-gray-300"
                                )}>
                                  <div className={cn(
                                    "h-2.5 w-2.5 rounded-full bg-primary transition-all",
                                    field.value === method ? "scale-100" : "scale-0"
                                  )} />
                                </div>
                              </label>
                            </div>
                          </FormControl>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <div className="pt-2">
              <Button
                type="submit"
                size="lg"
                className="w-full py-3 text-base font-medium bg-primary hover:bg-primary/90 transition-colors shadow-sm"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <ArrowRight className="w-5 h-5 mr-2" />
                )}
                Continue to Order Review
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default PaymentMethodForm;