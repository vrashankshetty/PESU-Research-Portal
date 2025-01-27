import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { GraduationCap, BookOpen, Award, FileText, Building2, FlaskConical } from 'lucide-react';

export default function Home() {
  // Example statistics - replace with actual data fetching
  const stats = [
    {
      title: "Teachers",
      value: "150+",
      icon: GraduationCap,
      description: "Active faculty members"
    },
    {
      title: "Journals",
      value: "200+",
      icon: BookOpen,
      description: "Published research papers"
    },
    {
      title: "Conferences",
      value: "80+",
      icon: FileText,
      description: "Papers presented"
    },
    {
      title: "Patents",
      value: "25+",
      icon: Award,
      description: "Registered patents"
    },
    {
      title: "Dept Activities",
      value: "120+",
      icon: Building2,
      description: "Academic events"
    },
    {
      title: "Research Projects",
      value: "45+",
      icon: FlaskConical,
      description: "Ongoing projects"
    }
  ];

  return (
    <div className="p-8  bg-white/90 backdrop-blur-sm shadow-xl">
      <h1 className="text-3xl font-bold text-center mb-8 text-sky-800">Welcome to NAAC Portal</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">{stat.title}</CardTitle>
              <stat.icon className="h-6 w-6 text-sky-800" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-sky-800">{stat.value}</div>
              <p className="text-sm text-gray-600 mt-2">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}