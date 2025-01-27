"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Award, BookOpen, FileText, MoveRight, Users } from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";
import { backendUrl } from "@/config";

export default function Home() {
  const [stats, setStats] = useState({
    conferences: 0,
    patents: 0,
    journals: 0,
    activities: 0,
  });

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/v1/home`)
      .then((response) => {
        const data = response.data;
        setStats({
          conferences: data.conferences,
          patents: data.patents,
          journals: data.journals,
          activities: data.dept_attended + data.dept_conducted,
        });
      })
      .catch((error) => {
        console.error("Error fetching stats:", error);
      });
  }, []);

  return (
    <div className="bg-gradient-to-b from-black/40 to-black/60 rounded-lg">
      <div className="relative z-10 pt-12 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-8 space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            Welcome to PESU Research Portal
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Discover groundbreaking research, patents, and academic achievements
            from our community of innovative minds shaping the future of
            education and technology.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="group relative overflow-hidden rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 p-6 transition-all duration-300 hover:bg-white/20 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Award className="h-12 w-12 text-white mb-4" />
            <h3 className="font-semibold text-2xl text-white mb-2">
              Conferences
            </h3>
            <p className="text-3xl font-bold text-white">{stats.conferences}</p>
            <p className="text-sm text-gray-300 mt-1">Publications</p>
          </div>

          <div className="group relative overflow-hidden rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 p-6 transition-all duration-300 hover:bg-white/20 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <FileText className="h-12 w-12 text-white mb-4" />
            <h3 className="font-semibold text-2xl text-white mb-2">Patents</h3>
            <p className="text-3xl font-bold text-white">{stats.patents}</p>
            <p className="text-sm text-gray-300 mt-1">Registered</p>
          </div>

          <div className="group relative overflow-hidden rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 p-6 transition-all duration-300 hover:bg-white/20 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <BookOpen className="h-12 w-12 text-white mb-4" />
            <h3 className="font-semibold text-2xl text-white mb-2">Journals</h3>
            <p className="text-3xl font-bold text-white">{stats.journals}</p>
            <p className="text-sm text-gray-300 mt-1">Published</p>
          </div>

          <div className="group relative overflow-hidden rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 p-6 transition-all duration-300 hover:bg-white/20 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Users className="h-12 w-12 text-white mb-4" />
            <h3 className="font-semibold text-2xl text-white mb-2">
              Activities
            </h3>
            <p className="text-3xl font-bold text-white">{stats.activities}</p>
            <p className="text-sm text-gray-300 mt-1">Conducted</p>
          </div>
        </div>

        <div className="text-center mb-8">
          <Link href="/login">
            <Button className="bg-sky-800 hover:bg-sky-800/90 px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              Get Started <MoveRight className="w-6 h-6 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
