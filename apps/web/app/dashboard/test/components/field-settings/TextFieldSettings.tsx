import { BaseSettings } from "./BaseSettings";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Label } from "~/components/ui/label";
import { TextFieldProps } from "../../types";

interface TextFieldSettingsProps {
    props: TextFieldProps;
    onChange: (newProps: Partial<TextFieldProps>) => void;
}

export function TextFieldSettings({ props, onChange }: TextFieldSettingsProps) {
    return (
        <div className="space-y-4">
            <BaseSettings props={props} onChange={onChange} />

            <div className="space-y-2">
                <Label htmlFor="field-input-type">Input Type</Label>
                <Select
                    value={props.inputType || "text"}
                    onValueChange={(value) => onChange({ inputType: value as any })}
                >
                    <SelectTrigger id="field-input-type">
                        <SelectValue placeholder="Select input type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="tel">Phone</SelectItem>
                        <SelectItem value="password">Password</SelectItem>
                        <SelectItem value="url">URL</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
