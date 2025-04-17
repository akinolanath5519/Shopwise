"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, Minus, Loader } from "lucide-react";
import { Cart, CartItem } from "@/types";
import { toast } from "sonner";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.action";
import { useTransition } from "react";

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isAdding, setIsAdding] = useState(false); // Track loading state for adding

  const handleAddToCart = async () => {
    if (isAdding) return; // Prevent multiple clicks during the process
    setIsAdding(true);

    startTransition(async () => {
      try {
        const itemWithProperTypes = {
          ...item,
          qty: Number(item.qty) || 1, // Ensure qty is a number
          price: Number(item.price) || 0, // Ensure price is a number
        };

        const res = await addItemToCart(itemWithProperTypes);

        setIsAdding(false); // Reset after action completes

        // Log the response to the console for debugging
        console.log("Add to Cart Response:", res);

        if (!res.success) {
          // Log the error message for detailed debugging
          console.error("Error adding item to cart:", res.message);
          toast.error(res.message);
          return;
        }

        // Successful add
        toast(res.message, {
          action: {
            label: "Go To Cart",
            onClick: () => router.push("/cart"),
          },
        });
      } catch (error) {
        setIsAdding(false); // Reset if an error occurs

        // Catch any errors and log them
        console.error("Unexpected error during Add to Cart:", error);
        toast.error("An unexpected error occurred while adding to the cart.");
      }
    });
  };

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);
  
      if (res.success) {
        toast("Item removed from cart successfully.");
      } else {
        toast.error("Failed to remove item from cart.");
      }
    });
  };
  
  const existItem = cart?.items.find((x) => x.productId === item.productId);

  return existItem ? (
    <div className="flex items-center gap-2 sm:gap-4">
      <Button
        type="button"
        variant="outline"
        onClick={handleRemoveFromCart}
        className="w-8 sm:w-12 h-8 sm:h-12"
        disabled={isAdding}
      >
        {isAdding ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Minus className="w-4 h-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button
        type="button"
        variant="outline"
        onClick={handleAddToCart}
        className="w-8 sm:w-12 h-8 sm:h-12"
        disabled={isAdding} // Disable during the add process
      >
        {isAdding ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button
      className="w-full sm:w-auto"
      type="button"
      onClick={handleAddToCart}
      disabled={isAdding} // Disable during the add process
    >
      {isAdding ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="w-4 h-4" />
      )}
      Add To Cart
    </Button>
  );
};

export default AddToCart;
