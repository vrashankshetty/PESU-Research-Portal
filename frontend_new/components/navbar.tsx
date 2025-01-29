"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Cookie from "js-cookie";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CircleUserRound, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Navbar() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const router = useRouter();
  const accessToken = Cookie.get("accessToken");

  useEffect(() => {
    if (accessToken) {
      setIsLoggedIn(true);
      const img = Cookie.get("profileImg");
      setProfileImg(img || null);
    } else {
      setIsLoggedIn(false);
      setProfileImg(null);
    }
  }, []);

  const handleLogout = () => {
    Cookie.remove("accessToken", { path: "/" });
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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
          <ul className="flex space-x-6 md:mx-4 items-center">
            <li>
              <Link href="/research" className="hover:underline">
                Research
              </Link>
            </li>
            <li>
              <Link href="/department" className="hover:underline">
                Department
              </Link>
            </li>
            <li>
              <Link href="/student" className="hover:underline">
                Student
              </Link>
            </li>
            <li>
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    {profileImg ? (
                      <Avatar>
                        <AvatarImage src={profileImg} />
                      </Avatar>
                    ) : (
                      <CircleUserRound className="h-6 w-6" />
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuItem onClick={() => router.push("/profile")}>
                      My Profile
                    </DropdownMenuItem>
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
            <Link
              href="/research"
              className="hover:bg-sky-500 block px-3 py-2 rounded-md text-base font-medium"
            >
              Research
            </Link>
            <Link
              href="/department"
              className="hover:bg-sky-500 block px-3 py-2 rounded-md text-base font-medium"
            >
              Department
            </Link>
            <Link
              href="/student"
              className="hover:bg-sky-500 block px-3 py-2 rounded-md text-base font-medium"
            >
              Student
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  href="/profile"
                  className="hover:bg-sky-500 block px-3 py-2 rounded-md text-base font-medium"
                >
                  My Profile
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
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
