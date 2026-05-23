import { CanvasNode } from "./data";

export function extractFieldProps(itemData: any) {
    if (!itemData) return null;

    return {
        isRequired: "isRequired" in itemData && itemData.isRequired,
        htmlTag: "htmlTag" in itemData ? itemData.htmlTag : undefined,
        inputType: "inputType" in itemData ? itemData.inputType : undefined,
        placeholder: "placeholder" in itemData ? itemData.placeholder : undefined,
        options: "options" in itemData ? itemData.options : [],
    };
}

export function deleteCanvasItem(items: CanvasNode[], instanceId: string): CanvasNode[] {
    return items.reduce((acc: CanvasNode[], item) => {
        if (item.instanceId === instanceId) {
            return acc; // Skip this item to delete it
        }

        if (item.type === "sidebar-layout" && item.children) {
            const newChildren = { ...item.children };
            let modified = false;
            for (const key in newChildren) {
                if (newChildren[key]?.instanceId === instanceId) {
                    newChildren[key] = null; // Clear the slot
                    modified = true;
                }
            }
            if (modified) {
                acc.push({ ...item, children: newChildren });
                return acc;
            }
        }

        acc.push(item);
        return acc;
    }, []);
}

export function duplicateCanvasItem(items: CanvasNode[], instanceId: string): CanvasNode[] {
    const duplicateNode = (node: CanvasNode): CanvasNode => ({
        ...node,
        instanceId: `${node.fieldId}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        children: node.children ? Object.fromEntries(
            Object.entries(node.children).map(([k, v]) => [k, v ? duplicateNode(v) : null])
        ) : undefined
    });

    const newItems: CanvasNode[] = [];

    for (const item of items) {
        newItems.push(item);

        if (item.instanceId === instanceId) {
            newItems.push(duplicateNode(item));
        } else if (item.type === "sidebar-layout" && item.children) {
            // If the duplicated item is inside a grid, we push it to the main canvas below the grid
            // since grid slots can only hold one item.
            for (const key in item.children) {
                const child = item.children[key];
                if (child?.instanceId === instanceId) {
                    newItems.push(duplicateNode(child));
                }
            }
        }
    }

    return newItems;
}
