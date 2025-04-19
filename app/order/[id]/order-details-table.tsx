'use client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
    let status = '';

    if (isPending) {
      status = 'Loading PayPal...';
    } else if (isRejected) {
      status = 'Error Loading PayPal';
    }
    return <div className="text-center py-2 text-sm text-muted-foreground">{status}</div>;
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
    <div className="container mx-auto px-4 py-6">
     
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Method Card */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
              <div className="flex flex-col space-y-2">
                <p className="font-medium">{paymentMethod}</p>
                {isPaid ? (
                  <Badge className="w-fit" variant="secondary">
                    Paid at {formatDateTime(paidAt!).dateTime}
                  </Badge>
                ) : (
                  <Badge className="w-fit" variant="destructive">
                    Not paid
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address Card */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
              <div className="space-y-2">
                <p className="font-medium">{shippingAddress.fullName}</p>
                <p className="text-muted-foreground">
                  {shippingAddress.streetAddress}, {shippingAddress.city}
                  {shippingAddress.postalCode}, {shippingAddress.country}
                </p>
                {isDelivered ? (
                  <Badge className="w-fit mt-2" variant="secondary">
                    Delivered at {formatDateTime(deliveredAt!).dateTime}
                  </Badge>
                ) : (
                  <Badge className="w-fit mt-2" variant="destructive">
                    Not Delivered
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Items Card */}
          <Card className="shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <h2 className="text-lg font-semibold p-6 pb-4">Order Items</h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="min-w-[200px]">Item</TableHead>
                      <TableHead className="w-[100px]">Quantity</TableHead>
                      <TableHead className="text-right w-[100px]">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderitems.map((item) => (
                      <TableRow key={item.slug}>
                        <TableCell>
                          <Link
                            href={`/product/${item.slug}`}
                            className="flex items-center hover:underline"
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                              className="rounded-md object-cover"
                            />
                            <span className="ml-3">{item.name}</span>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <span>{item.qty}</span>
                        </TableCell>
                        <TableCell className="text-right">
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
        <div className="space-y-6">
          <Card className="shadow-sm sticky top-6">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-medium">{formatCurrency(itemsPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">{formatCurrency(taxPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">{formatCurrency(shippingPrice)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold">{formatCurrency(totalPrice)}</span>
                </div>

                {/* PayPal Payment */}
                {!isPaid && paymentMethod === 'PayPal' && (
                  <div className="pt-4 mt-4 border-t">
                    <PayPalScriptProvider options={{ 
                      clientId: paypalClientId,
                      components: "buttons",
                      currency: "USD",
                      intent: "capture"
                    }}>
                      <PrintLoadingState />
                      <div className="paypal-buttons-container">
                        <PayPalButtons
                          style={{ 
                            layout: "vertical",
                            color: "gold",
                            shape: "rect",
                            label: "paypal",
                            height: 40
                          }}
                          createOrder={handleCreatePayPalOrder}
                          onApprove={handleApprovePayPalOrder}
                        />
                      </div>
                    </PayPalScriptProvider>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsTable;