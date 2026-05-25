import { BaseSettings } from "./BaseSettings";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { RadioGroupProps } from "../../types";
import { Trash2, Plus } from "lucide-react";

interface RadioGroupSettingsProps {
    props: RadioGroupProps;
    onChange: (newProps: Partial<RadioGroupProps>) => void;
}

export function RadioGroupSettings({ props, onChange }: RadioGroupSettingsProps) {
    const updateOption = (index: number, field: "label" | "value", value: string) => {
        const newOptions = [...props.options];
        const existingOption = newOptions[index];
        if (!existingOption) return;

        newOptions[index] = {
            label: field === "label" ? value : existingOption.label,
            value: field === "value" ? value : existingOption.value,
        };
        onChange({ options: newOptions });
    };

    const addOption = () => {
        onChange({
            options: [...props.options, { label: "New Option", value: `option-${Date.now()}` }],
        });
    };

    const removeOption = (index: number) => {
        onChange({
            options: props.options.filter((_, i) => i !== index),
        });
    };

    return (
        <div className="space-y-4">
            <BaseSettings props={props} onChange={onChange} />

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label>Options</Label>
                    <Button type="button" variant="ghost" size="sm" onClick={addOption}>
                        <Plus className="size-4 mr-1" />
                        Add
                    </Button>
                </div>

                <div className="space-y-2">
                    {props.options.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <Input
                                placeholder="Label"
                                value={option.label}
                                onChange={(e) => updateOption(index, "label", e.target.value)}
                            />
                            {/* <Input
                                placeholder="Value"
                                value={option.value}
                                onChange={(e) => updateOption(index, "value", e.target.value)}
                            /> */}
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeOption(index)}
                            >
                                <Trash2 className="size-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
