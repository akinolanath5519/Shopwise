'use client';

import { useRouter } from 'next/navigation';
import { toast as sonnerToast } from 'sonner';
import { useTransition } from 'react';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.action';
import { ArrowRight, Loader, Minus, Plus, ShoppingBag } from 'lucide-react';
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
      className="h-8 w-8 p-0 rounded-full border-gray-300 hover:bg-gray-50 active:scale-95 transition-transform"
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
      className="h-8 w-8 p-0 rounded-full border-gray-300 hover:bg-gray-50 active:scale-95 transition-transform"
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingBag className="w-6 h-6 text-primary" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Shopping Bag</h1>
      </div>
      
      {!cart || cart.items.length === 0 ? (
        <div className="text-center py-16 space-y-6 animate-fade-in">
          <div className="text-gray-500 text-lg">Your bag is empty</div>
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/5">
            <Link href="/" className="gap-2">
              Discover Our Collection
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile-friendly cart items */}
          <div className="lg:hidden space-y-4">
            {cart.items.map((item) => (
              <Card 
                key={item.slug}
                className="p-4 border-gray-200 hover:shadow-sm transition-shadow"
              >
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 rounded-md overflow-hidden border border-gray-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                  <div className="flex-1">
                    <Link 
                      href={`/product/${item.slug}`} 
                      className="font-medium text-gray-900 hover:text-primary transition-colors line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <div className="mt-2 text-lg font-semibold text-gray-900">
                      {formatCurrency(item.price)}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <RemoveButton item={item} />
                        <span className="w-8 text-center font-medium">
                          {item.qty}
                        </span>
                        <AddButton item={item} />
                      </div>
                      <div className="text-right font-medium">
                        {formatCurrency(item.price * item.qty)}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden lg:block lg:flex-1">
            <Table className="border rounded-lg overflow-hidden border-gray-200">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[50%] text-gray-600 font-medium">Product</TableHead>
                  <TableHead className="text-center text-gray-600 font-medium">Quantity</TableHead>
                  <TableHead className="text-right text-gray-600 font-medium">Price</TableHead>
                  <TableHead className="text-right text-gray-600 font-medium">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow 
                    key={item.slug} 
                    className="hover:bg-gray-50/30 border-gray-200"
                  >
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
                    <TableCell className="text-right font-semibold text-gray-900">
                      {formatCurrency(item.price * item.qty)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Order Summary */}
          <Card className="lg:sticky lg:top-8 h-fit lg:w-96 border-gray-200">
            <CardContent className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal ({cart.items.reduce((a, c) => a + c.qty, 0)} items)</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(cart.itemsPrice)}
                  </span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Estimated Total</span>
                    <span className="font-bold text-lg text-gray-900">
                      {formatCurrency(cart.itemsPrice)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Shipping & taxes calculated at checkout</p>
                </div>
              </div>
              
              <Button
                size="lg"
                className="w-full gap-2 h-12 bg-primary hover:bg-primary/90 transition-colors active:scale-[0.98]"
                onClick={() => startTransition(() => router.push('/shipping-address'))}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Express checkout available</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CartTable;