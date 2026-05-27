import React from "react";
import { cn } from "~/lib/utils";
import { FieldRegistry } from "../../registry/field-registry";
import { StyledField } from "./StyledField";
import { FormSchema } from "../../types";

interface PublicFormRendererProps {
  form: FormSchema;
}

export const PublicFormRenderer = ({ form }: PublicFormRendererProps) => {
  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
  };

  const maxWidthClass = {
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "full": "max-w-full",
  }[form.props?.maxWidth || "4xl"];

  const paddingClass = {
    "0": "p-0",
    "4": "p-4",
    "8": "p-8",
    "12": "p-12",
    "16": "p-16",
  }[form.props?.padding || "8"];

  const canvasStyle = {
    backgroundColor: form.props?.backgroundColor || undefined,
  };

  return (
    <div
      className={cn("mx-auto pb-24 transition-all duration-200", maxWidthClass, paddingClass)}
      style={canvasStyle}
    >
      <div className="space-y-4 border p-4 rounded-md bg-card overflow-hidden">
        {form.props?.showCoverImage && form.props?.coverImageUrl && (
          <div className="-mx-4 -mt-4 mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={form.props.coverImageUrl}
              alt="Form Cover"
              className="w-full h-48 sm:h-64 md:h-72 object-cover"
            />
          </div>
        )}
        {form.rows.map((row: any) => (
          <div key={row.id} className={cn(
            "flex gap-4 w-full",
            alignClasses[(row.props?.alignItems || "start") as keyof typeof alignClasses],
            justifyClasses[(row.props?.justifyContent || "start") as keyof typeof justifyClasses]
          )}>
            {row.fields.map((field: any) => {
              const registryItem = FieldRegistry[field.type];
              if (!registryItem) return null;
              const CanvasComponent = registryItem.canvasComponent;
              return (
                <div key={field.id} className="flex-1 p-2">
                  <StyledField field={field}>
                    <CanvasComponent field={field} isLive={true} />
                  </StyledField>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};