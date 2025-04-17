'use client';

import { useRouter } from 'next/navigation';
import { toast as sonnerToast } from 'sonner';
import { useTransition } from 'react';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.action';
import { ArrowRight, Loader, Minus, Plus } from 'lucide-react';
import { Cart, CartItem } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/constant/utils';

function AddButton({ item }: { item: CartItem }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      disabled={isPending}
      variant="outline"
      className="h-8 w-8 p-0 rounded-full"
      onClick={() =>
        startTransition(async () => {
          const res = await addItemToCart(item);
          if (!res.success) sonnerToast.error(res.message);
        })
      }
    >
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="w-4 h-4" />
      )}
    </Button>
  );
}

function RemoveButton({ item }: { item: CartItem }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      disabled={isPending}
      variant="outline"
      className="h-8 w-8 p-0 rounded-full"
      onClick={() =>
        startTransition(async () => {
          const res = await removeItemFromCart(item.productId);
          if (!res.success) sonnerToast.error(res.message);
        })
      }
    >
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Minus className="w-4 h-4" />
      )}
    </Button>
  );
}

const CartTable = ({ cart }: { cart?: Cart }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Your Cart</h1>
      
      {!cart || cart.items.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <div className="text-gray-500 text-lg">Your cart is empty</div>
          <Button asChild variant="outline">
            <Link href="/" className="gap-2">
              Start Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile-friendly cart items */}
          <div className="lg:hidden space-y-4">
            {cart.items.map((item) => (
              <Card key={item.slug} className="p-4">
                <div className="flex gap-4">
                  <div className="relative w-20 h-20 rounded-md overflow-hidden border">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <Link href={`/product/${item.slug}`} className="font-medium text-gray-900 line-clamp-2">
                      {item.name}
                    </Link>
                    <div className="mt-2 text-lg font-medium text-gray-900">
                      {formatCurrency(item.price)}
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <RemoveButton item={item} />
                        <span className="w-8 text-center font-medium">
                          {item.qty}
                        </span>
                        <AddButton item={item} />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden lg:block lg:flex-1">
            <Table className="border rounded-lg overflow-hidden">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[50%]">Product</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.slug} className="hover:bg-gray-50/50">
                    <TableCell>
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex items-center gap-4"
                      >
                        <div className="relative w-16 h-16 rounded-md overflow-hidden border">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium text-gray-900">{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-3">
                        <RemoveButton item={item} />
                        <span className="w-8 text-center font-medium">
                          {item.qty}
                        </span>
                        <AddButton item={item} />
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-gray-900">
                      {formatCurrency(item.price)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Card className="lg:sticky lg:top-8 h-fit lg:w-80">
            <CardContent className="p-4 sm:p-6 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal ({cart.items.reduce((a, c) => a + c.qty, 0)})</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(cart.itemsPrice)}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Shipping calculated at checkout</p>
              </div>
              
              <Button
                size="lg"
                className="w-full gap-2"
                onClick={() => startTransition(() => router.push('/shipping-address'))}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Checkout
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CartTable;