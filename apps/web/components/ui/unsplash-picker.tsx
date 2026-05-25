import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Search, Image as ImageIcon, Loader2 } from "lucide-react";
import { cn } from "~/lib/utils";

// Temporary mock data until we wire up tRPC backend
const MOCK_IMAGES = [
  { id: "1", url: "https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=2400&auto=format&fit=crop", author: "Unsplash" },
  { id: "2", url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2400&auto=format&fit=crop", author: "Unsplash" },
  { id: "3", url: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2400&auto=format&fit=crop", author: "Unsplash" },
  { id: "4", url: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2400&auto=format&fit=crop", author: "Unsplash" },
  { id: "5", url: "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?q=80&w=2400&auto=format&fit=crop", author: "Unsplash" },
  { id: "6", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2400&auto=format&fit=crop", author: "Unsplash" },
];

interface UnsplashPickerProps {
  onSelect: (url: string) => void;
  children?: React.ReactNode;
}

export function UnsplashPicker({ onSelect, children }: UnsplashPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState(MOCK_IMAGES);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    // TODO: Call tRPC endpoint here
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const handleSelect = (url: string) => {
    onSelect(url);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="w-full">
            <ImageIcon className="w-4 h-4 mr-2" />
            Choose Image
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Choose a Cover Image</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Unsplash..."
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading}>
            Search
          </Button>
        </form>

        <div className="flex-1 overflow-y-auto mt-4 min-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="group relative aspect-[3/1] rounded-md overflow-hidden cursor-pointer bg-muted border border-transparent hover:border-primary transition-colors"
                  onClick={() => handleSelect(img.url)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt="Unsplash"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm font-medium">Select</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground text-center mt-2">
          Images provided by <a href="https://unsplash.com" target="_blank" rel="noreferrer" className="underline hover:text-primary">Unsplash</a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
