import { TabType } from "~/components/dashboard/app-sidebar"
import { Trash2 } from "lucide-react"

export function Trash({ onNavigate }: { onNavigate: (tab: TabType) => void }) {
    return (
        <div className="flex flex-1 flex-col rounded-tl-xl overflow-hidden shadow-inner border-l border-t border-border/50">
            <div className="flex items-center justify-between px-8 py-6 border-b border-border">
                <h1 className="text-2xl font-heading text-heading">Trash</h1>
            </div>
            <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
                <div className="flex flex-col items-center justify-center text-center max-w-md">
                    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                        <Trash2 className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground mb-2">Trash is empty</h2>
                    <p className="text-sm text-muted-foreground">Items in trash will be permanently deleted after 30 days.</p>
                </div>
            </div>
        </div>
    )
}
