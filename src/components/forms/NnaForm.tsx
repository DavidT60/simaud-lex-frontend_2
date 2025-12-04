import React from "react";
import { Input } from "@/components/ui/input";

export interface NnaFormData {
  nombre_completo: string;
  fecha_nacimiento: string;
  opinion_nna?: string;
  necesidades_especiales?: string; // Comma separated for simplicity in UI
}

interface NnaFormProps {
  id?: string;
  register: any;
  errors: any;
}

export const NnaForm: React.FC<NnaFormProps> = ({ register, errors }) => {
  return (
    <div className="space-y-4 border p-4 rounded-md bg-gray-50">
      <h3 className="font-medium text-gray-900">Datos del NNA</h3>
      
      <div className="space-y-2">
        <label htmlFor="nna_nombre" className="text-sm font-medium text-gray-700">
          Nombre Completo
        </label>
        <Input
          id="nna_nombre"
          {...register("nna.nombre_completo", { required: "El nombre es requerido" })}
          placeholder="Ej: Juan Pérez"
        />
        {errors.nna?.nombre_completo && (
          <p className="text-sm text-red-500">{errors.nna.nombre_completo.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="nna_fecha" className="text-sm font-medium text-gray-700">
          Fecha de Nacimiento
        </label>
        <Input
          id="nna_fecha"
          type="date"
          {...register("nna.fecha_nacimiento", { required: "La fecha es requerida" })}
        />
        {errors.nna?.fecha_nacimiento && (
          <p className="text-sm text-red-500">{errors.nna.fecha_nacimiento.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="nna_opinion" className="text-sm font-medium text-gray-700">
          Opinión del NNA
        </label>
        <Input
          id="nna_opinion"
          {...register("nna.opinion_nna")}
          placeholder="Opinión breve..."
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="nna_necesidades" className="text-sm font-medium text-gray-700">
          Necesidades Especiales (separadas por coma)
        </label>
        <Input
          id="nna_necesidades"
          {...register("nna.necesidades_especiales")}
          placeholder="Ej: Terapia, Medicación"
        />
      </div>
    </div>
  );
};
