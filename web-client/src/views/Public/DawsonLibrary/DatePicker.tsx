import * as React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { Button } from '../../../dawson-ui/ui/button';
import { Calendar } from '../../../dawson-ui/ui/calendar';
import { Label } from '../../../dawson-ui/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../dawson-ui/ui/popover';

export function Calendar28() {
  const [open, setOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    undefined,
  );
  const [hoveredDate, setHoveredDate] = React.useState<Date | undefined>(
    undefined,
  );

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <div className="flex gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="start-date" className="px-1">
              Date (optional)
            </Label>
            <PopoverTrigger asChild>
              <Button
                variant="secondary"
                id="start-date"
                className="w-48 justify-between font-normal hover:bg-gray-50 hover:border-gray-300 transition-colors duration-150"
              >
                {dateRange?.from
                  ? dateRange.from.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    }) +
                    ' - ' +
                    dateRange?.to?.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Select date'}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
          </div>
        </div>

        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            numberOfMonths={2}
            selected={dateRange}
            captionLayout="dropdown"
            showOutsideDays={false}
            onSelect={selectedRange => {
              setDateRange(selectedRange);
              // Only close when both start and end dates are selected AND they are different
              if (
                selectedRange?.from &&
                selectedRange?.to &&
                selectedRange.from.getTime() !== selectedRange.to.getTime()
              ) {
                setOpen(false);
              }
            }}
            modifiers={{
              hover: date => {
                if (!hoveredDate || !dateRange?.from || dateRange?.to)
                  return false;

                const start = dateRange.from;
                const end = hoveredDate;
                const from = start < end ? start : end;
                const to = start < end ? end : start;

                return date >= from && date <= to;
              },
            }}
            modifiersClassNames={{
              hover: 'tw:bg-gray-200 tw:text-gray-800',
            }}
            onDayMouseEnter={day => {
              if (dateRange?.from && !dateRange?.to) {
                console.log(
                  'Hovering over:',
                  day,
                  'Start date:',
                  dateRange.from,
                );
                setHoveredDate(day);
              }
            }}
            onDayMouseLeave={() => {
              setHoveredDate(undefined);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
