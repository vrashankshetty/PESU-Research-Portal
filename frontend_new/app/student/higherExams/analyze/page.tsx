"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";

type Patent = {
  teacherAdminId: string;
  campus: "EC" | "RR" | "HSN";
  dept: "EC" | "CSE";
  patentNumber: string;
  patentTitle: string;
  isCapstone: boolean;
  year: string;
  documentLink: string;
};

interface Teacher {
  id: string;
  empId: string;
  password: string;
  name: string;
  phno: string;
  dept: "EC" | "CSE";
  campus: "EC" | "RR" | "HSN";
  panNo: string;
  qualification: string;
  designation: string;
  expertise: string;
  dateofJoining: string;
  totalExpBfrJoin: string;
  googleScholarId: string;
  sId: string;
  oId: string;
  profileImg?: string;
  createdAt: string;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

function HigherExamsDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [patents, setPatents] = useState<Patent[]>([]);
  const [filteredPatents, setFilteredPatents] = useState<Patent[]>([]);
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar");
  const [metric, setMetric] = useState<"campus" | "dept" | "year">("campus");
  const [examType, setExamType] = useState<"NET" | "SLET" | "GATE" | "GMAT" | "CAT" | "GRE" | "JAM" | "IELTS" | "TOEFL">("NET");
  const [yearRange, setYearRange] = useState({ start: "0", end: "0" });
  const [selectedCampuses, setSelectedCampuses] = useState<string[]>([]);
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);

  const getFilteredTeachers = () => {
    console.log(
      filteredPatents,
      teachers.filter((teacher) =>
        filteredPatents.some((patent) => patent.teacherAdminId === teacher.id)
      )
    );
    return teachers.filter((teacher) =>
      filteredPatents.some((patent) => patent.teacherAdminId === teacher.id)
    );
  };

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get("http://10.2.80.90:8081/api/v1/user", {
          withCredentials: true,
        });
        console.log(response.data);
        setTeachers(response.data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };
    fetchTeachers();
  }, []);

  useEffect(() => {
    setFilteredTeachers(getFilteredTeachers());
  }, [teachers, filteredPatents]);

  const updateQueryParams = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.set("chartType", chartType);
    params.set("metric", metric);
    params.set("yearStart", yearRange.start);
    params.set("yearEnd", yearRange.end);
    params.set("campuses", selectedCampuses.join(","));
    params.set("depts", selectedDepts.join(","));
    router.push(`?${params.toString()}`);
  }, [
    chartType,
    metric,
    yearRange,
    selectedCampuses,
    selectedDepts,
    router,
    searchParams,
  ]);

  useEffect(() => {
    const fetchPatents = async () => {
      try {
        const response = await axios.get(
          "http://10.2.80.90:8081/api/v1/patent",
          { withCredentials: true }
        );
        console.log(response);
        setPatents(response.data);
      } catch (error) {
        console.error("Error fetching patents:", error);
      }
    };
    fetchPatents();
  }, []);

  useEffect(() => {
    setChartType(
      (searchParams.get("chartType") as "bar" | "line" | "pie") || "bar"
    );
    setMetric(
      (searchParams.get("metric") as "campus" | "dept" | "year") || "campus"
    );
    setYearRange({
      start: searchParams.get("yearStart") || "0",
      end: searchParams.get("yearEnd") || "0",
    });
    setSelectedCampuses(
      searchParams.get("campuses")?.split(",").filter(Boolean) || []
    );
    setSelectedDepts(
      searchParams.get("depts")?.split(",").filter(Boolean) || []
    );
  }, [searchParams]);

  useEffect(() => {
    const filtered = patents.filter((patent) => {
      const yearInRange =
        parseInt(patent.year) >= parseInt(yearRange.start) &&
        parseInt(patent.year) <= parseInt(yearRange.end);
      const campusMatch =
        selectedCampuses.length === 0 ||
        selectedCampuses.includes(patent.campus);
      const deptMatch =
        selectedDepts.length === 0 || selectedDepts.includes(patent.dept);
      return yearInRange && campusMatch && deptMatch;
    });
    setFilteredPatents(filtered);
    updateQueryParams();
  }, [patents, yearRange, selectedCampuses, selectedDepts, updateQueryParams]);

  const getChartData = () => {
    const data: { [key: string]: number } = {};
    filteredPatents.forEach((patent) => {
      const key = patent[metric];
      data[key] = (data[key] || 0) + 1;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  };

  const renderChart = () => {
    const data = getChartData();

    if (data.length === 0) {
      return (
        <div className="flex items-center justify-center h-[400px]">
          <p className="text-lg font-semibold">No Matching Data Available</p>
        </div>
      );
    }

    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} barSize={24} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "rgba(255, 255, 255, 0.8)",
                  border: "none",
                  borderRadius: "4px",
                }}
              />
              <Legend />
              <Bar dataKey="value" fill="#8884d8">
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      case "line":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "rgba(255, 255, 255, 0.8)",
                  border: "none",
                  borderRadius: "4px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "rgba(255, 255, 255, 0.8)",
                  border: "none",
                  borderRadius: "4px",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
    }
  };

  const downloadChartAsPNG = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        const link = document.createElement("a");
        link.download = "data.png";
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  const downloadTableAsCSV = () => {
    const headers = [
      "Teacher ID",
      "Campus",
      "Department",
      "Patent Number",
      "Patent Title",
      "Year",
      "Capstone",
      "Document Link",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredPatents.map((patent) =>
        [
          patent.teacherAdminId,
          patent.campus,
          patent.dept,
          patent.patentNumber,
          `"${patent.patentTitle.replace(/"/g, '""')}"`,
          patent.year,
          patent.isCapstone ? "Yes" : "No",
          patent.documentLink,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "data.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container bg-black bg-opacity-50 mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Higher Examination Analysis Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={chartType}
              onValueChange={(value: "bar" | "line" | "pie") =>
                setChartType(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select chart type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="pie">Pie Chart</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={examType}
              onValueChange={(value: "NET" | "SLET" | "GATE" | "GMAT" | "CAT" | "GRE" | "JAM" | "IELTS" | "TOEFL") =>
                setExamType(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select chart type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NET">NET</SelectItem>
                <SelectItem value="SLET">SLET</SelectItem>
                <SelectItem value="GATE">GATE</SelectItem>
                <SelectItem value="GMAT">GMAT</SelectItem>
                <SelectItem value="CAT">CAT</SelectItem>
                <SelectItem value="GRE">GRE</SelectItem>
                <SelectItem value="JAM">JAM</SelectItem>
                <SelectItem value="IELTS">IELTS</SelectItem>
                <SelectItem value="TOEFL">TOEFL</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Higher Examination Analysis Chart</CardTitle>
        </CardHeader>
        <CardContent className="h-[480px]">
          <div ref={chartRef}>{renderChart()}</div>
          <Button onClick={downloadChartAsPNG} className="mt-4">
            Download Chart as PNG
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Higher Examination Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="table" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="cards">Card View</TabsTrigger>
            </TabsList>
            <TabsContent value="table">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-3">Year</th>
                      <th className="px-6 py-3">Registration number/roll number for the exam</th>
                      <th className="px-6 py-3">Name of student selected</th>
                      <th className="px-6 py-3">Name of the examination</th>
                      <th className="px-6 py-3">Link to the relevant document</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatents.map((patent, index) => {
                      const teacher = filteredTeachers.find(
                        (t) => t.id === patent.teacherAdminId
                      );
                      console.log(patent.teacherAdminId, filteredTeachers);

                      return (
                        <tr key={index} className="bg-white border-b">
                          <td className="px-6 py-4">
                            {teacher ? teacher.name : "Unknown"}
                          </td>
                          <td className="px-6 py-4">{patent.campus}</td>
                          <td className="px-6 py-4">{patent.dept}</td>
                          <td className="px-6 py-4">{patent.patentNumber}</td>
                          <td className="px-6 py-4">{patent.patentTitle}</td>
                          <td className="px-6 py-4">{patent.year}</td>
                          <td className="px-6 py-4">
                            {patent.isCapstone ? "Yes" : "No"}
                          </td>
                          <td className="px-6 py-4">
                            <a
                              href={patent.documentLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <Button onClick={downloadTableAsCSV} className="mt-4">
                Download Table as CSV
              </Button>
            </TabsContent>
            <TabsContent value="cards">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPatents.map((patent, index) => {
                  const teacher = filteredTeachers.find(
                    (t) => t.id === patent.teacherAdminId
                  );

                  return (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{patent.patentTitle}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>
                          <strong>Faculty:</strong>{" "}
                          {teacher ? teacher.name : "Unknown"}
                        </p>
                        <p>
                          <strong>Campus:</strong> {patent.campus}
                        </p>
                        <p>
                          <strong>Department:</strong> {patent.dept}
                        </p>
                        <p>
                          <strong>Patent Number:</strong> {patent.patentNumber}
                        </p>
                        <p>
                          <strong>Year:</strong> {patent.year}
                        </p>
                        <p>
                          <strong>Capstone:</strong>{" "}
                          {patent.isCapstone ? "Yes" : "No"}
                        </p>
                        <a
                          href={patent.documentLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Document
                        </a>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PatentAnalyze() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HigherExamsDashboard />
    </Suspense>
  );
}
