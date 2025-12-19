import { api } from './api';

export interface FieldDTO {
  id: string;
  fieldName: string;
  description: string;
  label?: string;
  fieldType?: string;
}

export interface RuleDTO {
  id: string;
  condition: string;
  action: string;
  legal_basis: string;
  domain: string;
}

export interface RuleRelationDTO {
  id: string;
  regla: RuleDTO;
  dtoField: FieldDTO;
  operator: string;
  value: string;
}

export const configApi = {
  getAllFields: async (): Promise<FieldDTO[]> => {
    const response = await api.get('/config-reglas/fields');
    return response.data;
  },

  getAllRules: async (): Promise<RuleDTO[]> => {
    const response = await api.get('/config-reglas/rules');
    return response.data;
  },

  getRelations: async (reglaId: string): Promise<RuleRelationDTO[]> => {
    const response = await api.get(`/config-reglas/relations/${reglaId}`);
    return response.data;
  },

  createRelation: async (data: { reglaId: string; fieldId: string; operator: string; value: string }) => {
    const response = await api.post('/config-reglas/relations', data);
    return response.data;
  },

  deleteRelation: async (id: string) => {
    const response = await api.delete(`/config-reglas/relations/${id}`);
    return response.data;
  },
};
