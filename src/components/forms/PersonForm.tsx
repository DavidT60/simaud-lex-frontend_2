import React from "react";
import { Input } from "@/components/ui/input";

export interface PersonFormData {
  nombre_completo: string;
  cedula: string;
  ocupacion?: string;
  recursos_economicos?: number;
  entorno_hogar?: string;
}

interface PersonFormProps {
  prefix: string; // 'parent1' or 'parent2'
  title: string;
  register: any;
  errors: any;
}

export const PersonForm: React.FC<PersonFormProps> = ({ prefix, title, register, errors }) => {
  return (
    <div className="space-y-4 border p-4 rounded-md bg-gray-50">
      <h3 className="font-medium text-gray-900">{title}</h3>
      
      <div className="space-y-2">
        <label htmlFor={`${prefix}_nombre`} className="text-sm font-medium text-gray-700">
          Nombre Completo
        </label>
        <Input
          id={`${prefix}_nombre`}
          {...register(`${prefix}.nombre_completo`, { required: "El nombre es requerido" })}
          placeholder="Ej: María González"
        />
        {errors[prefix]?.nombre_completo && (
          <p className="text-sm text-red-500">{errors[prefix].nombre_completo.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor={`${prefix}_cedula`} className="text-sm font-medium text-gray-700">
          Cédula
        </label>
        <Input
          id={`${prefix}_cedula`}
          {...register(`${prefix}.cedula`, { required: "La cédula es requerida" })}
          placeholder="Ej: 001-0000000-0"
        />
        {errors[prefix]?.cedula && (
          <p className="text-sm text-red-500">{errors[prefix].cedula.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor={`${prefix}_ocupacion`} className="text-sm font-medium text-gray-700">
            Ocupación
          </label>
          <Input
            id={`${prefix}_ocupacion`}
            {...register(`${prefix}.ocupacion`)}
            placeholder="Ej: Abogada"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor={`${prefix}_recursos`} className="text-sm font-medium text-gray-700">
            Recursos Económicos
          </label>
          <Input
            id={`${prefix}_recursos`}
            type="number"
            {...register(`${prefix}.recursos_economicos`)}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor={`${prefix}_entorno`} className="text-sm font-medium text-gray-700">
          Entorno Hogar
        </label>
        <Input
          id={`${prefix}_entorno`}
          {...register(`${prefix}.entorno_hogar`)}
          placeholder="Descripción breve..."
        />
      </div>
    </div>
  );
};
