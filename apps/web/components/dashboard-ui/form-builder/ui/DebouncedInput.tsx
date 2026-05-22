import * as React from "react";
import { Input } from "~/components/ui/input";

interface DebouncedInputProps extends Omit<React.ComponentProps<typeof Input>, "onChange" | "value"> {
    value: string;
    onChange: (value: string) => void;
    debounceMs?: number;
}

export function DebouncedInput({ value: initialValue, onChange, debounceMs = 300, ...props }: DebouncedInputProps) {
    const [value, setValue] = React.useState(initialValue);
    
    // Sync external value when it changes (e.g. switching selected element)
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
        <Input
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
