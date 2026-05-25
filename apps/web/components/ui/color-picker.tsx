import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { HexAlphaColorPicker } from "react-colorful";
import { Input } from "./input";

export const ColorPickerInput = ({ value, onChange, placeholder }: { value?: string, onChange: (val: string) => void, placeholder?: string }) => {
  return (
    <div className="flex gap-2 items-center">
      <Popover>
        <PopoverTrigger asChild>
          <div className="relative w-8 h-8 rounded-md border border-input cursor-pointer shrink-0 overflow-hidden bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjY2NjIiAvPgo8cmVjdCB4PSI0IiB5PSI0IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjY2NjIiAvPgo8L3N2Zz4=')]">
            <div
              className="absolute inset-0 w-full h-full"
              style={{ backgroundColor: value || "#ffffff" }}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="start">
          <HexAlphaColorPicker color={value || "#ffffff"} onChange={onChange} />
        </PopoverContent>
      </Popover>
      <Input
        type="text"
        className="h-8 text-sm flex-1"
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
