"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ShoppingBag, Shield, User } from "lucide-react";

export default function HomePage() {
  const { isLoggedIn, user, isAdmin } = useAuth();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <ShoppingBag className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            Bienvenue sur YouShop
          </h1>
          <p className="text-lg text-gray-600">
            Votre plateforme e-commerce de confiance
          </p>
        </div>

        {/* User Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Statut de connexion</CardTitle>
            <CardDescription>
              Informations sur votre session actuelle
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoggedIn && user ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-500" />
                    <span className="font-medium">
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                  <Badge variant={isAdmin ? "destructive" : "default"}>
                    {isAdmin ? (
                      <>
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                      </>
                    ) : (
                      "Client"
                    )}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Email:</strong> {user.email}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>ID:</strong> {user._id}
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-600 mb-4">
                  Vous n&apos;êtes pas connecté
                </p>
                <div className="flex justify-center space-x-4">
                  <Button asChild>
                    <Link href="/login">Se connecter</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/register">Créer un compte</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/products">
              <CardHeader>
                <CardTitle className="text-lg">Produits</CardTitle>
                <CardDescription>Découvrez notre catalogue</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          {isLoggedIn && (
            <>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <Link href="/orders">
                  <CardHeader>
                    <CardTitle className="text-lg">Mes commandes</CardTitle>
                    <CardDescription>Suivez vos achats</CardDescription>
                  </CardHeader>
                </Link>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <Link href="/profile">
                  <CardHeader>
                    <CardTitle className="text-lg">Mon profil</CardTitle>
                    <CardDescription>Gérez votre compte</CardDescription>
                  </CardHeader>
                </Link>
              </Card>
            </>
          )}

          {isAdmin && (
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-red-200 bg-red-50">
              <Link href="/admin">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-red-600" />
                    Administration
                  </CardTitle>
                  <CardDescription>
                    Panneau d&apos;administration
                  </CardDescription>
                </CardHeader>
              </Link>
            </Card>
          )}
        </div>

        {/* Feature Highlights */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Fonctionnalités implémentées
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Connexion / Inscription</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Validation des formulaires</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Persistance de session</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Routes protégées</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Gestion des rôles (Admin/Client)</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Menu utilisateur avec dropdown</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Toast notifications</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Badge panier (Zustand)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
