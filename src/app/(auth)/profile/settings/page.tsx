"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Lock, Bell, Trash2 } from "lucide-react";

/**
 * Settings page - Placeholder for future features
 */
export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Paramètres
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Password Change Section */}
          <div className="pb-6 border-b">
            <h3 className="text-lg font-semibold flex items-center mb-2">
              <Lock className="h-5 w-5 mr-2" />
              Mot de passe
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Changez votre mot de passe pour sécuriser votre compte
            </p>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                🚧 Fonctionnalité en cours de développement
              </p>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="pb-6 border-b">
            <h3 className="text-lg font-semibold flex items-center mb-2">
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Gérez vos préférences de notification par email et push
            </p>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                🚧 Fonctionnalité en cours de développement
              </p>
            </div>
          </div>

          {/* Delete Account Section */}
          <div>
            <h3 className="text-lg font-semibold flex items-center mb-2 text-destructive">
              <Trash2 className="h-5 w-5 mr-2" />
              Zone de danger
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Supprimer définitivement votre compte et toutes vos données
            </p>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                🚧 Fonctionnalité en cours de développement
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
