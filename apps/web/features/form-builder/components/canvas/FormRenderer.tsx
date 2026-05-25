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

export const FormRenderer = ({ isLive = false }: { isLive?: boolean }) => {
  const { form, addRow } = useBuilderStore();

  if (isLive) {
    return (
      <div className="mx-auto max-w-4xl p-8 pb-24 space-y-6">
        <div className="space-y-4 border p-4 rounded-md">
          {form.rows.map((row) => (
            <div key={row.id} className="flex gap-4 w-full ">
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

  const { setNodeRef } = useDroppable({
    id: "canvas-droppable",
    data: {
      type: "Canvas",
    },
  });

  return (
    <div ref={setNodeRef} className="w-full px-4 py-10 md:px-10 min-h-full">
      <div className="max-w-[880px] mx-auto w-full">

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
