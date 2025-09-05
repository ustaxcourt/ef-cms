import * as React from 'react';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { CalendarIcon } from 'lucide-react';

import { Button } from './DatePickerComponents/button';
import { Calendar } from './DatePickerComponents/calendar';
import { Input } from './DatePickerComponents/input';
import { Label } from './DatePickerComponents/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './DatePickerComponents/popover';

function formatDate(date: Date | undefined) {
  if (!date) {
    return '';
  }

  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

export function Calendar28() {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(
    calculateDate({ dateString: '2025-06-01' }),
  );
  const [month, setMonth] = React.useState<Date | undefined>(date);
  const [value, setValue] = React.useState(formatDate(date));

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1">
        Date
      </Label>
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={value}
          placeholder="June 01, 2025"
          className="bg-background pr-10"
          onChange={e => {
            const parsedDate = calculateDate({ dateString: e.target.value });
            setValue(e.target.value);
            if (isValidDate(parsedDate)) {
              setDate(parsedDate);
              setMonth(parsedDate);
            }
          }}
          onKeyDown={e => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={selectedDate => {
                setDate(selectedDate);
                setMonth(selectedDate);
                setValue(formatDate(selectedDate));
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
