import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { nnaAPI, procesoJudicialAPI } from "@/lib/api";
import { NnaForm, NnaFormData } from "./NnaForm";

interface NewCaseFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  // Case details
  tipoDemanda: string;
  fechaInicio: string;
  
  // Selection IDs
  nnaId?: string;
  
  // Dynamic creation data
  nna?: NnaFormData;
}

export const NewCaseForm: React.FC<NewCaseFormProps> = ({ onSuccess, onCancel }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();
  
  const [nnaMode, setNnaMode] = useState("existing");
  // const [parentMode, setParentMode] = useState("existing"); // Unused for now
  const [nnas, setNnas] = useState<any[]>([]); // Using any[] to avoid strict type issues for now, ideally should be Nna[]
  // const [loadingNnas, setLoadingNnas] = useState(true); // Unused

  useEffect(() => {
    const fetchNnas = async () => {
      try {
        const data = await nnaAPI.getAll();
        setNnas(data);
      } catch (error) {
        console.error("Error fetching NNAs:", error);
      } finally {
        // setLoadingNnas(false);
      }
    };
    fetchNnas();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      let nnaId = data.nnaId;

      // 1. Create NNA if needed
      if (nnaMode === "new" && data.nna) {
        const nnaPayload = {
          nombre_completo: data.nna.nombre_completo,
          fecha_nacimiento: data.nna.fecha_nacimiento,
          opinion_nna: data.nna.opinion_nna || undefined,
          necesidades_especiales: data.nna.necesidades_especiales 
            ? data.nna.necesidades_especiales.split(",").map((s: string) => s.trim()).filter((s: string) => s)
            : [],
        };
        
        console.log("Creating NNA with payload:", nnaPayload);
        const newNna = await nnaAPI.create(nnaPayload);
        nnaId = newNna.id;
      }

      if (!nnaId) {
        alert("Debe seleccionar o crear un NNA");
        return;
      }

      // 2. Create Case
      const casePayload = {
        tipo_demanda: data.tipoDemanda,
        fecha_inicio: data.fechaInicio,
        estado: "EN_PROCESO",
        nnaId: nnaId,
      };
      
      console.log("Creating case with payload:", casePayload);
      
      await procesoJudicialAPI.create(casePayload);

      onSuccess();
    } catch (error: any) {
      console.error("Error creating case:", error);
      console.error("Error response:", error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error?.message ||
                          "Error al crear el caso. Por favor intente nuevamente.";
      
      alert(`Error: ${errorMessage}`);
    }
  };

  // State for NNA Search
  const [nnaSearchTerm, setNnaSearchTerm] = useState("");
  const [isNnaListOpen, setIsNnaListOpen] = useState(false);
  const [selectedNnaName, setSelectedNnaName] = useState("");

  const filteredNnas = nnas.filter(nna => 
    nna.nombre_completo.toLowerCase().includes(nnaSearchTerm.toLowerCase())
  );

  const handleNnaSelect = (nna: any) => {
    setValue("nnaId", nna.id);
    setSelectedNnaName(nna.nombre_completo);
    setNnaSearchTerm(nna.nombre_completo);
    setIsNnaListOpen(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-h-[80vh] overflow-y-auto px-1">
      
      {/* SECCIÓN NNA */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-primary-900">1. Información del NNA</h2>
        <Tabs value={nnaMode} onValueChange={setNnaMode}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">Seleccionar Existente</TabsTrigger>
            <TabsTrigger value="new">Crear Nuevo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="existing" className="space-y-4 pt-4">
            <div className="space-y-2 relative">
              <label className="text-sm font-medium text-gray-700">
                Buscar NNA
              </label>
              <div className="relative">
                <Input
                  placeholder="Escribe para buscar..."
                  value={nnaSearchTerm}
                  onChange={(e) => {
                    setNnaSearchTerm(e.target.value);
                    setIsNnaListOpen(true);
                    if (e.target.value === "") {
                      setValue("nnaId", "");
                      setSelectedNnaName("");
                    }
                  }}
                  onFocus={() => setIsNnaListOpen(true)}
                  className="w-full"
                />
                {isNnaListOpen && nnaSearchTerm && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredNnas.length > 0 ? (
                      filteredNnas.map((nna) => (
                        <div
                          key={nna.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={() => handleNnaSelect(nna)}
                        >
                          <p className="font-medium text-gray-900">{nna.nombre_completo}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(nna.fecha_nacimiento).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        No se encontraron resultados
                      </div>
                    )}
                  </div>
                )}
              </div>
              {errors.nnaId && (
                <p className="text-sm text-red-500">{errors.nnaId.message}</p>
              )}
              {selectedNnaName && (
                <p className="text-sm text-green-600">
                  Seleccionado: <span className="font-medium">{selectedNnaName}</span>
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="new">
            <NnaForm register={register} errors={errors} />
          </TabsContent>
        </Tabs>
      </div>

      {/* SECCIÓN PADRES */}
      {/* <div className="space-y-3">
        <h2 className="text-lg font-semibold text-primary-900">2. Información de los Padres (Opcional)</h2>
        <Tabs value={parentMode} onValueChange={setParentMode}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="none">Omitir / Ya existen</TabsTrigger>
            <TabsTrigger value="create">Registrar Nuevos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create">
            <div className="space-y-6 pt-2">
              <PersonForm 
                prefix="parent1" 
                title="Progenitor 1" 
                register={register} 
                errors={errors} 
              />
              <PersonForm 
                prefix="parent2" 
                title="Progenitor 2 (Opcional)" 
                register={register} 
                errors={errors} 
              />
            </div>
          </TabsContent>
        </Tabs>
      </div> */}

      {/* SECCIÓN DETALLES DEL CASO */}
      <div className="space-y-3 border-t pt-4">
        <h2 className="text-lg font-semibold text-primary-900">2. Detalles del Caso</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tipo de Demanda</label>
            <select
              {...register("tipoDemanda", { required: "Este campo es requerido" })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Seleccione el tipo</option>
              <option value="GUARDA">Guarda</option>
              <option value="ALIMENTOS">Alimentos</option>
              <option value="VISITAS">Visitas</option>
            </select>
            {errors.tipoDemanda && (
              <p className="text-sm text-red-500">{errors.tipoDemanda.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="fechaInicio" className="text-sm font-medium text-gray-700">
              Fecha de Inicio
            </label>
            <Input
              id="fechaInicio"
              type="date"
              {...register("fechaInicio", { required: "La fecha es requerida" })}
            />
            {errors.fechaInicio && (
              <p className="text-sm text-red-500">{errors.fechaInicio.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Procesando..." : "Crear Caso Completo"}
        </Button>
      </div>
    </form>
  );
};
