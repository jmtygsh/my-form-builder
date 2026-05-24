import { Copy, Trash2, Upload } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { getFieldData, extractFieldProps } from "../../../utils";

export function FieldRenderer({
    fieldId,
    instanceId,
    inGrid = false,
    onDelete,
    onDuplicate,
    props: nodeProps
}: {
    fieldId: string;
    instanceId?: string;
    inGrid?: boolean;
    onDelete?: (id: string) => void;
    onDuplicate?: (id: string) => void;
    props?: any;
}) {
    const itemData = getFieldData(fieldId);

    if (!itemData) return <div className="p-4 text-red-500">Field not found</div>;

    const defaultProps = extractFieldProps(itemData);
    const props = { ...defaultProps, ...nodeProps };

    const { isRequired, label, placeholder, inputType, options } = props;

    return (
        <div className="flex-1 min-w-0 flex flex-col justify-center w-full relative group/item">
            {/* Header: Icon, Label, Asterisk, and Action Buttons */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">

                    <Label className="font-semibold text-foreground text-sm flex items-center">
                        {label || ("label" in itemData ? itemData.label : "")}
                        {isRequired && <span className="text-destructive ml-1">*</span>}
                    </Label>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!inGrid && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer z-10"
                            onClick={() => instanceId && onDuplicate?.(instanceId)}
                        >
                            <Copy className="size-3.5" />
                        </Button>
                    )}
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer z-10"
                        onClick={() => instanceId && onDelete?.(instanceId)}
                    >
                        <Trash2 className="size-3.5" />
                    </Button>
                </div>
            </div>

            <div className="pointer-events-none w-full mt-1">
                {fieldId === "textarea" ? (
                    <Textarea placeholder={placeholder || "Enter text..."} className="resize-none h-20" readOnly tabIndex={-1} />
                ) : fieldId === "checkbox" ? (
                    <div className="flex items-center space-x-2">
                        <Checkbox id={`checkbox-${itemData.id}`} tabIndex={-1} />
                        <label
                            htmlFor={`checkbox-${itemData.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            {label || ("label" in itemData ? itemData.label : "")}
                        </label>
                    </div>
                ) : fieldId === "radio" ? (
                    <RadioGroup defaultValue={options?.[0]?.value} className="flex flex-col space-y-2 mt-2">
                        {options?.map((option: any, idx: number) => (
                            <div className="flex items-center space-x-2" key={idx}>
                                <RadioGroupItem value={option.value} id={`radio-${itemData.id}-${idx}`} tabIndex={-1} />
                                <Label htmlFor={`radio-${itemData.id}-${idx}`} className="font-normal cursor-pointer">{option.label}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                ) : fieldId === "file" ? (
                    <div className="flex items-center justify-center w-full h-24 border-2 border-dashed rounded-md bg-muted/20">
                        <div className="flex flex-col items-center gap-1 text-muted-foreground">
                            <Upload className="size-4" />
                            <span className="text-sm">Click to upload</span>
                        </div>
                    </div>
                ) : (
                    <Input
                        type={inputType || "text"}
                        placeholder={placeholder || "Enter value..."}
                        readOnly
                        tabIndex={-1}
                    />
                )}
            </div>
        </div>
    );
}
