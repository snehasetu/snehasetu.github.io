import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { Heart, LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { user, supabaseUser, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'oah') return '/dashboard/oah'; // Approved or pending both go here (pending shows message)
    return '/dashboard/volunteer';
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2 hover-elevate active-elevate-2 px-2 py-1 rounded-md transition-all cursor-pointer">
              <Heart className="h-6 w-6 text-primary fill-primary" />
              <span className="text-xl font-bold">Snehasetu</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link href="/" data-testid="link-nav-home">
              <Button variant="ghost" size="sm">Home</Button>
            </Link>
            <Link href="/needs" data-testid="link-nav-needs">
              <Button variant="ghost" size="sm">Discover Needs</Button>
            </Link>
            <Link href="/homes" data-testid="link-nav-homes">
              <Button variant="ghost" size="sm">Old Age Homes</Button>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {user && supabaseUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full" data-testid="button-user-menu">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatarUrl || undefined} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      {user.role === 'oah' && !user.approved && (
                        <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">
                          Pending Approval
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href={getDashboardLink()}>
                    <DropdownMenuItem data-testid="menu-dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} data-testid="menu-logout">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" data-testid="button-login">
                    Log In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" data-testid="button-signup">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
