import * as React from 'react';
import { DateRange } from 'react-day-picker';
import { Button } from '@web-client/dawson-ui/ui/button';
import { Calendar } from '@web-client/dawson-ui/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@web-client/dawson-ui/ui/popover';

export function Calendar28() {
  const [open, setOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    undefined,
  );
  const [hoveredDate, setHoveredDate] = React.useState<Date | undefined>(
    undefined,
  );

  return (
    <div className="tw:flex tw:flex-col tw:gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <div className="tw:flex tw:gap-3">
          <div className="tw:flex tw:flex-col tw:gap-2">
            <h2 className="margin-bottom-0">
              Date <span className="text-base-dark tw:text-sm">(optional)</span>
            </h2>
            <PopoverTrigger asChild>
              <Button
                variant="secondary"
                id="start-date"
                className="tw:w-48 tw:font-normal tw:hover:bg-gray-50 tw:hover:border-gray-300 tw:transition-colors tw:duration-150 tw:text-gray-500 tw:text-left"
              >
                <span className="tw:text-gray-500">
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
                    : 'Select Date'}
                </span>
              </Button>
            </PopoverTrigger>
          </div>
        </div>

        <PopoverContent
          className="tw:w-auto tw:h-auto tw:overflow-hidden tw:p-0"
          align="start"
        >
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            numberOfMonths={2}
            selected={dateRange}
            captionLayout="label"
            showOutsideDays={true}
            onSelect={selectedRange => {
              setDateRange(selectedRange);
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
