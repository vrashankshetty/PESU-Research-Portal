import Link from "next/link";
import { Book, Microscope, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-black/40 to-black/60 rounded-lg">
      <div className="relative z-10 pt-12 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-8 space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            Welcome to PESU Portal
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed"></p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-16">
          <Link href={"/admin/research"}>
            <div className="group relative overflow-hidden rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 p-6 transition-all duration-300 hover:bg-white/20 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Microscope className="h-12 w-12 text-white mb-4" />
              <h3 className="font-semibold text-2xl text-white mb-2">
                Research
              </h3>
            </div>
          </Link>

          <Link href={"/admin/department"}>
            <div className="group relative overflow-hidden rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 p-6 transition-all duration-300 hover:bg-white/20 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Users className="h-12 w-12 text-white mb-4" />
              <h3 className="font-semibold text-2xl text-white mb-2">
                Department
              </h3>
            </div>
          </Link>


          <Link href={'/admin/student'}>
          <div className="group relative overflow-hidden rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 p-6 transition-all duration-300 hover:bg-white/20 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Book className="h-12 w-12 text-white mb-4" />
            <h3 className="font-semibold text-2xl text-white mb-2">Student</h3>
          </div>
          </Link>

          <Link href={'/admin/user'}>
          <div className="group relative overflow-hidden rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 p-6 transition-all duration-300 hover:bg-white/20 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Users className="h-12 w-12 text-white mb-4" />
            <h3 className="font-semibold text-2xl text-white mb-2">Users</h3>
          </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
