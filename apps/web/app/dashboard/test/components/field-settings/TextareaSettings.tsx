import { BaseSettings } from "./BaseSettings";
import { TextareaProps } from "../../types";

interface TextareaSettingsProps {
    props: TextareaProps;
    onChange: (newProps: Partial<TextareaProps>) => void;
}

export function TextareaSettings({ props, onChange }: TextareaSettingsProps) {
    return <BaseSettings props={props} onChange={onChange} />;
}
