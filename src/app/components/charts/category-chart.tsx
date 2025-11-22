"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Datos simulados
const data = [
    { name: "Electrónicos", value: 45, color: "#3b82f6" }, // blue-500
    { name: "Ropa", value: 30, color: "#ec4899" }, // pink-500
    { name: "Hogar", value: 15, color: "#10b981" }, // emerald-500
    { name: "Juguetes", value: 10, color: "#f59e0b" }, // amber-500
]

export function CategoryChart() {
    return (
        <Card className="col-span-4 md:col-span-1">
            <CardHeader>
                <CardTitle>Distribución por Categoría</CardTitle>
                <CardDescription>
                    Inventario actual por tipo
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="hsl(var(--card))" strokeWidth={2} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}