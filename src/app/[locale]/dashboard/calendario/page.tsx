"use client"

import { useState, useMemo, useEffect } from "react"
import { AppSidebar } from "@/app/components/app-sidebar"
import { DashboardHeader } from "@/app/components/dashboard-header";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Calendar as CalendarIcon,
    Clock,
    MoreHorizontal,
    Trash2,
    Flag,
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import {
    format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval,
    isSameMonth, isSameDay, isToday, addWeeks, subWeeks, addDays, subDays, getYear, addYears, subYears, parseISO
} from "date-fns"
import { es } from "date-fns/locale"
import { getColombiaHolidays, isHoliday, Holiday } from "@/lib/colombia-holidays"

interface Evento {
    id: string
    titulo: string
    descripcion: string
    fecha: string // ISO string
    horaInicio: string
    horaFin: string
    tipo: string
    color: string
    textColor: string
}

type ViewType = 'month' | 'week' | 'day' | 'year'

const tiposEvento = [
    { value: "reunion", label: "Reunión", color: "bg-blue-500/20 border-l-4 border-blue-500", textColor: "text-blue-500" },
    { value: "entrega", label: "Entrega", color: "bg-emerald-500/20 border-l-4 border-emerald-500", textColor: "text-emerald-500" },
    { value: "pago", label: "Pago", color: "bg-red-500/20 border-l-4 border-red-500", textColor: "text-red-500" },
    { value: "otro", label: "Otro", color: "bg-purple-500/20 border-l-4 border-purple-500", textColor: "text-purple-500" },
]

