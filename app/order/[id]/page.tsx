import { Metadata } from 'next';
import { getOrderById } from '@/lib/actions/order.action';
import { notFound, redirect } from 'next/navigation';
import OrderDetailsTable from './order-details-table';
import { ShippingAddress } from '@/types';
import { auth } from '@/auth';

// Helper function to convert Decimal to number
const decimalToNumber = (decimal: any) => parseFloat(decimal.toString());

export const metadata: Metadata = {
  title: 'Order Details',
};

const OrderDetailsPage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await props.params;

  const order = await getOrderById(id);
  if (!order) notFound();

  const session = await auth();

  

  // Convert all Decimal fields to numbers, including orderitems
  const orderWithConvertedPrices = {
    ...order,
    itemsPrice: decimalToNumber(order.itemsPrice),
    shippingPrice: decimalToNumber(order.shippingPrice),
    taxPrice: decimalToNumber(order.taxPrice),
    totalPrice: decimalToNumber(order.totalPrice),
    orderitems: order.orderitems.map((item) => ({
      ...item,
      price: decimalToNumber(item.price),
    })),
  };



  return (
    <OrderDetailsTable
      order={{
        ...orderWithConvertedPrices,
        shippingAddress: order.shippingAddress as ShippingAddress,
        paymentMethod: order.PaymentMethod, // Ensure paymentMethod is included
      }}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
     
    />
  );
};

export default OrderDetailsPage;
