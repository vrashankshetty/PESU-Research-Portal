import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Lightbulb,
  Medal,
  PenTool,
  BookCopyIcon,
  SquarePlus,
  Search,
} from "lucide-react";

type StudentOption = {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
};

const studentOptions: StudentOption[] = [
  {
    title: "Intra University events",
    description:
      "Add or analyze sports and cultural events / competitions organised by the Institution",
    href: "intraSports",
    icon: <BookOpen className="h-8 w-8" />,
  },
  {
    title: "Inter University Medals",
    description:
      "Add or analyze awards/medals won by students in sports/cultural activities at inter-university/state/national/international events",
    href: "interSports",
    icon: <Medal className="h-8 w-8" />,
  },
  {
    title: "Higher Education",
    description:
      "Add or analyze graduated students who have progressed to higher education",
    href: "higherEducation",
    icon: <BookCopyIcon className="h-8 w-8" />,
  },
  {
    title: "Competitive Exams",
    description:
      "Add or analyze students qualifying in state/ national/ international level examinations",
    href: "higherExams",
    icon: <PenTool className="h-8 w-8" />,
  },
  {
    title: "Career Counseling",
    description:
      "Add or analyze students benefited by career counseling and guidance for competitive examinations offered by the Institution",
    href: "careerCounseling",
    icon: <Lightbulb className="h-8 w-8" />,
  },
];

export default function Student() {
  return (
    <div className="relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="relative z-10 bg-white bg-opacity-90 p-8 rounded-xl shadow-2xl max-w-7xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Student
        </h1>
        <div className="grid gap-6 lg:grid-cols-3">
          {studentOptions.map((option) => (
            <Card
              key={option.title}
              className="overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105"
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="mb-4 text-primary">{option.icon}</div>
                <h2 className="text-2xl font-bold mb-2 text-gray-800">
                  {option.title}
                </h2>
                <p className="text-gray-600 mb-4">{option.description}</p>
                <Link href={`/student/${option.href}/add`} passHref>
                  <Button className="w-full bg-sky-800 hover:bg-sky-900 text-white font-bold py-2 px-4 my-2 rounded">
                    <SquarePlus className="h-6 w-6 mr-2" />
                    Add Data
                  </Button>
                </Link>
                <Link href={`/student/${option.href}/analyze`} passHref>
                  <Button className="w-full bg-sky-800 hover:bg-sky-900 text-white font-bold py-2 px-4 my-2 rounded">
                    <Search className="h-6 w-6 mr-2" /> View, Update & Analyze
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
