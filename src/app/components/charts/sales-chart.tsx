"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp } from "lucide-react"

interface SalesData {
    fecha: string
    total: number
}

export function SalesChart() {
    const [data, setData] = useState<SalesData[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/reportes/ventas-historico")
                if (res.ok) {
                    const result = await res.json()
                    // Formatear fecha para que se vea bonita en el eje X
                    const formattedData = result.map((item: any) => ({
                        ...item,
                        fecha: new Date(item.fecha).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })
                    }))
                    setData(formattedData)
                }
            } catch (error) {
                console.error("Error cargando gráfico de ventas", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    if (isLoading) {
        return <Skeleton className="h-[350px] w-full rounded-xl" />
    }

    // Calcular tendencia simple (último vs promedio)
    const totalVentas = data.reduce((acc, curr) => acc + curr.total, 0);
    const promedio = totalVentas / (data.length || 1);
    const ultimoDia = data[data.length - 1]?.total || 0;
    const tendencia = ultimoDia > promedio ? "positiva" : "estable";

    return (
        <Card className="col-span-4 lg:col-span-4 border-none shadow-lg overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-transparent pointer-events-none" />
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl font-bold">Ingresos Recientes</CardTitle>
                        <CardDescription>Comportamiento de ventas en los últimos días</CardDescription>
                    </div>
                    {tendencia === "positiva" && (
                        <div className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full text-xs font-medium">
                            <TrendingUp className="h-3 w-3" /> Tendencia al alza
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="fecha"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value / 1000}k`}
                                dx={-10}
                            />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/50" />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                                formatter={(value: number) => [`$${value.toLocaleString()}`, "Ventas"]}
                                labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '0.5rem' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke="hsl(var(--primary))"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorTotal)"
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}