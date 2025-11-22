import { addDays, isSameDay } from "date-fns";

// Función auxiliar para calcular la fecha de Pascua (Domingo de Resurrección)
function getEasterDate(year: number): Date {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-based month
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month, day);
}

// Función para mover al siguiente lunes si no es lunes
function moveToNextMonday(date: Date): Date {
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ...
    if (dayOfWeek === 1) return date; // Ya es lunes
    const daysToAdd = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    return addDays(date, daysToAdd);
}

export interface Holiday {
    date: Date;
    name: string;
    type: 'fijo' | 'puente' | 'semana-santa';
}

export function getColombiaHolidays(year: number): Holiday[] {
    const holidays: Holiday[] = [];

    // 1. Festivos Fijos (Misma fecha siempre)
    holidays.push({ date: new Date(year, 0, 1), name: "Año Nuevo", type: 'fijo' });
    holidays.push({ date: new Date(year, 4, 1), name: "Día del Trabajo", type: 'fijo' });
    holidays.push({ date: new Date(year, 6, 20), name: "Día de la Independencia", type: 'fijo' });
    holidays.push({ date: new Date(year, 7, 7), name: "Batalla de Boyacá", type: 'fijo' });
    holidays.push({ date: new Date(year, 11, 8), name: "Inmaculada Concepción", type: 'fijo' });
    holidays.push({ date: new Date(year, 11, 25), name: "Navidad", type: 'fijo' });

    // 2. Festivos que se mueven al lunes (Ley Emiliani)
    holidays.push({ date: moveToNextMonday(new Date(year, 0, 6)), name: "Reyes Magos", type: 'puente' });
    holidays.push({ date: moveToNextMonday(new Date(year, 2, 19)), name: "San José", type: 'puente' });
    holidays.push({ date: moveToNextMonday(new Date(year, 5, 29)), name: "San Pedro y San Pablo", type: 'puente' });
    holidays.push({ date: moveToNextMonday(new Date(year, 7, 15)), name: "Asunción de la Virgen", type: 'puente' });
    holidays.push({ date: moveToNextMonday(new Date(year, 9, 12)), name: "Día de la Raza", type: 'puente' });
    holidays.push({ date: moveToNextMonday(new Date(year, 10, 1)), name: "Todos los Santos", type: 'puente' });
    holidays.push({ date: moveToNextMonday(new Date(year, 10, 11)), name: "Independencia de Cartagena", type: 'puente' });

    // 3. Basados en Pascua (Semana Santa y otros)
    const easter = getEasterDate(year);

    // Jueves Santo (-3 días)
    holidays.push({ date: addDays(easter, -3), name: "Jueves Santo", type: 'semana-santa' });
    // Viernes Santo (-2 días)
    holidays.push({ date: addDays(easter, -2), name: "Viernes Santo", type: 'semana-santa' });
    // Ascensión del Señor (+43 días -> lunes)
    holidays.push({ date: moveToNextMonday(addDays(easter, 39)), name: "Ascensión del Señor", type: 'puente' });
    // Corpus Christi (+64 días -> lunes)
    holidays.push({ date: moveToNextMonday(addDays(easter, 60)), name: "Corpus Christi", type: 'puente' });
    // Sagrado Corazón (+71 días -> lunes)
    holidays.push({ date: moveToNextMonday(addDays(easter, 68)), name: "Sagrado Corazón", type: 'puente' });

    return holidays;
}

export function isHoliday(date: Date, holidays: Holiday[]): Holiday | undefined {
    return holidays.find(h => isSameDay(h.date, date));
}