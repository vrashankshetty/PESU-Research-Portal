import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, PhoneCall } from "lucide-react";

type ContactOption = {
  name: string;
  designation: string;
  email: string;
  phone?: string;
};

const ContactOptions: ContactOption[] = [
  {
    name: "Dr. Gauri Rapate",
    designation: "Assistant Professor",
    email: "gauri.rapate@pes.edu",
    phone: "+91 98861 84217",
  },
  {
    name: "Sheela Devi M",
    designation: "Assistant Professor",
    email: "sheelam@pes.edu",
    phone: "+91 88675 06022",
  },
  {
    name: "Vrashank Shetty",
    designation: "Student",
    email: "PES2UG22CS671@pesu.pes.edu",
  },
  {
    name: "Vyoman Jain",
    designation: "Student",
    email: "PES2UG22CS672@pesu.pes.edu",
  },
  {
    name: "Abhijith M S",
    designation: "Student",
    email: "PES2UG22CS013@pesu.pes.edu",
  },
];

export default function Contact() {
  return (
    <div className="relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="relative z-10 bg-white bg-opacity-90 p-6 rounded-xl shadow-2xl max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Contact Details
        </h1>
        <div className="grid gap-6 md:grid-cols-2 mt-8">
          {ContactOptions.map((option) => (
            <Card
              key={option.name}
              className="overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105"
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">
                  {option.name}
                </h2>
                <p className="text-gray-600 mb-4">{option.designation}</p>
                <Link href={`mailto:${option.email}`} passHref>
                  <Button className="w-full bg-sky-800 hover:bg-sky-900 text-white font-bold py-2 mb-2 rounded text-sm md:text-base">
                    <Mail className="h-6 w-6 mr-2" />
                    {option.email}
                  </Button>
                </Link>
                {option.phone && (
                  <div className="flex mt-2">
                    <PhoneCall className="h-6 w-6 mr-2" /> {option.phone}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
