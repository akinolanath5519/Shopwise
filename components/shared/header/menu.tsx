import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Menu as MenuIcon, ShoppingCart, User } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import UserButton from './user-button';
import { cn } from '@/lib/constant/utils';

const Menu = () => {
  return (
    <div className="flex items-center justify-end gap-2 md:gap-4">
      {/* Desktop Menu */}
      <nav className="hidden md:flex items-center gap-2">
        {/* Cart Button */}
        <Button 
          asChild 
          variant="ghost" 
          size="sm"
          className="group rounded-full hover:bg-gray-100 transition-colors"
        >
          <Link href="/cart" className="flex items-center gap-1.5 px-3">
            <ShoppingCart className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span className="text-sm font-medium">Cart</span>
            {/* Optional cart count badge */}
          
          </Link>
        </Button>

        {/* User Button */}
        <div className="px-1">
          <UserButton />
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-gray-100"
              aria-label="Open menu"
            >
              <MenuIcon className="h-10 w-10" />
            </Button>
          </SheetTrigger>
          
          <SheetContent side="right" className="w-[300px] sm:w-[350px]">
            <SheetHeader className="text-left mb-6">
              <SheetTitle className="text-2xl font-bold">Menu</SheetTitle>
            </SheetHeader>
            
            <div className="flex flex-col gap-2">
              {/* Cart Link */}
              <Button 
                asChild 
                variant="ghost" 
                className={cn(
                  "w-full justify-start px-4 py-6",
                  "hover:bg-gray-100 transition-colors"
                )}
              >
                <Link href="/cart" className="flex items-center gap-3">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="text-base">Cart</span>
                 
                </Link>
              </Button>

              {/* User Button */}
              <div className="px-1 mt-2">
                <UserButton />
              </div>

              {/* Additional Mobile Links can be added here */}
              {/* <Button 
                asChild 
                variant="ghost" 
                className="w-full justify-start px-4 py-6 hover:bg-gray-100"
              >
                <Link href="/account" className="flex items-center gap-3">
                  <User className="h-5 w-5" />
                  <span className="text-base">Account</span>
                </Link>
              </Button> */}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Menu;