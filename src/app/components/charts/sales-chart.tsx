"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Datos simulados (en un futuro, esto vendría de tu endpoint /api/reportes/ventas-historico)
const data = [
    { name: "Lun", total: 150000 },
    { name: "Mar", total: 230000 },
    { name: "Mié", total: 180000 },
    { name: "Jue", total: 320000 },
    { name: "Vie", total: 290000 },
    { name: "Sáb", total: 450000 },
    { name: "Dom", total: 210000 },
]

export function SalesChart() {
    return (
        <Card className="col-span-4 md:col-span-2">
            <CardHeader>
                <CardTitle>Resumen de Ingresos</CardTitle>
                <CardDescription>
                    Comportamiento de ventas de los últimos 7 días
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value / 1000}k`}
                            />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                                formatter={(value: number) => [`$${value.toLocaleString()}`, "Ventas"]}
                            />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorTotal)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}