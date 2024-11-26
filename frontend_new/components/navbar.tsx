"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Cookie from "js-cookie";
import { Menu, X } from "lucide-react";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const tokenFromCookie = Cookie.get("accessToken");
    console.log("Access Token:", tokenFromCookie);

    if (tokenFromCookie) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    Cookie.remove("accessToken");
    setIsLoggedIn(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header>
      <div className="bg-sky-800 text-white flex justify-between items-center cursor-pointer font-bold text-lg">
        <div className="flex justify-start items-center">
          <div className="bg-white border-sky-800 rounded-r-full py-2 px-6">
            <Link href="http://10.2.80.90:8080/">
              <img
                src="/PESU-logo.png"
                alt="Logo"
                className="w-24 h-auto md:w-28 md:h-auto"
              />
            </Link>
          </div>
          <h1 className="px-6 text-xl">PESU NAAC Portal</h1>
        </div>
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
                <Button
                  variant="outline"
                  className="h-10"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
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
            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-sky-800">
            <Link
              href="/research"
              className="hover:bg-sky-700 block px-3 py-2 rounded-md text-base font-medium"
            >
              Research
            </Link>
            <Link
              href="/department"
              className="hover:bg-sky-700 block px-3 py-2 rounded-md text-base font-medium"
            >
              Department
            </Link>
            <Link
              href="/student"
              className="hover:bg-sky-700 block px-3 py-2 rounded-md text-base font-medium"
            >
              Student
            </Link>
            {isLoggedIn ? (
              <Button
                variant="outline"
                className="w-full border-white text-white hover:bg-sky-700"
                onClick={handleLogout}
              >
                Logout
              </Button>
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

// "use client";

// import Link from "next/link";
// import { Button, buttonVariants } from "@/components/ui/button";
// import { useState, useEffect } from "react";
// import { deleteCookie, getCookie, getCookies } from "cookies-next";
// import { Menu, X, ChevronDown } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// function Navbar() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   useEffect(() => {
//     const allCookies = getCookies();
//     console.log("All cookies:", allCookies);

//     const tokenFromCookie = getCookie("accessToken");
//     console.log("Access Token:", tokenFromCookie);

//     if (tokenFromCookie) {
//       setIsLoggedIn(true);
//     }
//   }, []);

//   const handleLogout = () => {
//     deleteCookie("auth");
//     setIsLoggedIn(false);
//   };

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   return (
//     <header>
//       <div className="bg-sky-800 text-white flex justify-between items-center cursor-pointer font-bold text-lg">
//         <div className="bg-white border-sky-800 rounded-r-full py-2 px-6">
//           <img
//             src="/PESU-logo.png"
//             alt="Logo"
//             className="w-24 h-auto md:w-28 md:h-auto"
//           />
//         </div>
//         <nav className="hidden md:block">
//           <ul className="flex space-x-6 md:mx-4 items-center">
//             <li>
//               <DropdownMenu>
//                 <DropdownMenuTrigger className="flex items-center hover:underline">
//                   Research <ChevronDown className="ml-1 h-4 w-4" />
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent>
//                   <DropdownMenuItem>
//                     <Link href="/research/add" className="w-full">
//                       Add
//                     </Link>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem>
//                     <Link href="/research/analyze" className="w-full">
//                       Analyze
//                     </Link>
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </li>
//             <li>
//               <Link href="/department" className="hover:underline">
//                 Department
//               </Link>
//             </li>
//             <li>
//               <Link href="/student" className="hover:underline">
//                 Student
//               </Link>
//             </li>
//             <li>
//               {isLoggedIn ? (
//                 <Button
//                   variant="outline"
//                   className="h-10"
//                   onClick={handleLogout}
//                 >
//                   Logout
//                 </Button>
//               ) : (
//                 <Link
//                   className={buttonVariants({
//                     variant: "outline",
//                     className: "h-10",
//                   })}
//                   href="/login"
//                 >
//                   Login
//                 </Link>
//               )}
//             </li>
//           </ul>
//         </nav>
//         <div className="md:hidden">
//           <button
//             onClick={toggleMobileMenu}
//             className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
//           >
//             <span className="sr-only">Open main menu</span>
//             {isMobileMenuOpen ? (
//               <X className="block h-6 w-6" aria-hidden="true" />
//             ) : (
//               <Menu className="block h-6 w-6" aria-hidden="true" />
//             )}
//           </button>
//         </div>
//       </div>
//       {isMobileMenuOpen && (
//         <div className="md:hidden">
//           <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-sky-800">
//             <Link
//               href="/research/add"
//               className="hover:bg-sky-700 block px-3 py-2 rounded-md text-base font-medium"
//             >
//               Research - Add
//             </Link>
//             <Link
//               href="/research/analyze"
//               className="hover:bg-sky-700 block px-3 py-2 rounded-md text-base font-medium"
//             >
//               Research - Analyze
//             </Link>
//             <Link
//               href="/department"
//               className="hover:bg-sky-700 block px-3 py-2 rounded-md text-base font-medium"
//             >
//               Department
//             </Link>
//             <Link
//               href="/student"
//               className="hover:bg-sky-700 block px-3 py-2 rounded-md text-base font-medium"
//             >
//               Student
//             </Link>
//             {isLoggedIn ? (
//               <Button
//                 variant="outline"
//                 className="w-full border-white text-white hover:bg-sky-700"
//                 onClick={handleLogout}
//               >
//                 Logout
//               </Button>
//             ) : (
//               <Link
//                 className={buttonVariants({
//                   variant: "outline",
//                   className: "h-10 w-full",
//                 })}
//                 href="/login"
//               >
//                 Login
//               </Link>
//             )}
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }

// export default Navbar;
