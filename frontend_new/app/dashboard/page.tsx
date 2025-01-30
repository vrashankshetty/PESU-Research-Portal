"use client";

import { Award, BookOpen, FileText, Users } from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";
import { backendUrl } from "@/config";
import Cookies from "js-cookie";
import Link from "next/link";

export default function Dashboard() {
  const [stats, setStats] = useState({
    conferences: 0,
    patents: 0,
    journals: 0,
    attended: 0,
    conducted: 0,
  });

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/v1/home/stats`, {
        withCredentials: true,
      })
      .then((response) => {
        const data = response.data;
        setStats({
          conferences: data.conferences,
          patents: data.patents,
          journals: data.journals,
          attended: data.dept_attended,
          conducted: data.dept_conducted,
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
            Your Dashboard
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Discover your overall activity and stats in the past year! Click on
            the section to view more
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 pb-16">
          <Link href="/research/conferences/analyze" className="block">
            <div className="group relative overflow-hidden rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 p-6 transition-all duration-300 hover:bg-white/20 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Award className="h-12 w-12 text-white mb-4" />
              <h3 className="font-semibold text-2xl text-white mb-2">
                Conferences
              </h3>
              <p className="text-3xl font-bold text-white">
                {stats.conferences}
              </p>
              <p className="text-sm text-gray-300 mt-1">Publications</p>
            </div>
          </Link>

          <Link href="/research/patents/analyze" className="block">
            <div className="group relative overflow-hidden rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 p-6 transition-all duration-300 hover:bg-white/20 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <FileText className="h-12 w-12 text-white mb-4" />
              <h3 className="font-semibold text-2xl text-white mb-2">
                Patents
              </h3>
              <p className="text-3xl font-bold text-white">{stats.patents}</p>
              <p className="text-sm text-gray-300 mt-1">Registered</p>
            </div>
          </Link>

          <Link href="/research/journals/analyze" className="block">
            <div className="group relative overflow-hidden rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 p-6 transition-all duration-300 hover:bg-white/20 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <BookOpen className="h-12 w-12 text-white mb-4" />
              <h3 className="font-semibold text-2xl text-white mb-2">
                Journals
              </h3>
              <p className="text-3xl font-bold text-white">{stats.journals}</p>
              <p className="text-sm text-gray-300 mt-1">Published</p>
            </div>
          </Link>

          <Link href="/department/attended/analyze" className="block">
            <div className="group relative overflow-hidden rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 p-6 transition-all duration-300 hover:bg-white/20 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Users className="h-12 w-12 text-white mb-4" />
              <h3 className="font-semibold text-2xl text-white mb-2">
                Events
              </h3>
              <p className="text-3xl font-bold text-white">{stats.attended}</p>
              <p className="text-sm text-gray-300 mt-1">Attended</p>
            </div>
          </Link>

          <Link href="/department/conducted/analyze" className="block">
            <div className="group relative overflow-hidden rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 p-6 transition-all duration-300 hover:bg-white/20 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Users className="h-12 w-12 text-white mb-4" />
              <h3 className="font-semibold text-2xl text-white mb-2">
                Activities
              </h3>
              <p className="text-3xl font-bold text-white">{stats.conducted}</p>
              <p className="text-sm text-gray-300 mt-1">Conducted</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
