"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronRight, ChevronLeft, ChevronDown, Filter } from "lucide-react";

import Header from "~/components/layout/Header";
import { Footer } from "~/components/layout/Footer";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

const CATEGORIES = [
  { name: "Application Forms", count: 278 },
  { name: "Booking Forms", count: 62 },
  { name: "Consent Forms", count: 121 },
  { name: "Contact Forms", count: 72 },
  { name: "Donation Forms", count: 37 },
  { name: "Evaluation Forms", count: 211 },
  { name: "Feedback Forms", count: 143 },
  { name: "Registration Forms", count: 198 },
  { name: "Request Forms", count: 89 },
];

const TEMPLATES = [
  { 
    id: 1, 
    title: "Online Job Application Form", 
    category: "Application Forms", 
    style: "standard" 
  },
  { 
    id: 2, 
    title: "Volunteer Application Form", 
    category: "Application Forms", 
    style: "purple",
    bgColor: "bg-[#d6a4f9]" 
  },
  { 
    id: 3, 
    title: "Membership Application Form", 
    category: "Application Forms", 
    style: "brown",
    bgColor: "bg-[#9e6d55]"
  },
  { 
    id: 4, 
    title: "Rental Application Form", 
    category: "Application Forms", 
    style: "standard" 
  },
  { 
    id: 5, 
    title: "Sponsorship Application Form", 
    category: "Application Forms", 
    style: "teal",
    bgColor: "bg-primary"
  },
  { 
    id: 6, 
    title: "Vendor Application Form", 
    category: "Application Forms", 
    style: "purple",
    bgColor: "bg-indigo-400" 
  },
];

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState("Application Forms");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-primary/5 py-12 px-4 md:px-6 border-b border-border">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-foreground-muted mb-6 font-medium">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="cursor-default">Templates</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-semibold">{activeCategory}</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading mb-4 text-heading">
            Free Online {activeCategory} Templates
          </h1>
          <p className="text-foreground-muted max-w-3xl leading-relaxed text-[15px]">
            These {activeCategory.toLowerCase()} templates are easy to start with for collecting applications online. 
            After choosing the proper one for your needs, online {activeCategory.toLowerCase().replace("forms", "form")} templates 
            let you collect information efficiently and streamline your process.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full py-10 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-[260px] flex-shrink-0">
            <div className="bg-card border border-border rounded-xl p-4 sticky top-24 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4 px-2 text-sm">By type</h3>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between px-2 py-2 text-sm font-medium text-foreground cursor-pointer hover:bg-background-secondary rounded-lg">
                  <span>Forms</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
                
                <div className="pt-1 pb-2 space-y-0.5">
                  {CATEGORIES.map((category) => {
                    const isActive = activeCategory === category.name;
                    return (
                      <button
                        key={category.name}
                        onClick={() => setActiveCategory(category.name)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 text-[13px] rounded-lg transition-colors ${
                          isActive 
                            ? "bg-primary/10 text-primary font-medium" 
                            : "text-foreground-muted hover:bg-background-secondary hover:text-foreground"
                        }`}
                      >
                        <span>{category.name}</span>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full ${isActive ? "bg-primary/20 text-primary" : "bg-background-secondary text-foreground-muted"}`}>
                          {category.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Results Area */}
          <div className="flex-1 min-w-0">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground-muted" />
                <Input 
                  placeholder="Search in all template categories" 
                  className="pl-10 h-11 bg-card border-border rounded-xl focus-visible:ring-primary shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="h-11 px-6 rounded-xl bg-card border-border shadow-sm text-foreground">
                <Filter className="mr-2 h-4 w-4 text-foreground-muted" />
                Popular
                <ChevronDown className="ml-2 h-4 w-4 text-foreground-muted" />
              </Button>
            </div>

            <div className="mb-6 text-[15px] text-foreground-muted">
              <span className="text-foreground font-semibold">279 templates</span> are listed in the {activeCategory.toLowerCase()} category
            </div>

            {/* Template Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {TEMPLATES.map((template) => (
                <div key={template.id} className="group cursor-pointer flex flex-col">
                  <div className={`aspect-[4/3] rounded-2xl border border-border mb-4 overflow-hidden relative transition-all duration-300 group-hover:shadow-md group-hover:border-primary/50 bg-background-secondary`}>
                    
                    {/* Mock Template Thumbnails */}
                    {template.style === "standard" ? (
                      <div className="absolute inset-4 bg-background rounded-lg shadow-sm border border-border/50 p-4 overflow-hidden flex flex-col gap-3">
                        <div className="w-1/3 h-2.5 bg-foreground/20 rounded"></div>
                        <div className="w-full h-8 bg-background-secondary/50 rounded border border-border/50"></div>
                        
                        <div className="w-1/4 h-2.5 bg-foreground/20 rounded mt-2"></div>
                        <div className="w-full h-8 bg-background-secondary/50 rounded border border-border/50"></div>
                        
                        <div className="w-1/2 h-2.5 bg-foreground/20 rounded mt-2"></div>
                        <div className="w-full h-8 bg-background-secondary/50 rounded border border-border/50"></div>
                      </div>
                    ) : (
                      <div className={`absolute inset-0 ${template.bgColor} flex flex-col items-center justify-center p-6 text-center`}>
                        <div className="w-12 h-12 rounded-full bg-white/20 mb-4 flex items-center justify-center backdrop-blur-sm">
                           <div className="w-6 h-6 bg-white rounded-sm opacity-80"></div>
                        </div>
                        <div className="w-3/4 h-3 bg-white/60 rounded mb-3"></div>
                        <div className="w-full h-2 bg-white/40 rounded mb-1.5"></div>
                        <div className="w-5/6 h-2 bg-white/40 rounded mb-6"></div>
                        <div className="w-20 h-8 bg-white/20 hover:bg-white/30 rounded-md backdrop-blur-sm transition-colors mt-auto"></div>
                      </div>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="textured" className="shadow-lg">
                        Use Template
                      </Button>
                    </div>
                  </div>
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors text-[15px]">
                    {template.title}
                  </h3>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-1.5 pt-8">
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg border-border" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="textured" className="h-9 w-9 rounded-lg p-0">1</Button>
              <Button variant="ghost" className="h-9 w-9 rounded-lg hover:bg-background-secondary">2</Button>
              <Button variant="ghost" className="h-9 w-9 rounded-lg hover:bg-background-secondary">3</Button>
              <Button variant="ghost" className="h-9 w-9 rounded-lg hover:bg-background-secondary">4</Button>
              <Button variant="ghost" className="h-9 w-9 rounded-lg hover:bg-background-secondary">5</Button>
              <span className="px-2 text-foreground-muted font-medium tracking-widest">...</span>
              <Button variant="ghost" className="h-9 w-9 rounded-lg hover:bg-background-secondary">10</Button>
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg border-border">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}