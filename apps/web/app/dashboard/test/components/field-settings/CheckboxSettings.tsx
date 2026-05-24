import { BaseSettings } from "./BaseSettings";
import { CheckboxProps } from "../../types";

interface CheckboxSettingsProps {
    props: CheckboxProps;
    onChange: (newProps: Partial<CheckboxProps>) => void;
}

export function CheckboxSettings({ props, onChange }: CheckboxSettingsProps) {
    return <BaseSettings props={props} onChange={onChange} />;
}
