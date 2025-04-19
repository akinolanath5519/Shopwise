import Link from 'next/link';
import { auth } from '@/auth';
import { signOutUser } from '@/lib/actions/user.action';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserIcon, UserRound, ShoppingBag, LogOut, Settings } from 'lucide-react';

const UserButton = async () => {
  const session = await auth();

  if (!session) {
    return (
      <Button asChild variant="outline" className="gap-2">
        <Link href="/sign-in">
          <UserIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Sign In</span>
        </Link>
      </Button>
    );
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? 'U';
  const userImage = session.user?.image;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
          {userImage ? (
            <div className="relative h-8 w-8 rounded-full overflow-hidden border">
              <img
                src={userImage}
                alt={session.user?.name ?? 'User'}
                className="object-cover h-full w-full"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
              {firstInitial}
            </div>
          )}
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 rounded-lg shadow-lg border border-gray-200" 
        align="end" 
        forceMount
      >
        <DropdownMenuLabel className="px-4 py-3">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session.user?.name}
            </p>
            <p className="text-xs text-muted-foreground leading-none truncate">
              {session.user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-gray-100" />

        <DropdownMenuItem asChild className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
          <Link href="/user/profile" className="flex items-center gap-2 w-full">
            <UserRound className="h-4 w-4 text-muted-foreground" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
          <Link href="/user/orders" className="flex items-center gap-2 w-full">
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            <span>Orders</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
          <Link href="/user/settings" className="flex items-center gap-2 w-full">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-100" />

        <DropdownMenuItem className="p-0 hover:bg-transparent">
          <form action={signOutUser} className="w-full">
            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-2 h-auto text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;