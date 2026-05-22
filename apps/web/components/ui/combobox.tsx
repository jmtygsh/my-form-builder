"use client";

import * as React from "react";

import { cn } from "~/lib/utils";

function Combobox({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="combobox" className={cn(className)} {...props} />;
}

function ComboboxValue({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="combobox-value" className={cn(className)} {...props} />;
}

function ComboboxTrigger({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="combobox-trigger"
      className={cn(className)}
      {...props}
    />
  );
}

function ComboboxInput({ className, ...props }: React.ComponentProps<"input">) {
  return <input data-slot="combobox-input" className={cn(className)} {...props} />;
}

function ComboboxContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="combobox-content" className={cn(className)} {...props} />;
}

function ComboboxList({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="combobox-list" className={cn(className)} {...props} />;
}

function ComboboxItem({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="combobox-item" className={cn(className)} {...props} />;
}

function ComboboxGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="combobox-group" className={cn(className)} {...props} />;
}

function ComboboxLabel({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="combobox-label" className={cn(className)} {...props} />;
}

function ComboboxCollection({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="combobox-collection" className={cn(className)} {...props} />;
}

function ComboboxEmpty({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="combobox-empty" className={cn(className)} {...props} />;
}

function ComboboxSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="combobox-separator" className={cn(className)} {...props} />;
}

function ComboboxChips({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="combobox-chips" className={cn(className)} {...props} />;
}

function ComboboxChip({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="combobox-chip" className={cn(className)} {...props} />;
}

function ComboboxChipsInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input data-slot="combobox-chip-input" className={cn(className)} {...props} />
  );
}

function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null);
}

export {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxSeparator,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
};
