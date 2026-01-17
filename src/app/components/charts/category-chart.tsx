"use client"

import { useEffect, useState } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// Paleta de colores dinámica para las categorías
const COLORS = [
    "#e11d48", // Rose
    "#2563eb", // Blue
    "#16a34a", // Green
    "#d97706", // Amber
    "#9333ea", // Purple
    "#0891b2", // Cyan
    "#ea580c"  // Orange
]

export function CategoryChart() {
    const [data, setData] = useState<{ name: string, value: number }[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetch("http://localhost:8080/api/reportes/categorias-distribucion")
            .then(res => res.ok ? res.json() : [])
            .then(setData)
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false))
    }, [])

    if (isLoading) return <Skeleton className="h-[350px] col-span-3 rounded-xl" />

    if (data.length === 0) {
        return (
            <Card className="col-span-4 md:col-span-3 flex flex-col items-center justify-center h-[350px]">
                <p className="text-muted-foreground">No hay datos de categorías disponibles.</p>
            </Card>
        )
    }

    return (
        <Card className="col-span-4 md:col-span-3 flex flex-col border-none shadow-lg overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-transparent pointer-events-none" />
            <CardHeader className="items-center pb-0 relative z-10">
                <CardTitle className="text-lg font-bold">Inventario por Categoría</CardTitle>
                <CardDescription>Distribución actual del stock</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0 relative z-10">
                <div className="h-[250px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={85}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="hsl(var(--background))"
                                strokeWidth={2}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                        className="hover:opacity-80 transition-opacity cursor-pointer"
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                formatter={(value) => <span className="text-xs text-muted-foreground ml-1">{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}