// app/order/[id]/page.tsx

import { Metadata } from 'next';
import { getOrderById } from '@/lib/actions/order.action';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Order Details',
};

export const dynamic = 'force-dynamic';

interface OrderDetailsPageProps {
  params: { id: string };
}

const OrderDetailsPage = async ({ params }: OrderDetailsPageProps) => {
  const order = await getOrderById(params.id); // ✅ Access `params.id` directly

  if (!order) return notFound();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Order Details</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <tbody className="divide-y divide-gray-200">
            <Row label="Customer Name" value={order.user?.name || 'N/A'} />
            <Row label="Email" value={order.user?.email || 'N/A'} />
            <Row label="Total Price" value={`$${Number(order.totalPrice).toFixed(2)}`} />
            <Row label="Tax" value={`$${Number(order.taxPrice).toFixed(2)}`} />
            <Row label="Shipping Price" value={`$${Number(order.shippingPrice).toFixed(2)}`} />
            <Row label="Payment Status" value={order.isPaid ? 'Paid ✅' : 'Not Paid ❌'} />
            <Row label="Delivery Status" value={order.isDelivered ? 'Delivered 🚚' : 'Pending ⏳'} />
            <Row label="Created At" value={new Date(order.createdAt).toLocaleString()} />
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <tr className="hover:bg-gray-50 transition-colors">
    <td className="px-6 py-4 font-medium text-gray-600">{label}</td>
    <td className="px-6 py-4 text-gray-900">{value}</td>
  </tr>
);

export default OrderDetailsPage;
