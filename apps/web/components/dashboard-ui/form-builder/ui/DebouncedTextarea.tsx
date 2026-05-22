import * as React from "react";
import { Textarea } from "~/components/ui/textarea";

interface DebouncedTextareaProps extends Omit<React.ComponentProps<typeof Textarea>, "onChange" | "value"> {
    value: string;
    onChange: (value: string) => void;
    debounceMs?: number;
}

export function DebouncedTextarea({ value: initialValue, onChange, debounceMs = 300, ...props }: DebouncedTextareaProps) {
    const [value, setValue] = React.useState(initialValue);
    
    React.useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            if (value !== initialValue) {
                onChange(value);
            }
        }, debounceMs);
        return () => clearTimeout(timeout);
    }, [value, initialValue, onChange, debounceMs]);

    return (
        <Textarea
            {...props}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => {
                if (value !== initialValue) {
                    onChange(value);
                }
            }}
        />
    );
}
