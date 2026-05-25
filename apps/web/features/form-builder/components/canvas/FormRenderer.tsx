import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { RowWrapper } from "./RowWrapper";
import { RowDropZone } from "./RowDropZone";
import { Button } from "~/components/ui/button";
import { FilePenLine, Pencil, Plus } from "lucide-react";
import { useBuilderStore } from "../../store/useBuilderStore";
import { FieldRegistry } from "../../registry/field-registry";
import { StyledField } from "./StyledField";
import { cn } from "~/lib/utils";

export const FormRenderer = ({ isLive = false }: { isLive?: boolean }) => {
  const { form, addRow } = useBuilderStore();

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

  const { setNodeRef } = useDroppable({
    id: "canvas-droppable",
    data: {
      type: "Canvas",
    },
    disabled: isLive,
  });

  if (isLive) {
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
          {form.rows.map((row) => (
            <div key={row.id} className={cn(
              "flex gap-4 w-full",
              alignClasses[(row.props?.alignItems || "start") as keyof typeof alignClasses],
              justifyClasses[(row.props?.justifyContent || "start") as keyof typeof justifyClasses]
            )}>
              {row.fields.map((field) => {
                const registryItem = FieldRegistry[field.type];
                if (!registryItem) return null;
                const CanvasComponent = registryItem.canvasComponent;
                return (
                  <div key={field.id} className="flex-1 p-2">
                    <StyledField field={field}>
                      <CanvasComponent field={field} isLive={isLive} />
                    </StyledField>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      className={cn("w-full min-h-full transition-all duration-200", paddingClass)}
      style={canvasStyle}
    >
      <div className={cn("mx-auto w-full", maxWidthClass)}>

        {form.props?.showCoverImage && form.props?.coverImageUrl && (
          <div className="w-full rounded-t-md overflow-hidden mb-4 border-t border-x">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={form.props.coverImageUrl}
              alt="Form Cover"
              className="w-full h-48 sm:h-64 md:h-72 object-cover"
            />
          </div>
        )}

        {form.rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border/60 bg-muted/5 px-6 py-12 text-center">
            <div className="flex size-10 items-center justify-center rounded-full border bg-background">
              <FilePenLine className="text-muted-foreground size-4" />
            </div>
            <div>
              <div className="text-base font-semibold text-foreground">Start building your form</div>
              <div className="mt-1 text-sm text-muted-foreground mb-4">Add your first row to start dragging and dropping fields.</div>
            </div>
          </div>
        ) : (
          <>
            <SortableContext
              items={form.rows.map(r => r.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-2 relative">
                <RowDropZone index={0} />
                {form.rows.map((row, index) => (
                  <React.Fragment key={row.id}>
                    <RowWrapper row={row} />
                    <RowDropZone index={index + 1} />
                  </React.Fragment>
                ))}
              </div>
            </SortableContext>

            <div className="pt-6 flex justify-center">
              <Button variant="outline" size="sm" onClick={() => addRow()}>
                <Plus size="3" />
                Add Row
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
