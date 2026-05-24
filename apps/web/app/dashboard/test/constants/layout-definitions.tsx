import { Columns2, Columns3 } from "lucide-react";
import { Pencil, Eye, TextAlignStart } from "lucide-react";
import type { LayoutDefinition } from "../types";

export const LAYOUT_DATA: LayoutDefinition[] = [
    {
        id: "grid-2",
        label: "2 Columns",
        type: "layout-grid",
        columns: 2,
        category: "layout",
        description: "Two equal columns side by side",
        icon: <Columns2 className="size-4" />,
    },
    {
        id: "grid-3",
        label: "3 Columns",
        type: "layout-grid",
        columns: 3,
        category: "layout",
        description: "Three equal columns side by side",
        icon: <Columns3 className="size-4" />,
    }
];

import type { TabOption } from "../components/field-palette/HeaderTabs";

export const LAYOUT_BUTTON_TABS: TabOption<"elements" | "layouts">[] = [
    { id: "elements", label: "Form Elements", icon: <TextAlignStart className="size-3.5" /> },
    { id: "layouts", label: "Layout", icon: <Columns2 className="size-3.5" /> },
];

export const VIEW_MODE_BUTTON_TABS: TabOption<"edit" | "preview">[] = [
    { id: "edit", label: "Edit", icon: <Pencil className="size-3.5" /> },
    { id: "preview", label: "Preview", icon: <Eye className="size-3.5" /> }
];
