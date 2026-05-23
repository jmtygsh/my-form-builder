export function RightSidebar() {
    return (
        <div className="bg-muted/10 p-4 flex flex-col gap-3 h-full overflow-y-auto [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full">
            <h2 className="font-semibold text-sm text-muted-foreground mb-1 uppercase tracking-wider shrink-0">
                Configuration
            </h2>
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground text-sm p-4">
                Select an element on the canvas to configure its settings.
            </div>
        </div>
    );
}
