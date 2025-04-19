'use client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDateTime, formatId } from '@/lib/constant/utils';
import { Order } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { useTransition } from 'react';
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import {
  createPayPalOrder,
  approvePayPalOrder,
} from '@/lib/actions/order.action';
import { toast } from 'sonner';

const OrderDetailsTable = ({
  order,
  paypalClientId,
}: {
  order: Omit<Order, 'paymentResult'>;
  paypalClientId: string;
}) => {
  const {
    id,
    shippingAddress,
    orderitems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    isDelivered,
    isPaid,
    paidAt,
    deliveredAt,
  } = order;

  const PrintLoadingState = () => {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();
    
    if (isPending) {
      return (
        <div className="flex items-center justify-center py-3 gap-2 text-sm text-muted-foreground">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading PayPal...
        </div>
      );
    } else if (isRejected) {
      return (
        <div className="flex items-center justify-center py-3 gap-2 text-sm text-destructive">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          Error Loading PayPal
        </div>
      );
    }
    return null;
  };

  const handleCreatePayPalOrder = async () => {
    const res = await createPayPalOrder(order.id);

    if (!res.success) {
      toast.error(res.message);
    }

    return res.data;
  };

  const handleApprovePayPalOrder = async (data: { orderID: string }) => {
    const res = await approvePayPalOrder(order.id, data);

    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Order Details</h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Order ID: {formatId(id)}</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground"></span>
          <span>{formatDateTime(paidAt || new Date()).dateOnly}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Method Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="px-6 pt-6 pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <span className="bg-primary/10 p-2 rounded-full text-primary">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                  </svg>
                </span>
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-muted p-2 rounded-lg">
                    {paymentMethod === 'PayPal' ? (
                      <svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.74-4.47z"></path>
                      </svg>
                    ) : (
                      <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{paymentMethod}</p>
                    {isPaid ? (
                      <Badge className="mt-1" variant="secondary">
                        Paid on {formatDateTime(paidAt!).dateTime}
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Pending Payment</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="px-6 pt-6 pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <span className="bg-primary/10 p-2 rounded-full text-primary">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </span>
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Recipient</p>
                    <p className="font-medium">{shippingAddress.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Delivery Status</p>
                    {isDelivered ? (
                      <Badge variant="secondary" className="mt-1">
                        Delivered on {formatDateTime(deliveredAt!).dateTime}
                      </Badge>
                    ) : (
                      <Badge variant="outline">In Transit</Badge>
                    )}
                  </div>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="font-medium mb-1">Shipping Address</p>
                  <p className="text-muted-foreground">
                    {shippingAddress.streetAddress}<br />
                    {shippingAddress.city}, {shippingAddress.postalCode}<br />
                    {shippingAddress.country}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items Card */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="px-6 pt-6 pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <span className="bg-primary/10 p-2 rounded-full text-primary">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                  </svg>
                </span>
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="min-w-[220px]">Product</TableHead>
                      <TableHead className="w-[100px] text-center">Qty</TableHead>
                      <TableHead className="text-right w-[120px]">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderitems.map((item) => (
                      <TableRow key={item.slug} className="hover:bg-muted/30">
                        <TableCell>
                          <Link
                            href={`/product/${item.slug}`}
                            className="flex items-center gap-4 group"
                          >
                            <div className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-100 group-hover:shadow-sm transition-shadow">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                              {item.name}
                            </span>
                          </Link>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="bg-muted px-3 py-1 rounded-full">
                            {item.qty}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.price)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Summary */}
        <Card className="lg:sticky lg:top-8 h-fit">
          <CardHeader className="px-6 pt-6 pb-3">
            <CardTitle className="text-xl">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal ({orderitems.reduce((a, c) => a + c.qty, 0)} items)</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(itemsPrice)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(shippingPrice)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(taxPrice)}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Estimated Total</span>
                  <span className="font-bold text-lg text-gray-900">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* PayPal Payment */}
            {!isPaid && paymentMethod === 'PayPal' && (
              <div className="pt-6 mt-6 border-t border-gray-200">
                <PayPalScriptProvider options={{ 
                  clientId: paypalClientId,
                  components: "buttons",
                  currency: "USD",
                  intent: "capture",
                  "disable-funding": "credit,card"
                }}>
                  <PrintLoadingState />
                  <div className="paypal-buttons-container">
                    <PayPalButtons
                      style={{ 
                        layout: "vertical",
                        color: "blue",
                        shape: "pill",
                        label: "pay",
                        height: 45,
                        tagline: false
                      }}
                      createOrder={handleCreatePayPalOrder}
                      onApprove={handleApprovePayPalOrder}
                    />
                  </div>
                </PayPalScriptProvider>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetailsTable;