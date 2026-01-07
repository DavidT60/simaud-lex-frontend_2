
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Layout } from '@/components/layout/Layout';
import { configApi, FieldDTO, RuleDTO, RuleRelationDTO } from '@/lib/config-api';
import { Trash2, Plus, ArrowLeft, Loader2, CheckCircle, XCircle } from 'lucide-react';

export function RuleConfigPage() {
  const [rules, setRules] = useState<RuleDTO[]>([]);
  const [selectedRule, setSelectedRule] = useState<RuleDTO | null>(null);
  const [fields, setFields] = useState<FieldDTO[]>([]);
  const [relations, setRelations] = useState<RuleRelationDTO[]>([]);

  // Form State
  const [selectedFieldId, setSelectedFieldId] = useState('');
  const [operator, setOperator] = useState('EQUALS');
  const [value, setValue] = useState('');

  // UI State
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedRule) {
      loadRelations(selectedRule.id);
    }
  }, [selectedRule]);

  // Auto-hide notifications after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
  };

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [rulesData, fieldsData] = await Promise.all([
        configApi.getAllRules(),
        configApi.getAllFields(),
      ]);
      setRules(rulesData);
      setFields(fieldsData);
    } catch (error) {
      console.error('Error loading config data:', error);
      showNotification('error', 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const loadRelations = async (ruleId: string) => {
    try {
      const data = await configApi.getRelations(ruleId);
      setRelations(data);
    } catch (error) {
      console.error('Error loading relations:', error);
      showNotification('error', 'Error al cargar las relaciones');
    }
  };

  const handleAddRelation = async () => {
    if (!selectedRule || !selectedFieldId) return;

    try {
      setLoading(true);
      await configApi.createRelation({
        reglaId: selectedRule.id,
        fieldId: selectedFieldId,
        operator,
        value,
      });
      showNotification('success', 'Relación agregada exitosamente');
      loadRelations(selectedRule.id);
      setValue('');
      setSelectedFieldId('');
    } catch (error) {
      console.error('Error adding relation:', error);
      showNotification('error', 'Error al agregar la relación');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRelation = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar esta relación?')) return;

    try {
      setLoading(true);
      await configApi.deleteRelation(id);
      showNotification('success', 'Relación eliminada exitosamente');
      if (selectedRule) loadRelations(selectedRule.id);
    } catch (error) {
      console.error('Error deleting relation:', error);
      showNotification('error', 'Error al eliminar la relación');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedRule(null);
    setRelations([]);
    setSelectedFieldId('');
    setValue('');
    setOperator('EQUALS');
  };

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-12rem)] gap-4">
        {/* Notification Bar */}
        {notification && (
          <div className={`p-4 rounded-lg flex items-center gap-3 ${
            notification.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        )}

        <div className="flex h-full gap-6">
          {/* Rules List Sidebar */}
          <Card className="w-1/3 flex flex-col">
            <CardHeader>
              <CardTitle>Reglas Disponibles</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Selecciona una regla para configurar sus condiciones
              </p>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              {loading && rules.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-2">
                  {rules.map((rule) => (
                    <div
                      key={rule.id}
                      onClick={() => setSelectedRule(rule)}
                      className={`p-3 rounded-lg cursor-pointer border hover:bg-muted transition-colors ${
                        selectedRule?.id === rule.id ? 'bg-muted border-primary' : 'bg-card'
                      }`}
                    >
                      <p className="font-medium text-sm truncate" title={rule.condition}>
                        {rule.condition}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground bg-secondary px-1.5 rounded">{rule.domain}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Configuration Panel */}
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedRule && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBackToList}
                      className="hover:bg-muted"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Volver
                    </Button>
                  )}
                  <CardTitle>
                    {selectedRule ? 'Configuración de Regla' : 'Selecciona una regla'}
                  </CardTitle>
                </div>
              </div>
              {selectedRule && (
                <div className="text-sm text-muted-foreground mt-2">
                  Dominio: <span className="font-medium">{selectedRule.domain}</span>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              {selectedRule ? (
                <div className="space-y-6">
                  <div className="p-4 bg-muted/40 rounded-lg border">
                    <h3 className="font-semibold mb-2">Condición Original (Texto)</h3>
                    <p className="text-sm text-muted-foreground">{selectedRule.condition}</p>
                    <h3 className="font-semibold mt-4 mb-2">Acción</h3>
                    <p className="text-sm text-muted-foreground">{selectedRule.action}</p>
                    <h3 className="font-semibold mt-4 mb-2">Base Legal</h3>
                    <p className="text-sm text-muted-foreground">{selectedRule.legal_basis}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">Mapeo de Campos (DTO)</h3>
                      <span className="text-sm text-muted-foreground">
                        {relations.length} {relations.length === 1 ? 'condición' : 'condiciones'}
                      </span>
                    </div>
                    
                    {/* Add Relation Form */}
                    <div className="flex flex-col gap-4 p-4 border rounded-lg bg-card shadow-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Campo del DTO</label>
                          <select
                            className="w-full p-2 rounded-md border text-sm"
                            value={selectedFieldId}
                            onChange={(e) => {
                              setSelectedFieldId(e.target.value);
                              setOperator('EQUALS');
                              setValue('');
                            }}
                            disabled={loading}
                          >
                            <option value="">Seleccionar Campo...</option>
                            {fields.map((f) => (
                              <option key={f.id} value={f.id}>
                                {f.label || f.fieldName}
                              </option>
                            ))}
                          </select>
                        </div>

                        {selectedFieldId && fields.find(f => f.id === selectedFieldId)?.fieldType !== 'BOOLEAN' && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Operador</label>
                            <select
                              className="w-full p-2 rounded-md border text-sm"
                              value={operator}
                              onChange={(e) => setOperator(e.target.value)}
                              disabled={loading}
                            >
                              <option value="EQUALS">Igual a</option>
                              <option value="GREATER_THAN">Mayor que</option>
                              <option value="LESS_THAN">Menor que</option>
                              <option value="TRUE">Verdadero</option>
                            </select>
                          </div>
                        )}
                      </div>

                      {selectedFieldId && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Valor Esperado</label>
                          {(() => {
                            const field = fields.find(f => f.id === selectedFieldId);
                            if (field?.fieldType === 'BOOLEAN') {
                              return (
                                <div className="flex items-center gap-2 mt-2">
                                  <select 
                                    className="p-2 border rounded-md"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    disabled={loading}
                                  >
                                    <option value="">Seleccionar...</option>
                                    <option value="true">Verdadero (Sí)</option>
                                    <option value="false">Falso (No)</option>
                                  </select>
                                  <span className="text-xs text-muted-foreground">El operador será ajustado automáticamente.</span>
                                </div>
                              );
                            }
                            if (field?.fieldType === 'NUMBER') {
                              return (
                                <Input
                                  type="number"
                                  value={value}
                                  onChange={(e) => setValue(e.target.value)}
                                  placeholder="Ej: 1000"
                                  disabled={loading}
                                />
                              );
                            }
                            return (
                              <Input
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder="Ej: texto..."
                                disabled={loading}
                              />
                            );
                          })()}
                        </div>
                      )}

                      <div className="flex justify-end">
                        <Button 
                          onClick={handleAddRelation} 
                          disabled={!selectedFieldId || !value || loading}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Agregando...
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-2" />
                              Agregar Relación
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Relations List */}
                    <div className="space-y-2">
                      {relations.map((rel) => (
                        <div
                          key={rel.id}
                          className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex gap-4 text-sm items-center">
                            <span className="font-semibold text-primary">
                              {rel.dtoField.label || rel.dtoField.fieldName}
                            </span>
                            
                            {rel.dtoField.fieldType === 'BOOLEAN' ? (
                              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                rel.value === 'true' 
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                              }`}>
                                {rel.value === 'true' ? 'ES VERDADERO' : 'ES FALSO'}
                              </span>
                            ) : (
                              <>
                                <span className="text-muted-foreground text-xs">{rel.operator}</span>
                                <span className="font-mono bg-muted px-2 py-0.5 rounded">
                                  {rel.value}
                                </span>
                              </>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteRelation(rel.id)}
                            disabled={loading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      {relations.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                          <p className="text-muted-foreground mb-2">No hay campos vinculados a esta regla aún.</p>
                          <p className="text-sm text-muted-foreground">Usa el formulario arriba para agregar condiciones.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="max-w-md">
                    <h3 className="text-lg font-semibold mb-2">Configura tus Reglas</h3>
                    <p className="text-muted-foreground">
                      Selecciona una regla del panel izquierdo para comenzar a configurar sus parámetros y condiciones.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
