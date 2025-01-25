import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NotebookPen, CalendarCheck2 } from "lucide-react";

type DepartmentOption = {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
};

const departmentOptions: DepartmentOption[] = [
  {
    title: "Conducted Events",
    description: "Add or analyze details of conducted events",
    href: "conducted",
    icon: <NotebookPen className="h-8 w-8" />,
  },
  {
    title: "Attended Events",
    description: "Add or analyze details of attended events",
    href: "attended",
    icon: <CalendarCheck2 className="h-8 w-8" />,
  },
];

export default function Department() {
  return (
    <div className="relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="relative z-10 bg-white bg-opacity-90 p-8 rounded-xl shadow-2xl max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Department Details
        </h1>
        <div className="grid gap-6 md:grid-cols-2 mt-8">
          {departmentOptions.map((option) => (
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
                <Link href={`/department/${option.href}/add`} passHref>
                  <Button className="w-full bg-sky-800 hover:bg-sky-900 text-white font-bold py-2 px-4 my-2 rounded">
                    Add {option.title.split(" - ")[0]}
                  </Button>
                </Link>
                <Link href={`/department/${option.href}/analyze`} passHref>
                  <Button className="w-full bg-sky-800 hover:bg-sky-900 text-white font-bold py-2 px-4 my-2 rounded">
                    Analyze {option.title.split(" - ")[0]}
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
