import type { BuilderFieldType } from "../types";
import { TextField, NumberField, ChoiceField, DateField, FileField } from "./FieldImplementations";

export const FIELD_REGISTRY: Record<BuilderFieldType, React.ComponentType<any>> = {
    short_text: TextField,
    long_text: TextField,
    email: TextField,
    number: NumberField,
    rating: NumberField,
    dropdown: ChoiceField,
    radio: ChoiceField,
    checkboxes: ChoiceField,
    date: DateField,
    time: DateField,
    datetime: DateField,
    file: FileField,
};
