import { TabType } from "~/components/dashboard/app-sidebar"
import { Send } from "lucide-react"

export function MySubmissions({ onNavigate }: { onNavigate: (tab: TabType) => void }) {
    return (
        <div className="flex flex-1 flex-col rounded-tl-xl overflow-hidden shadow-inner border-l border-t border-border/50">
            <div className="flex items-center justify-between px-8 py-6 border-b border-border">
                <h1 className="text-2xl font-heading text-heading">My Submissions</h1>
            </div>
            <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
                <div className="flex flex-col items-center justify-center text-center max-w-md">
                    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                        <Send className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground mb-2">No submissions yet</h2>
                    <p className="text-sm text-muted-foreground">When you submit forms, they will appear here.</p>
                </div>
            </div>
        </div>
    )
}
