import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { BaseFieldProps } from "../../types";

interface BaseSettingsProps {
    props: BaseFieldProps;
    onChange: (newProps: Partial<BaseFieldProps>) => void;
}

export function BaseSettings({ props, onChange }: BaseSettingsProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="field-label">Label</Label>
                <Input
                    id="field-label"
                    value={props.label}
                    onChange={(e) => onChange({ label: e.target.value })}
                />
            </div>

            {("placeholder" in props) && (
                <div className="space-y-2">
                    <Label htmlFor="field-placeholder">Placeholder</Label>
                    <Input
                        id="field-placeholder"
                        value={props.placeholder || ""}
                        onChange={(e) => onChange({ placeholder: e.target.value })}
                    />
                </div>
            )}

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="field-required"
                    checked={props.isRequired}
                    onCheckedChange={(checked) => onChange({ isRequired: !!checked })}
                />
                <Label htmlFor="field-required">Required</Label>
            </div>
        </div>
    );
}
