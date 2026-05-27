import * as React from "react";
import { Pencil, Eye, Save, CheckCircle2 } from "lucide-react";

export type TabOption<T extends string> = {
    id: T;
    label: string;
    icon: React.ReactNode;
};

export const VIEW_MODE_BUTTON: TabOption<"edit" | "preview">[] = [
    {
        id: "edit",
        label: "Edit",
        icon: <Pencil className="size-3.5" />
    },
    {
        id: "preview",
        label: "Preview",
        icon: <Eye className="size-3.5" />
    }
];

export const SUBMIT_BUTTON: TabOption<"save" | "publish">[] = [
    {
        id: "save",
        label: "Save Draft",
        icon: <Save className="size-4" />
    },
    {
        id: "publish",
        label: "Publish",
        icon: <CheckCircle2 className="size-4" />
    }
];
