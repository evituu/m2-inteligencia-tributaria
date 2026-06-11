"use client";

import { useState, useCallback, useMemo } from "react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { ChevronLeft, ChevronRight, CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const MONTHS_PT = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

type DateTimePickerProps = {
  value: string; // "YYYY-MM-DDTHH:MM" or ""
  onChange: (value: string) => void;
  placeholder?: string;
};

function parseDatetime(value: string) {
  if (!value) return { datePart: null as string | null, time: "00:00" };
  const t = value.indexOf("T");
  if (t === -1) return { datePart: value, time: "00:00" };
  return { datePart: value.slice(0, t), time: value.slice(t + 1, t + 6) };
}

function formatDisplay(value: string): string {
  const { datePart, time } = parseDatetime(value);
  if (!datePart) return "";
  const [y, m, d] = datePart.split("-");
  return `${d}/${m}/${y}  ${time}`;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Selecione uma data...",
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);

  const { datePart: selectedDate, time: selectedTime } = useMemo(
    () => parseDatetime(value),
    [value],
  );

  const now = new Date();
  const [viewYear, setViewYear] = useState(() => {
    if (selectedDate) return parseInt(selectedDate.slice(0, 4));
    return now.getFullYear();
  });
  const [viewMonth, setViewMonth] = useState(() => {
    if (selectedDate) return parseInt(selectedDate.slice(5, 7)) - 1;
    return now.getMonth();
  });

  const calendarDays = useMemo(() => {
    const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();
    const cells: { day: number; current: boolean }[] = [];

    for (let i = firstWeekday - 1; i >= 0; i--)
      cells.push({ day: daysInPrev - i, current: false });
    for (let d = 1; d <= daysInMonth; d++)
      cells.push({ day: d, current: true });
    while (cells.length < 42)
      cells.push({ day: cells.length - daysInMonth - firstWeekday + 1, current: false });

    return cells;
  }, [viewYear, viewMonth]);

  const isSelected = useCallback(
    (day: number) => {
      if (!selectedDate) return false;
      const [sy, sm, sd] = selectedDate.split("-").map(Number);
      return sy === viewYear && sm - 1 === viewMonth && sd === day;
    },
    [selectedDate, viewYear, viewMonth],
  );

  const isToday = useCallback(
    (day: number) =>
      now.getFullYear() === viewYear &&
      now.getMonth() === viewMonth &&
      now.getDate() === day,
    [viewYear, viewMonth],
  );

  function selectDay(day: number) {
    const m = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    onChange(`${viewYear}-${m}-${d}T${selectedTime}`);
  }

  function handleTimeChange(time: string) {
    if (selectedDate) {
      onChange(`${selectedDate}T${time}`);
    } else {
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, "0");
      const d = String(now.getDate()).padStart(2, "0");
      onChange(`${y}-${m}-${d}T${time}`);
    }
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-10 w-full items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm transition focus:outline-none focus:border-zinc-500",
            value ? "text-zinc-100" : "text-zinc-500",
          )}
        >
          <CalendarIcon className="h-4 w-4 shrink-0 text-zinc-400" />
          <span className="flex-1 text-left tabular-nums">
            {value ? formatDisplay(value) : placeholder}
          </span>
          {value ? (
            <span
              role="button"
              tabIndex={0}
              aria-label="Limpar data"
              onClick={(e) => { e.stopPropagation(); onChange(""); }}
              onKeyDown={(e) => e.key === "Enter" && onChange("")}
              className="rounded text-zinc-500 hover:text-zinc-200"
            >
              ×
            </span>
          ) : null}
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={6}
          className="z-50 w-72 rounded-xl border border-zinc-700 bg-[#060b12] p-4 shadow-2xl animate-in fade-in-0 zoom-in-95"
        >
          {/* Header: mês / ano */}
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={prevMonth}
              className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-semibold text-zinc-100">
              {MONTHS_PT[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Cabeçalho dos dias */}
          <div className="mb-1 grid grid-cols-7">
            {WEEKDAYS.map((wd) => (
              <div key={wd} className="text-center text-[10px] font-medium text-zinc-500">
                {wd}
              </div>
            ))}
          </div>

          {/* Grade de dias */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {calendarDays.map(({ day, current }, i) => {
              const sel = current && isSelected(day);
              const tod = current && isToday(day);
              return (
                <button
                  key={i}
                  type="button"
                  disabled={!current}
                  onClick={() => current && selectDay(day)}
                  className={cn(
                    "flex h-8 w-full items-center justify-center rounded-md text-xs transition",
                    !current && "cursor-default text-zinc-700",
                    current && !sel && !tod && "text-zinc-300 hover:bg-zinc-800",
                    tod && !sel && "font-semibold text-[#f2c40f]",
                    sel && "bg-[#f2c40f] font-semibold text-[#12151b] hover:bg-[#e3b80d]",
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Seletor de horário */}
          <div className="mt-3 flex items-center gap-3 border-t border-zinc-800 pt-3">
            <Clock className="h-4 w-4 shrink-0 text-zinc-400" />
            <span className="text-xs text-zinc-400">Horário</span>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="ml-auto h-8 w-28 rounded-md border border-zinc-700 bg-zinc-900 px-2 text-center text-sm text-zinc-100 outline-none focus:border-zinc-500 [color-scheme:dark]"
            />
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
