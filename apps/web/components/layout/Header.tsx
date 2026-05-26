"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';

import { Button } from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";


const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        // Initial check in case of reload in middle of page
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
                ? 'h-16 border-b bg-background/95 backdrop-blur-sm'
                : 'h-16 py-10 bg-transparent'
            }`}>
            <div className="container mx-auto h-full flex items-center justify-between px-4 md:px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="font-script text-3xl md:text-4xl text-foreground leading-none -mt-1 tracking-tight">
                        mmf.
                    </span>
                </Link>

                {/* Right Actions */}
                <div className="flex items-center gap-1 sm:gap-2">
                    {/* Desktop Navigation */}
                    <Link
                        href="/templates"
                        className="hidden sm:flex items-center h-9 px-4 text-md font-medium text-foreground-muted hover:text-foreground hover:bg-secondary/50 rounded-full transition-colors"
                    >
                        Templates
                    </Link>

                    <Link
                        href="/pricing"
                        className="hidden sm:flex items-center h-9 px-4 text-md font-medium text-foreground-muted hover:text-foreground hover:bg-secondary/50 rounded-full transition-colors"
                    >
                        Pricing
                    </Link>

                    <Link
                        href="/login"
                        className="hidden sm:flex items-center h-9 px-4 text-md font-medium text-foreground-muted hover:text-foreground hover:bg-secondary/50 rounded-full transition-colors"
                    >
                        Log in
                    </Link>

                    <div className="hidden sm:flex justify-center">
                        <Link href="/registration">
                            <Button variant="textured" className="h-9 text-md font-[400]">
                                Register
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Hamburger Dropdown Menu */}
                    <div className="flex sm:hidden items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 text-foreground hover:bg-background-secondary rounded-lg">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 mt-2">
                                <DropdownMenuItem asChild className="cursor-pointer text-base py-2.5">
                                    <Link href="/templates" className="w-full">Templates</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="cursor-pointer text-base py-2.5">
                                    <Link href="/pricing" className="w-full">Pricing</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="my-1" />
                                <DropdownMenuItem asChild className="cursor-pointer text-base py-2.5">
                                    <Link href="/login" className="w-full">Log in</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="cursor-pointer text-base py-2.5 text-primary focus:text-primary">
                                    <Link href="/registration" className="w-full">Register</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;