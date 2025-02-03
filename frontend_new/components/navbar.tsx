"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { useState, useEffect, useMemo, useCallback } from "react";
import Cookie from "js-cookie";
import {
  Menu,
  X,
  CircleUserRound,
  LogOut,
  UserRoundIcon as UserRoundPen,
  Gauge,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { verifyToken } from "@/api";

function Navbar() {
  const { isLoggedIn, setIsLoggedIn, user, setUser } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const router = useRouter();
  const accessToken = Cookie.get("accessToken");

  useEffect(() => {
    const fetchUser = async () => {
      if (accessToken) {
        const resp: any = await verifyToken(accessToken);
        if (resp?.status == 200) {
          setIsLoggedIn(true);
          setUser(resp?.data?.data);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
      setIsVerifying(false);
    };
    fetchUser();
  }, [accessToken, setIsLoggedIn, setUser]);

  const navLinks = useMemo(
    () => (
      <>
        <li>
          <Link
            href="/research"
            className="hover:bg-sky-500 block px-3 py-2 rounded-md text-base font-bold"
          >
            Research
          </Link>
        </li>
        <li>
          <Link
            href="/department"
            className="hover:bg-sky-500 block px-3 py-2 rounded-md text-base font-bold"
          >
            Department
          </Link>
        </li>
        <li>
          <Link
            href="/student"
            className="hover:bg-sky-500 block px-3 py-2 rounded-md text-base font-bold"
          >
            Student
          </Link>
        </li>
        {isLoggedIn && user?.role == "admin" && user?.accessTo == "all" && (
          <li>
            <Link
              href="/admin"
              className="hover:bg-sky-500 block px-3 py-2 rounded-md text-base font-bold"
            >
              Analysis
            </Link>
          </li>
        )}
      </>
    ),
    [isLoggedIn, user]
  );

  const handleLogout = useCallback(() => {
    Cookie.remove("accessToken", { path: "/" });
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = "/login";
  }, [setIsLoggedIn, setUser]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  return (
    <header>
      <div className="bg-sky-800 text-white flex justify-between items-center font-bold text-lg">
        <Link href="/">
          <div className="flex justify-start items-center">
            <div className="bg-white border-sky-800 rounded-r-full py-2 px-6">
              <img
                src="/PESU-logo.png"
                alt="Logo"
                className="w-24 h-auto md:w-28 md:h-auto"
              />
            </div>
            <h1 className="px-6 md:text-xl">PESU NAAC Portal</h1>
          </div>
        </Link>
        <nav className="hidden md:block">
          <ul className="flex space-x-2 mr-4 items-center">
            {isVerifying ? (
              <li>
                <Loader2 className="h-6 w-6 animate-spin" />
              </li>
            ) : (
              navLinks
            )}
            <li>
              {isVerifying ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    {user?.profileImg ? (
                      <Avatar>
                        <AvatarImage src={user?.profileImg} />
                      </Avatar>
                    ) : (
                      <CircleUserRound className="h-6 w-6" />
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuItem onClick={() => router.push("/profile")}>
                      <UserRoundPen className="mr-2 h-4 w-4" />
                      My Profile
                    </DropdownMenuItem>
                    {isLoggedIn && user?.role != "admin" && (
                      <DropdownMenuItem
                        onClick={() => router.push("/dashboard")}
                      >
                        <Gauge className="mr-2 h-4 w-4" />
                        My Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  className={buttonVariants({
                    variant: "outline",
                    className: "h-10",
                  })}
                  href="/login"
                >
                  Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            <span className="sr-only">Open main menu</span>
            {isMobileMenuOpen ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center bg-sky-800">
            {isVerifying ? (
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            ) : (
              <>
                {navLinks}
                {isLoggedIn ? (
                  <>
                    <Link
                      href="/profile"
                      className="hover:bg-sky-500 block px-3 py-2 rounded-md text-base font-bold"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      className="hover:bg-sky-500 block px-3 py-2 rounded-md text-base font-bold"
                    >
                      My Dashboard
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full border-white text-white hover:bg-sky-500"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <Link
                    className={buttonVariants({
                      variant: "outline",
                      className: "h-10",
                    })}
                    href="/login"
                  >
                    Login
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
