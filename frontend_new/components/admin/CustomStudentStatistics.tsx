import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

type Event = {
  [key: string]: any
}

type CustomStatisticsProps = {
  events: Event[]
  eventType:any
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

const CustomStatistics: React.FC<CustomStatisticsProps> = ({ events, eventType }) => {
  const [leftRange, setLeftRange] = useState<DateRange | { from: number; to: number } | undefined>({
    from: 2023,
    to: 2023,
  })
  const [rightRange, setRightRange] = useState<DateRange | { from: number; to: number } | undefined>({
    from: 2024,
    to: 2024,
  })
  const [leftChartType, setLeftChartType] = useState<"bar" | "line" | "pie">("line")
  const [rightChartType, setRightChartType] = useState<"bar" | "line" | "pie">("line")

  useEffect(() => {
    if (eventType === "intraSports") {
      setLeftRange({ from: new Date(2023, 0, 1), to: new Date(2023, 11, 31) })
      setRightRange({ from: new Date(2024, 0, 1), to: new Date(2024, 11, 31) })
    } else {
      setLeftRange({ from: 2023, to: 2023 })
      setRightRange({ from: 2024, to: 2024 })
    }
  }, [eventType])

  const getChartData = (range: DateRange | { from: number; to: number } | undefined) => {
    if (!range?.from || !range?.to) return []

    const filteredEvents = events.filter((event) => {
      if (eventType === "intraSports") {
        const eventDate = new Date(event.durationStartDate)
        return eventDate >= (range as DateRange).from! && eventDate <= (range as DateRange).to!
      } else {
        const eventYear = Number.parseInt(event.year)
        return (
          eventYear >= (range as { from: number; to: number }).from &&
          eventYear <= (range as { from: number; to: number }).to
        )
      }
    })

    const data: { [key: string]: number } = {}
    filteredEvents.forEach((event) => {
      const key =
        eventType === "intraSports"
          ? format(new Date(event.durationStartDate), "MMM yyyy")
          : event.year
      data[key] = (data[key] || 0) + 1
    })

    return Object.entries(data)
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => a.key.localeCompare(b.key))
  }

  const leftChartData = getChartData(leftRange)
  const rightChartData = getChartData(rightRange)

  const renderChart = (data: any[], chartType: "bar" | "line" | "pie") => {
    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="key" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )
      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="key" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        )
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                label={({ key, count }) => `${key}: ${count}`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )
    }
  }

  const RangeSelector = ({ range, setRange }: { range: any; setRange: any }) => {
    if (eventType === "intraSports") {
      return <DatePickerWithRange date={range} setDate={setRange} />
    } else {
      return (
        <div className="flex space-x-2">
          <Select
            value={range.from.toString()}
            onValueChange={(value) => setRange({ ...range, from: Number.parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="From Year" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }, (_, i) => 2020 + i).map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={range.to.toString()}
            onValueChange={(value) => setRange({ ...range, to: Number.parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="To Year" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }, (_, i) => 2020 + i).map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{eventType} Events (Left Range)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 space-y-4">
            <RangeSelector range={leftRange} setRange={setLeftRange} />
            <Select value={leftChartType} onValueChange={(value: "bar" | "line" | "pie") => setLeftChartType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select chart type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="pie">Pie Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {renderChart(leftChartData, leftChartType)}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{eventType} Events (Right Range)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 space-y-4">
            <RangeSelector range={rightRange} setRange={setRightRange} />
            <Select value={rightChartType} onValueChange={(value: "bar" | "line" | "pie") => setRightChartType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select chart type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="pie">Pie Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {renderChart(rightChartData, rightChartType)}
        </CardContent>
      </Card>
    </div>
  )
}

export default CustomStatistics

