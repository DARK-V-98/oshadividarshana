
"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Sparkles, LogOut, LayoutDashboard, Shield, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/firebase/auth/use-user";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";


const navLinks = [
  { href: "/", label: "Home" },
  { href: "/order", label: "Order" },
  { href: "/#about", label: "About" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#testimonials", label: "Reviews" },
  { href: "/#contact", label: "Contact" },
];

const courseCategories = [
    {
      title: "Bridal Dresser",
      href: "/courses/bridal",
      description: "Master the art of bridal makeup, hair styling, and saree draping.",
    },
    {
      title: "Beauty",
      href: "/courses/beauty",
      description: "Comprehensive modules on skin care, facials, and beauty treatments.",
    },
    {
      title: "Hair Dresser",
      href: "/courses/hair",
      description: "Learn professional hair cutting, coloring, and styling techniques.",
    },
    {
      title: "Extra Notes",
      href: "/courses/extra-notes",
      description: "Specialized notes covering salon management, safety, and more.",
    },
  ];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, userProfile, loading } = useUser();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { cart } = useCart();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Set initial state
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/');
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
  
  const navLinkClasses = cn(
    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
    scrolled ? "text-muted-foreground hover:text-primary focus:text-primary" : "text-white/80 hover:text-white focus:text-white",
    "focus:bg-accent/10 focus:outline-none"
  );
  
  const navTriggerClasses = cn(navigationMenuTriggerStyle(),
    "bg-transparent",
    scrolled ? "text-muted-foreground hover:text-primary focus:text-primary" : "text-white/80 hover:text-white focus:text-white",
    "focus:bg-accent/10 focus:outline-none data-[state=open]:bg-accent/10"
  );


  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <Image src="/ov.png" alt="Oshadi Vidarshana Logo" width={40} height={40} className="rounded-full" />
            <span className={cn("font-playfair text-xl font-semibold", scrolled ? "text-foreground" : "text-white")}>
              Oshadi
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
                {navLinks.slice(0, 1).map((link) => (
                    <NavigationMenuItem key={link.href}>
                         <Link href={link.href} legacyBehavior passHref>
                           <NavigationMenuLink className={navLinkClasses}>
                             {link.label}
                           </NavigationMenuLink>
                         </Link>
                    </NavigationMenuItem>
                ))}

                <NavigationMenuItem>
                    <NavigationMenuTrigger className={navTriggerClasses}>Courses</NavigationMenuTrigger>
                    <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                        {courseCategories.map((component) => (
                        <ListItem
                            key={component.title}
                            title={component.title}
                            href={component.href}
                        >
                            {component.description}
                        </ListItem>
                        ))}
                    </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                
                {navLinks.slice(1).map((link) => (
                     <NavigationMenuItem key={link.href}>
                        <Link href={link.href} legacyBehavior passHref>
                          <NavigationMenuLink className={navLinkClasses}>
                            {link.label}
                          </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                ))}

            </NavigationMenuList>
          </NavigationMenu>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-2">
             <Link href="/order" className="relative">
                <Button variant="ghost" size="icon" className={cn(scrolled ? 'text-foreground' : 'text-white/80 hover:text-white')}>
                    <ShoppingCart className="h-5 w-5" />
                </Button>
                {isClient && cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {cart.length}
                    </span>
                )}
             </Link>

            {isClient && !loading && (
              <>
                {user && userProfile ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={userProfile.photoURL || ''} alt={userProfile.displayName || 'User'} />
                          <AvatarFallback>{getInitials(userProfile.displayName)}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{userProfile.displayName}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {userProfile.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                      {userProfile.role === 'admin' && (
                        <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                          <Shield className="mr-2 h-4 w-4" />
                          <span>Admin</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button asChild>
                    <Link href="/auth">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Sign In
                    </Link>
                  </Button>
                )}
              </>
            )}
            {(!isClient || loading) && <div className="h-10 w-20 rounded-md bg-muted animate-pulse" />}
          </div>


          {/* Mobile Menu Button */}
          <button
            className={cn("md:hidden p-2", scrolled ? "text-foreground" : "text-white")}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-md border-t border-border"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
               <div className="flex flex-col gap-2 pt-4 border-t border-border">
                {user ? (
                  <>
                     <Button asChild variant="ghost" onClick={() => {router.push('/dashboard'); setIsOpen(false)}}>
                        <Link href="/dashboard">
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Dashboard
                        </Link>
                    </Button>
                    {userProfile?.role === 'admin' && (
                       <Button asChild variant="ghost" onClick={() => {router.push('/dashboard'); setIsOpen(false)}}>
                          <Link href="/dashboard">
                            <Shield className="w-4 h-4 mr-2" />
                            Admin
                          </Link>
                      </Button>
                    )}
                    <Button onClick={() => { handleSignOut(); setIsOpen(false);}} variant="outline">
                       <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                   <Button asChild>
                    <Link href="/auth" onClick={() => setIsOpen(false)}>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Sign In
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={props.href || ''}
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
