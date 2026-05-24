import { CanvasNode, FieldDefinition, FieldDefinition as FieldDef } from "../types";
import { getDefaultFieldProps } from "../registries";
import { FIELD_DATA, LAYOUT_DATA } from "../constants";

export function getFieldData(fieldId: string): FieldDefinition | import("../types").LayoutDefinition | null {
    const layout = LAYOUT_DATA.find((l) => l.id === fieldId);
    if (layout) return layout;
    const field = FIELD_DATA.find((f) => f.id === fieldId);
    if (field) return field;
    return null;
}

export function extractFieldProps(itemData: any) {
    if (!itemData) return null;

    if ("defaultProps" in itemData) {
        return itemData.defaultProps;
    }

    return {
        isRequired: "isRequired" in itemData && itemData.isRequired,
        placeholder: "placeholder" in itemData ? itemData.placeholder : undefined,
        inputType: "inputType" in itemData ? itemData.inputType : undefined,
        options: "options" in itemData ? itemData.options : [],
        label: "label" in itemData ? itemData.label : "",
    };
}

export function createCanvasNode(fieldDef: FieldDef): CanvasNode {
    return {
        instanceId: `${fieldDef.id}-${Date.now()}`,
        fieldId: fieldDef.id,
        type: "sidebar-item",
        props: getDefaultFieldProps(fieldDef),
    };
}

export function deleteCanvasItem(items: CanvasNode[], instanceId: string): CanvasNode[] {
    return items.reduce((acc: CanvasNode[], item) => {
        if (item.instanceId === instanceId) {
            return acc;
        }

        if (item.type === "sidebar-layout" && item.children) {
            const newChildren = { ...item.children };
            let modified = false;
            for (const key in newChildren) {
                if (newChildren[key]?.instanceId === instanceId) {
                    newChildren[key] = null;
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

export function updateCanvasItemProps(
    items: CanvasNode[],
    instanceId: string,
    newProps: any
): CanvasNode[] {
    return items.map((item) => {
        if (item.instanceId === instanceId) {
            return {
                ...item,
                props: { ...item.props, ...newProps },
            };
        }

        if (item.type === "sidebar-layout" && item.children) {
            const newChildren = { ...item.children };
            for (const key in newChildren) {
                if (newChildren[key]) {
                    const updated = updateCanvasItemProps(
                        [newChildren[key]!],
                        instanceId,
                        newProps
                    )[0];
                    newChildren[key] = updated || null;
                }
            }
            return { ...item, children: newChildren };
        }

        return item;
    });
}

export function findCanvasNode(items: CanvasNode[], instanceId: string): CanvasNode | null {
    for (const item of items) {
        if (item.instanceId === instanceId) {
            return item;
        }

        if (item.type === "sidebar-layout" && item.children) {
            for (const key in item.children) {
                const child = item.children[key];
                if (child) {
                    const found = findCanvasNode([child], instanceId);
                    if (found) return found;
                }
            }
        }
    }

    return null;
}
