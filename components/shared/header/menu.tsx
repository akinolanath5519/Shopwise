import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { EllipsisVertical, ShoppingCart, UserIcon } from 'lucide-react'; // Import UserIcon for Sign In button
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const Menu = () => {
  return (
    <div className="flex justify-end gap-3">
      {/* Desktop Menu */}
      <nav className="hidden md:flex w-full max-w-xs gap-3">
        {/* Cart Button */}
        <Button asChild variant="ghost">
          <Link href="/cart" className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <span>Cart</span>
          </Link>
        </Button>

        {/* Sign In Button */}
        <Button asChild>
          <Link href="/sign-in" className="flex items-center gap-2">
            <UserIcon className="w-5 h-5" />
            <span>Sign In</span>
          </Link>
        </Button>
      </nav>

      {/* Mobile Menu */}
      <nav className="md:hidden">
        <Sheet>
          {/* The button that opens the sheet */}
          <SheetTrigger className="align-middle">
            <EllipsisVertical className="w-5 h-5" />
          </SheetTrigger>

          {/* Sheet Content */}
          <SheetContent className="flex flex-col items-start mr-4">
            <SheetTitle className="text-xl mb-4">Menu</SheetTitle>

            {/* Cart Link in Mobile Menu */}
            <Button asChild variant="ghost" className="mb-1">
              <Link href="/cart" className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                <span>Cart</span>
              </Link>
            </Button>

            {/* Sign In Link in Mobile Menu */}
            <Button asChild className="mb-1">
              <Link href="/sign-in" className="flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                <span>Sign In</span>
              </Link>
            </Button>

            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