export default function CalendarioPage() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [view, setView] = useState<ViewType>('month')
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [eventos, setEventos] = useState<Evento[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [holidays, setHolidays] = useState<Holiday[]>([])

    const [formData, setFormData] = useState({
        titulo: "",
        descripcion: "",
        horaInicio: "09:00",
        horaFin: "10:00",
        tipo: "reunion"
    })

    const fetchEventos = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/eventos")
            if (res.ok) setEventos(await res.json());
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        const year = getYear(currentDate);
        setHolidays(getColombiaHolidays(year));
        fetchEventos();
    }, [currentDate]);

    const navigate = (direction: 'prev' | 'next') => {
        switch (view) {
            case 'year':
                setCurrentDate(direction === 'prev' ? subYears(currentDate, 1) : addYears(currentDate, 1))
                break
            case 'month':
                setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1))
                break
            case 'week':
                setCurrentDate(direction === 'prev' ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1))
                break
            case 'day':
                const newDate = direction === 'prev' ? subDays(currentDate, 1) : addDays(currentDate, 1)
                setCurrentDate(newDate)
                setSelectedDate(newDate)
                break
        }
    }

    const goToToday = () => {
        const today = new Date()
        setCurrentDate(today)
        setSelectedDate(today)
    }

    const calendarDays = useMemo(() => {
        if (view === 'month') {
            const monthStart = startOfMonth(currentDate)
            const monthEnd = endOfMonth(monthStart)
            const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
            const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })
            return eachDayOfInterval({ start: startDate, end: endDate })
        } else if (view === 'week') {
            const start = startOfWeek(currentDate, { weekStartsOn: 1 })
            const end = endOfWeek(currentDate, { weekStartsOn: 1 })
            return eachDayOfInterval({ start, end })
        }
        return [currentDate]
    }, [currentDate, view])

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault()
        const tipoObj = tiposEvento.find(t => t.value === formData.tipo)

        const nuevoEvento = {
            titulo: formData.titulo,
            descripcion: formData.descripcion,
            fecha: format(selectedDate, 'yyyy-MM-dd'),
            horaInicio: formData.horaInicio,
            horaFin: formData.horaFin,
            tipo: formData.tipo,
            color: tipoObj?.color,
            textColor: tipoObj?.textColor
        }

        try {
            const res = await fetch("http://localhost:8080/api/eventos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoEvento)
            })
            if (res.ok) {
                toast.success("Evento creado")
                setIsModalOpen(false)
                setFormData({ titulo: "", descripcion: "", horaInicio: "09:00", horaFin: "10:00", tipo: "reunion" })
                fetchEventos()
            }
        } catch (error) {
            toast.error("Error al crear evento")
        }
    }

    const handleDeleteEvent = async (id: string) => {
        try {
            const res = await fetch(`http://localhost:8080/api/eventos/${id}`, { method: "DELETE" })
            if (res.ok) {
                toast.success("Evento eliminado")
                fetchEventos()
            }
        } catch (error) {
            toast.error("Error al eliminar evento")
        }
    }

    const eventosDelDia = eventos.filter(e => isSameDay(parseISO(e.fecha), selectedDate))
    const festivoDelDia = isHoliday(selectedDate, holidays);

    const getTitle = () => {
        if (view === 'year') return format(currentDate, 'yyyy');
        if (view === 'day') return format(currentDate, 'd MMMM yyyy', { locale: es });
        if (view === 'week') {
            const start = startOfWeek(currentDate, { weekStartsOn: 1 });
            const end = endOfWeek(currentDate, { weekStartsOn: 1 });
            return `${format(start, 'd MMM')} - ${format(end, 'd MMM yyyy', { locale: es })}`;
        }
        return format(currentDate, 'MMMM yyyy', { locale: es });
    }

    const MiniMonth = ({ monthIndex }: { monthIndex: number }) => {
        const monthDate = new Date(getYear(currentDate), monthIndex, 1);
        const monthStart = startOfMonth(monthDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
        const days = eachDayOfInterval({ start: startDate, end: endDate });

        return (
            <div className="bg-card border rounded-lg p-3 hover:shadow-md transition-shadow">
                <h3 className="text-sm font-bold text-center mb-2 capitalize">
                    {format(monthDate, 'MMMM', { locale: es })}
                </h3>
                <div className="grid grid-cols-7 gap-0.5">
                    {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
                        <div key={d} className="text-[9px] text-center text-muted-foreground font-medium p-0.5">{d}</div>
                    ))}
                    {days.map(day => {
                        const dayEvents = eventos.filter(e => isSameDay(parseISO(e.fecha), day));
                        const holiday = isHoliday(day, holidays);
                        const isCurrentMonth = isSameMonth(day, monthDate);

                        return (
                            <button
                                key={day.toString()}
                                onClick={() => {
                                    setSelectedDate(day);
                                    setView('day');
                                    setCurrentDate(day);
                                }}
                                className={`
                                    text-[10px] aspect-square flex items-center justify-center rounded-sm transition-all
                                    ${!isCurrentMonth ? 'text-muted-foreground/30' : ''}
                                    ${isToday(day) ? 'bg-primary text-primary-foreground font-bold' : ''}
                                    ${holiday && isCurrentMonth ? 'text-amber-600 font-bold' : ''}
                                    ${dayEvents.length > 0 && isCurrentMonth ? 'bg-blue-500/20' : ''}
                                    ${isCurrentMonth && !isToday(day) ? 'hover:bg-accent' : ''}
                                `}
                            >
                                {format(day, 'd')}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="dark min-h-screen bg-background">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <DashboardHeader pageTitle="Calendario" />

                    <div className="flex flex-col lg:flex-row flex-1 h-[calc(100vh-4rem)] overflow-hidden">

                        <div className="flex-1 flex flex-col p-4 lg:p-6 overflow-auto">

                            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">

                                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                                    <h1 className="text-2xl font-bold capitalize min-w-[200px]">
                                        {getTitle()}
                                    </h1>

                                    <div className="flex items-center bg-card border rounded-md shadow-sm">
                                        <Button variant="ghost" size="icon" onClick={() => navigate('prev')} className="h-8 w-8 rounded-l-md hover:bg-muted">
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <div className="h-4 w-[1px] bg-border"></div>
                                        <Button variant="ghost" size="sm" onClick={goToToday} className="h-8 px-3 font-medium hover:bg-muted">
                                            Hoy
                                        </Button>
                                        <div className="h-4 w-[1px] bg-border"></div>
                                        <Button variant="ghost" size="icon" onClick={() => navigate('next')} className="h-8 w-8 rounded-r-md hover:bg-muted">
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <Select value={view} onValueChange={(v: any) => setView(v)}>
                                        <SelectTrigger className="w-[120px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="year">Año</SelectItem>
                                            <SelectItem value="month">Mes</SelectItem>
                                            <SelectItem value="week">Semana</SelectItem>
                                            <SelectItem value="day">Día</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                                        <DialogTrigger asChild>
                                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md">
                                                <Plus className="mr-2 h-4 w-4" /> Evento
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Nuevo Evento</DialogTitle>
                                                <DialogDescription>Agendar para el {format(selectedDate, 'd MMMM', { locale: es })}</DialogDescription>
                                            </DialogHeader>
                                            <form onSubmit={handleCreateEvent} className="space-y-4 py-2">
                                                <div className="space-y-2">
                                                    <Label>Título</Label>
                                                    <Input required value={formData.titulo} onChange={e => setFormData({ ...formData, titulo: e.target.value })} placeholder="Reunión..." />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2"><Label>Inicio</Label><Input type="time" required value={formData.horaInicio} onChange={e => setFormData({ ...formData, horaInicio: e.target.value })} /></div>
                                                    <div className="space-y-2"><Label>Fin</Label><Input type="time" required value={formData.horaFin} onChange={e => setFormData({ ...formData, horaFin: e.target.value })} /></div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Tipo</Label>
                                                    <Select value={formData.tipo} onValueChange={(val) => setFormData({ ...formData, tipo: val })}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            {tiposEvento.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2"><Label>Notas</Label><Textarea value={formData.descripcion} onChange={e => setFormData({ ...formData, descripcion: e.target.value })} /></div>
                                                <DialogFooter><Button type="submit">Guardar</Button></DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>

                            <div className="flex-1 bg-card rounded-xl border shadow-sm overflow-hidden flex flex-col min-h-[500px]">

                                {view === 'year' ? (
                                    <div className="p-6 overflow-auto">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                            {Array.from({ length: 12 }, (_, i) => (
                                                <MiniMonth key={i} monthIndex={i} />
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {view !== 'day' && (
                                            <div className="grid grid-cols-7 bg-muted/40 border-b">
                                                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                                                    <div key={day} className="p-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                                        {day}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className={`flex-1 ${view === 'day' ? 'p-4' : 'grid grid-cols-7 auto-rows-fr'}`}>

                                            {view === 'day' ? (
                                                <div className="space-y-2 h-full">
                                                    {festivoDelDia && (
                                                        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-3 text-amber-600 dark:text-amber-400">
                                                            <Flag className="h-5 w-5" />
                                                            <div>
                                                                <p className="font-bold text-sm">Día Festivo: {festivoDelDia.name}</p>
                                                                <p className="text-xs opacity-80">Colombia</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {eventos.filter(e => isSameDay(parseISO(e.fecha), currentDate)).length === 0 ? (
                                                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
                                                            <CalendarIcon className="h-16 w-16 mb-2" />
                                                            <p>No hay eventos para hoy</p>
                                                        </div>
                                                    ) : (
                                                        eventos.filter(e => isSameDay(parseISO(e.fecha), currentDate)).map(event => (
                                                            <div key={event.id} className={`p-4 rounded-lg border ${event.color} mb-2 flex justify-between items-center`}>
                                                                <div>
                                                                    <h3 className={`font-bold ${event.textColor}`}>{event.titulo}</h3>
                                                                    <p className="text-sm opacity-80">{event.horaInicio} - {event.horaFin}</p>
                                                                    <p className="text-sm mt-1">{event.descripcion}</p>
                                                                </div>
                                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteEvent(event.id)}>
                                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                                </Button>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            ) : (
                                                calendarDays.map((day) => {
                                                    const dayEvents = eventos.filter(e => isSameDay(parseISO(e.fecha), day))
                                                    const isCurrentMonth = isSameMonth(day, currentDate)
                                                    const isSelected = isSameDay(day, selectedDate)
                                                    const holiday = isHoliday(day, holidays)

                                                    return (
                                                        <div
                                                            key={day.toString()}
                                                            onClick={() => setSelectedDate(day)}
                                                            className={`
                            relative min-h-[80px] p-2 border-b border-r transition-all cursor-pointer
                            ${!isCurrentMonth ? 'bg-muted/20 text-muted-foreground' : 'bg-card'}
                            ${isSelected ? 'bg-primary/5 ring-1 ring-inset ring-primary z-10' : 'hover:bg-accent/30'}
                            ${holiday ? 'bg-amber-500/5' : ''}
                            `}
                                                        >
                                                            <div className="flex justify-between items-start mb-1">
                                                                <span className={`
                                    text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full
                                    ${isToday(day) ? 'bg-primary text-primary-foreground shadow-sm' : holiday ? 'text-amber-600 font-bold' : 'text-muted-foreground'}
                                `}>
                                                                    {format(day, 'd')}
                                                                </span>
                                                                {holiday && (
                                                                    <span className="text-[8px] font-medium text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-1 rounded truncate max-w-[60%] text-right" title={holiday.name}>
                                                                        {holiday.name}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <div className="space-y-1 overflow-hidden">
                                                                {dayEvents.slice(0, 4).map(event => (
                                                                    <div
                                                                        key={event.id}
                                                                        className={`
                                    text-[10px] px-1.5 py-0.5 rounded-sm truncate font-medium border-l-2
                                    ${event.color} ${event.textColor}
                                `}
                                                                        title={event.titulo}
                                                                    >
                                                                        {event.titulo}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="w-full lg:w-80 border-l bg-muted/10 p-4 lg:p-6 overflow-y-auto">
                            <div className="mb-6">
                                <h2 className="text-lg font-bold flex items-center gap-2 mb-1 text-foreground">
                                    {format(selectedDate, 'EEEE, d', { locale: es })}
                                    <span className="text-muted-foreground font-normal text-base capitalize">
                                        de {format(selectedDate, 'MMMM', { locale: es })}
                                    </span>
                                </h2>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                    {eventosDelDia.length} Eventos Programados
                                </p>
                            </div>

                            <div className="space-y-3">
                                {eventosDelDia.map(evento => (
                                    <Card key={evento.id} className={`group hover:shadow-md transition-all border-l-4 overflow-hidden ${evento.color}`}>
                                        <CardContent className="p-3">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className={`font-semibold text-sm line-clamp-1 ${evento.textColor}`}>{evento.titulo}</h3>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleDeleteEvent(evento.id)} className="text-destructive">
                                                            <Trash2 className="mr-2 h-3 w-3" /> Eliminar
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                                <Clock className="h-3 w-3" />
                                                <span>{evento.horaInicio} - {evento.horaFin}</span>
                                            </div>

                                            {evento.descripcion && (
                                                <p className="text-xs text-muted-foreground/80 line-clamp-2 bg-muted/50 p-1.5 rounded">
                                                    {evento.descripcion}
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}

                                {eventosDelDia.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
                                        <div className="bg-muted/50 p-3 rounded-full mb-3">
                                            <CalendarIcon className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm font-medium text-foreground">Nada programado</p>
                                        <p className="text-xs text-muted-foreground mb-3">Disfruta tu tiempo libre</p>
                                        <Button variant="outline" size="sm" className="text-xs" onClick={() => setIsModalOpen(true)}>
                                            <Plus className="h-3 w-3 mr-1" /> Crear Evento
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}
