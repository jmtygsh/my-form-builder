import { create } from "zustand";
import { FormSchema, Row, Field, FieldType } from "../types";

interface BuilderState {
  form: FormSchema;
  selectedFieldId: string | null;
  selectedRowId: string | null;
  selectedCanvas: boolean;

  // Actions
  setForm: (form: FormSchema) => void;
  setFormTitle: (title: string) => void;
  updateFormProps: (updates: Partial<FormSchema["props"]>) => void;
  selectField: (id: string | null) => void;
  selectRow: (id: string | null) => void;
  selectCanvas: () => void;

  // Row Actions
  addRow: (index?: number) => void;
  deleteRow: (rowId: string) => void;
  moveRow: (fromIndex: number, toIndex: number) => void;
  updateRow: (rowId: string, updates: Partial<Row["props"]>) => void;

  // Field Actions
  addFieldToRow: (rowId: string, fieldType: FieldType, defaultProps: any, index?: number) => void;
  addFieldToNewRow: (index: number, fieldType: FieldType, defaultProps: any) => void;
  updateField: (fieldId: string, updates: Partial<Field["props"]>) => void;
  deleteField: (fieldId: string) => void;
  moveFieldWithinRow: (rowId: string, fromIndex: number, toIndex: number) => void;
  moveFieldAcrossRows: (fromRowId: string, toRowId: string, fieldId: string, toIndex: number) => void;
  moveFieldToNewRow: (fieldId: string, toRowIndex: number) => void;

  // Persist Actions
  clearPersistedState: (id: string) => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  form: {
    name: "Untitled Form",
    rows: [],
  },

  selectedFieldId: null,
  selectedRowId: null,
  selectedCanvas: false,

  setForm: (form) => set({ form }),

  setFormTitle: (name) => set((state) => ({ form: { ...state.form, name } })),

  updateFormProps: (updates) => set((state) => ({
    form: {
      ...state.form,
      props: { ...state.form.props, ...updates }
    }
  })),

  selectField: (id) => set({ selectedFieldId: id, selectedRowId: null, selectedCanvas: false }),

  selectRow: (id) => set({ selectedRowId: id, selectedFieldId: null, selectedCanvas: false }),

  selectCanvas: () => set({ selectedCanvas: true, selectedFieldId: null, selectedRowId: null }),

  addRow: (index) => set((state) => {
    const newRow: Row = { id: `row_${Date.now()}`, fields: [], props: { alignItems: "start", justifyContent: "start" } };
    const newRows = [...state.form.rows];
    if (typeof index === "number") {
      newRows.splice(index, 0, newRow);
    } else {
      newRows.push(newRow);
    }
    return { form: { ...state.form, rows: newRows } };
  }),

  deleteRow: (rowId) => set((state) => ({
    form: {
      ...state.form,
      rows: state.form.rows.filter((r) => r.id !== rowId),
    },
    selectedFieldId: state.selectedFieldId && state.form.rows.find(r => r.id === rowId)?.fields.some(f => f.id === state.selectedFieldId)
      ? null
      : state.selectedFieldId,
    selectedRowId: state.selectedRowId === rowId ? null : state.selectedRowId
  })),

  moveRow: (fromIndex, toIndex) => set((state) => {
    const newRows = [...state.form.rows];
    const [moved] = newRows.splice(fromIndex, 1);
    if (moved) {
      newRows.splice(toIndex, 0, moved);
    }
    return { form: { ...state.form, rows: newRows } };
  }),

  updateRow: (rowId, updates) => set((state) => ({
    form: {
      ...state.form,
      rows: state.form.rows.map((row) =>
        row.id === rowId ? { ...row, props: { ...row.props, ...updates } } : row
      ),
    }
  })),

  addFieldToRow: (rowId, fieldType, defaultProps, index) => set((state) => {
    const newField: Field = {
      id: `fld_${Date.now()}`,
      type: fieldType,
      props: defaultProps,
    };

    return {
      form: {
        ...state.form,
        rows: state.form.rows.map((row) => {
          if (row.id === rowId) {
            const newFields = [...row.fields];
            if (typeof index === "number") {
              newFields.splice(index, 0, newField);
            } else {
              newFields.push(newField);
            }
            return { ...row, fields: newFields };
          }
          return row;
        }),
      }
    };
  }),

  addFieldToNewRow: (index, fieldType, defaultProps) => set((state) => {
    const newField: Field = {
      id: `fld_${Date.now()}`,
      type: fieldType,
      props: defaultProps,
    };
    const newRow: Row = { id: `row_${Date.now()}`, fields: [newField] };
    const newRows = [...state.form.rows];
    newRows.splice(index, 0, newRow);
    return { form: { ...state.form, rows: newRows } };
  }),

  updateField: (fieldId, updates) => set((state) => ({
    form: {
      ...state.form,
      rows: state.form.rows.map((row) => ({
        ...row,
        fields: row.fields.map((f) =>
          f.id === fieldId ? { ...f, props: { ...f.props, ...updates } } : f
        ),
      })),
    }
  })),

  deleteField: (fieldId) => set((state) => ({
    form: {
      ...state.form,
      rows: state.form.rows.map((row) => ({
        ...row,
        fields: row.fields.filter((f) => f.id !== fieldId),
      })).filter(row => row.fields.length > 0),
    },
    selectedFieldId: state.selectedFieldId === fieldId ? null : state.selectedFieldId
  })),

  moveFieldWithinRow: (rowId, fromIndex, toIndex) => set((state) => ({
    form: {
      ...state.form,
      rows: state.form.rows.map((row) => {
        if (row.id === rowId) {
          const newFields = [...row.fields];
          const [moved] = newFields.splice(fromIndex, 1);
          if (moved) {
            newFields.splice(toIndex, 0, moved);
          }
          return { ...row, fields: newFields };
        }
        return row;
      }),
    }
  })),

  moveFieldAcrossRows: (fromRowId, toRowId, fieldId, toIndex) => set((state) => {
    let movedField: Field | undefined;

    // First pass to find and remove
    const intermediateRows = state.form.rows.map(row => {
      if (row.id === fromRowId) {
        movedField = row.fields.find(f => f.id === fieldId);
        return { ...row, fields: row.fields.filter(f => f.id !== fieldId) };
      }
      return row;
    });

    if (!movedField) return state;

    // Second pass to insert
    return {
      form: {
        ...state.form,
        rows: intermediateRows.map(row => {
          if (row.id === toRowId) {
            const newFields = [...row.fields];
            newFields.splice(toIndex, 0, movedField!);
            return { ...row, fields: newFields };
          }
          return row;
        }).filter(row => row.fields.length > 0) // auto-cleanup empty rows
      }
    };
  }),

  moveFieldToNewRow: (fieldId, toRowIndex) => set((state) => {
    let movedField: Field | undefined;

    // First pass to find and remove
    const intermediateRows = state.form.rows.map(row => {
      const field = row.fields.find(f => f.id === fieldId);
      if (field) {
        movedField = field;
        return { ...row, fields: row.fields.filter(f => f.id !== fieldId) };
      }
      return row;
    });

    if (!movedField) return state;

    // Insert new row
    const newRow: Row = { id: `row_${Date.now()}`, fields: [movedField] };
    intermediateRows.splice(toRowIndex, 0, newRow);

    return {
      form: {
        ...state.form,
        rows: intermediateRows.filter(row => row.fields.length > 0) // auto-cleanup empty rows
      }
    };
  }),



  clearPersistedState: (id) => set((state) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(`form-builder-storage-${id}`);
    }
    return state;
  }),
}));


// make form save unique id auto save