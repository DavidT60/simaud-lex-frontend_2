import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth.context";
import { userAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useTheme } from "@/contexts/theme.context";
import { Layout } from "@/components/layout/Layout";
import { Loader2, Save, User, Settings, Bell, Moon, Sun, Lock } from "lucide-react";

export const UserConfigPage = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { register, handleSubmit, setValue, watch } = useForm();
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const loadConfig = async () => {
      if (user?.id) {
        try {
          const config = await userAPI.getConfig(user.id);
          if (config) {
            setValue("theme", config.theme || "light");
            setValue("language", config.language || "es");
            setValue("notifications_enabled", config.notifications_enabled);
          }
        } catch (error) {
          console.error("Error loading config:", error);
          toast.error("Error al cargar la configuración");
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadConfig();
  }, [user, setValue]);

  const onSubmit = async (data: any) => {
    if (!user?.id) return;
    setIsSaving(true);
    try {
      if (activeTab === "security") {
         if (!data.currentPassword || !data.newPassword) {
            toast.error("Debes llenar todos los campos");
            setIsSaving(false);
            return;
         }
         await userAPI.updatePassword(user.id, {
            currentPassword: data.currentPassword,
            newPassword: data.newPassword
         });
         toast.success("Contraseña actualizada correctamente");
         setValue("currentPassword", "");
         setValue("newPassword", "");
      } else {
        await userAPI.updateConfig(user.id, data);

        // Sync theme context if changed
        if (data.theme !== theme) {
            setTheme(data.theme);
        }
        toast.success("Configuración guardada correctamente");
      }
    } catch (error: any) {
      console.error("Error saving config:", error);
      const msg = error.response?.data?.message || "Error al guardar la configuración";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 max-w-4xl animate-in fade-in duration-500">
        <h1 className="text-3xl font-bold mb-8 text-primary-900 dark:text-white">
          Configuración de Usuario
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <div className="md:col-span-3 space-y-2">
            <Button
              variant={activeTab === "profile" ? "accent" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("profile")}
            >
              <User className="mr-2 h-4 w-4" />
              Perfil
            </Button>
            <Button
              variant={activeTab === "preferences" ? "accent" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("preferences")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Preferencias
            </Button>
            <Button
              variant={activeTab === "notifications" ? "accent" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("notifications")}
            >
              <Bell className="mr-2 h-4 w-4" />
              Notificaciones
            </Button>
            <Button
              variant={activeTab === "security" ? "accent" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("security")}
            >
              <Lock className="mr-2 h-4 w-4" />
              Seguridad
            </Button>
          </div>

          {/* Main Content */}
          <div className="md:col-span-9">
            <form onSubmit={handleSubmit(onSubmit)}>
              {activeTab === "profile" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Información del Perfil</CardTitle>
                    <CardDescription>
                      Visualiza tu información personal básica.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">
                        Nombre Completo
                      </label>
                      <Input
                        value={user?.name || ""}
                        disabled
                        className="bg-slate-50 dark:bg-slate-900"
                      />
                      <p className="text-xs text-muted-foreground">
                        El nombre es administrado por el sistema de
                        autenticación.
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">
                        Correo Electrónico - No puede ser modificado -
                      </label>
                      <Input
                        value={user?.email || ""}
                        disabled
                        className="bg-slate-50 dark:bg-slate-900"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "preferences" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Preferencias del Sistema</CardTitle>
                    <CardDescription>
                      Personaliza tu experiencia en SIMAUD-LEX.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Tema de la Interfaz
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                          <input
                            type="radio"
                            value="light"
                            {...register("theme")}
                            className="w-4 h-4 text-primary"
                          />
                          <Sun className="h-5 w-5 text-orange-500" />
                          <span>Claro</span>
                        </div>
                        <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                          <input
                            type="radio"
                            value="dark"
                            {...register("theme")}
                            className="w-4 h-4 text-primary"
                          />
                          <Moon className="h-5 w-5 text-indigo-400" />
                          <span>Oscuro</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Idioma</label>
                      <select
                        {...register("language")}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="es">Español</option>
                        <option value="en">English (Beta)</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "notifications" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración de Notificaciones</CardTitle>
                    <CardDescription>
                      Administra cómo deseas recibir alertas.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg">
                      <div className="flex flex-col space-y-1">
                        <span className="font-medium">
                          Notificaciones del Sistema
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Recibir alertas sobre actualizaciones de casos y
                          sistema.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        {...register("notifications_enabled")}
                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "security" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Seguridad</CardTitle>
                    <CardDescription>
                      Actualiza tu contraseña y configuración de seguridad.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                       <label className="text-sm font-medium">Contraseña Actual</label>
                       <Input
                         type="password"
                         {...register("currentPassword", { required: true })}
                         className="bg-slate-50 dark:bg-slate-900"
                         placeholder="••••••••"
                       />
                    </div>
                    <div className="grid gap-2">
                       <label className="text-sm font-medium">Nueva Contraseña</label>
                       <Input
                         type="password"
                         {...register("newPassword", { required: true, minLength: 6 })}
                         className="bg-slate-50 dark:bg-slate-900"
                         placeholder="••••••••"
                       />
                       <p className="text-xs text-muted-foreground">Mínimo 6 caracteres.</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab !== "profile" && (
                <div className="mt-6 flex justify-end">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isSaving ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};
