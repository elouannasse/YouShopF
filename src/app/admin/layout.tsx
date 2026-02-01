"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FolderTree,
  Home,
  Menu,
  User,
  LogOut,
  Bell,
  Search,
  Settings,
  ChevronLeft,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: "Produits",
    href: "/admin/products",
    icon: Package,
    badge: null,
  },
  {
    name: "Commandes",
    href: "/admin/orders",
    icon: ShoppingCart,
    badge: "3", // Example notification
  },
  {
    name: "Catégories",
    href: "/admin/categories",
    icon: FolderTree,
    badge: null,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    badge: null,
  },
];

function Sidebar({ className, collapsed = false }: { className?: string; collapsed?: boolean }) {
  const pathname = usePathname();

  return (
    <div className={cn(
      "flex h-full flex-col border-r bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800",
      className
    )}>
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6 bg-white/50 backdrop-blur-sm">
        <Link href="/admin" className="flex items-center gap-3 font-bold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          {!collapsed && (
            <span className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              YouShop
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02]",
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                  : "text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-md dark:text-slate-300 dark:hover:bg-slate-800"
              )}
            >
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                isActive 
                  ? "bg-white/20" 
                  : "bg-slate-100 group-hover:bg-slate-200 dark:bg-slate-700 dark:group-hover:bg-slate-600"
              )}>
                <item.icon className="h-4 w-4" />
              </div>
              {!collapsed && (
                <>
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <Badge variant={isActive ? "secondary" : "default"} className="h-5 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t bg-white/50 p-4 space-y-2">
        <Link href="/admin/settings">
          <Button variant="ghost" className={cn(
            "w-full justify-start gap-3 hover:bg-slate-100",
            collapsed && "justify-center"
          )}>
            <Settings className="h-4 w-4" />
            {!collapsed && "Paramètres"}
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" className={cn(
            "w-full justify-start gap-3 border-slate-200 hover:bg-slate-50",
            collapsed && "justify-center"
          )}>
            <Home className="h-4 w-4" />
            {!collapsed && "Retour au site"}
          </Button>
        </Link>
      </div>
    </div>
  );
}

function Header({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const userInitials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "A";

  // Get page title from pathname
  const getPageTitle = () => {
    if (pathname === "/admin") return "Dashboard";
    if (pathname.includes("/products")) return "Produits";
    if (pathname.includes("/orders")) return "Commandes";
    if (pathname.includes("/categories")) return "Catégories";
    if (pathname.includes("/analytics")) return "Analytics";
    return "Admin";
  };

  return (
    <header className="flex h-16 items-center border-b bg-white/80 backdrop-blur-sm px-6 sticky top-0 z-40">
      <div className="flex flex-1 items-center gap-4">
        {/* Mobile menu & Desktop collapse */}
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <Sidebar />
            </SheetContent>
          </Sheet>
          
          {/* Desktop collapse button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden lg:flex"
            onClick={onToggleSidebar}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Page Title */}
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-slate-800">{getPageTitle()}</h1>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md ml-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input 
              placeholder="Rechercher produits, commandes..."
              className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500">
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 gap-2 px-3 hover:bg-slate-100">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-sm">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-slate-500">Administrateur</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Mon profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Paramètres
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!isLoading && user && user.role?.toLowerCase() !== "admin") {
      router.replace("/");
    } else if (!isLoading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-slate-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role?.toLowerCase() !== "admin") {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-slate-600 font-medium">Redirection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className={cn(
        "hidden lg:block transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "w-20" : "w-64"
      )}>
        <Sidebar collapsed={sidebarCollapsed} />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100 p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
