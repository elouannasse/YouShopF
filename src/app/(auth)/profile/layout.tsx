"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Package, Settings } from "lucide-react";

interface ProfileLayoutProps {
  children: ReactNode;
}

const navigationItems = [
  {
    href: "/profile",
    label: "Mon profil",
    icon: User,
  },
  {
    href: "/profile/orders",
    label: "Mes commandes",
    icon: Package,
  },
  {
    href: "/profile/settings",
    label: "Paramètres",
    icon: Settings,
  },
];

/**
 * Profile layout with sidebar (desktop) and tabs (mobile)
 */
export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mon compte</h1>
        <p className="text-muted-foreground">
          Gérez vos informations personnelles et vos commandes
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:block">
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Tabs Navigation */}
        <div className="lg:hidden mb-6">
          <Tabs value={pathname} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} className="w-full">
                    <TabsTrigger value={item.href} className="w-full">
                      <Icon className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">{item.label}</span>
                      <span className="sm:hidden">{item.label.split(" ")[1]}</span>
                    </TabsTrigger>
                  </Link>
                );
              })}
            </TabsList>
          </Tabs>
        </div>

        {/* Main Content */}
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
