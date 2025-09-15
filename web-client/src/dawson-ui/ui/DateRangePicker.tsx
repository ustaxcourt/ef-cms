import * as React from 'react';
import { DateRange } from 'react-day-picker';

import { Button } from '@web-client/dawson-ui/ui/button';
import { Calendar } from '@web-client/dawson-ui/ui/calendar';
import { Label } from '@web-client/dawson-ui/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@web-client/dawson-ui/ui/popover';
import { applicationContext } from '@web-client/applicationContext';

interface DateRangePickerProps {
  startValue?: string;
  endValue?: string;
  startLabel?: string | React.ReactNode;
  endLabel?: string | React.ReactNode;
  startName?: string;
  endName?: string;
  startDateErrorText?: string;
  endDateErrorText?: string;
  maxDate?: string;
  minDate?: string;
  showDateHint?: boolean;
  onChangeStart?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeEnd?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlurStart?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlurEnd?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  startPickerCls?: string;
  endPickerCls?: string;
  rangePickerCls?: string;
  formGroupCls?: string;
  formGroupStartCls?: string;
  formGroupEndCls?: string;
  omitFormGroupClass?: boolean;
  parentModalHasMounted?: boolean;
}

export function DateRangePicker({
  startValue,
  endValue,
  startLabel = 'Start date',
  endLabel: _endLabel = 'End date',
  startName = 'startDate',
  endName = 'endDate',
  startDateErrorText,
  endDateErrorText,
  maxDate: _maxDate,
  minDate: _minDate,
  showDateHint = false,
  onChangeStart,
  onChangeEnd,
  onBlurStart: _onBlurStart,
  onBlurEnd: _onBlurEnd,
  className,
  startPickerCls,
  endPickerCls: _endPickerCls,
  rangePickerCls,
  formGroupCls: _formGroupCls,
  formGroupStartCls: _formGroupStartCls,
  formGroupEndCls: _formGroupEndCls,
  omitFormGroupClass: _omitFormGroupClass = false,
  parentModalHasMounted: _parentModalHasMounted = false,
}: Readonly<DateRangePickerProps>) {
  const [open, setOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    undefined,
  );

  // Helper function to parse MM/DD/YYYY without timezone conversion
  const parseDateSimple = (dateString: string) => {
    if (!dateString) return undefined;
    const [month, day, year] = dateString.split('/');
    if (month && day && year) {
      // Create date in local timezone - no conversion
      const DateConstructor = Date;
      return new DateConstructor(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
      );
    }
    return undefined;
  };

  // Convert string dates to Date objects for the calendar
  React.useEffect(() => {
    if (startValue && endValue) {
      setDateRange({
        from: parseDateSimple(startValue),
        to: parseDateSimple(endValue),
      });
    } else if (startValue) {
      setDateRange({
        from: parseDateSimple(startValue),
        to: undefined,
      });
    } else {
      setDateRange(undefined);
    }
  }, [startValue, endValue]);

  const createChangeEvent = (name: string, value: string) =>
    ({
      target: { name, value },
    }) as React.ChangeEvent<HTMLInputElement>;

  // Helper function to format date in MM/DD/YYYY format (as expected by the system)
  const formatDateForForm = (date: Date) => {
    // Use local date components to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}/${day}/${year}`;
  };

  const formatDateForDisplay = (dateString?: string) => {
    if (!dateString) return '';
    const date = parseDateSimple(dateString);
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDisplayText = () => {
    if (startValue && endValue) {
      return `${formatDateForDisplay(startValue)} - ${formatDateForDisplay(endValue)}`;
    } else if (startValue) {
      return `${formatDateForDisplay(startValue)} - Click to select different end date`;
    }
    return 'Click to select start date';
  };

  const getInstructionText = () => {
    if (!startValue) {
      return 'Click a date to select start date';
    }
    if (!endValue) {
      return 'Click a different date to select end date (must be after start date)';
    }
    return 'Date range selected';
  };

  return (
    <div className={`tw:flex tw:flex-col tw:gap-3 ${className || ''}`}>
      <Popover open={open} onOpenChange={setOpen}>
        <div className={`tw:flex tw:gap-3 ${rangePickerCls || ''}`}>
          {/* Start Date Picker */}
          <div
            className={`tw:flex tw:flex-col tw:gap-2 ${startPickerCls || ''}`}
          >
            <Label htmlFor={startName} className="tw:px-1">
              {startLabel}
              {showDateHint && (
                <span className="tw:text-sm tw:text-gray-500">
                  {' '}
                  (MM/DD/YYYY)
                </span>
              )}
            </Label>
            <PopoverTrigger asChild>
              <Button
                variant="secondary"
                id={startName}
                className="tw:w-full md:tw:w-[20rem] lg:tw:w-[24rem] tw:justify-start tw:font-normal tw:hover:bg-gray-50 tw:hover:border-gray-300 tw:transition-colors tw:duration-150 tw:text-left tw:min-h-[2.5rem]"
              >
                <span className="tw:text-gray-700">{getDisplayText()}</span>
              </Button>
            </PopoverTrigger>
            {(startDateErrorText || endDateErrorText) && (
              <span className="tw:text-red-500 tw:text-sm">
                {startDateErrorText || endDateErrorText}
              </span>
            )}
          </div>
        </div>

        <PopoverContent
          className="tw:w-auto tw:h-auto tw:overflow-hidden tw:p-0 tw:bg-white"
          align="start"
        >
          <div className="tw:px-3 tw:py-2 tw:bg-gray-50 tw:border-b tw:border-gray-200 tw:flex tw:justify-between tw:items-center">
            <p className="tw:text-sm tw:text-gray-600">
              {getInstructionText()}
            </p>
            {(startValue || endValue) && (
              <button
                onClick={() => {
                  setDateRange(undefined);
                  setOpen(false);
                  onChangeStart?.(createChangeEvent(startName, ''));
                  onChangeEnd?.(createChangeEvent(endName, ''));
                }}
                className="tw:text-xs tw:text-blue-600 tw:hover:text-blue-800 tw:underline"
              >
                Clear
              </button>
            )}
          </div>
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            numberOfMonths={2}
            selected={dateRange}
            captionLayout="label"
            showOutsideDays={true}
            className="tw:bg-white"
            onSelect={selectedRange => {
              if (!selectedRange) return;

              // If we have both from and to, it's a complete selection
              if (selectedRange.from && selectedRange.to) {
                // Only set as complete range if they are different dates
                if (
                  selectedRange.from.getTime() !== selectedRange.to.getTime()
                ) {
                  setDateRange(selectedRange);
                  onChangeStart?.(
                    createChangeEvent(
                      startName,
                      formatDateForForm(selectedRange.from),
                    ),
                  );
                  onChangeEnd?.(
                    createChangeEvent(
                      endName,
                      formatDateForForm(selectedRange.to),
                    ),
                  );
                  setOpen(false);
                } else {
                  // Same date selected - treat as start date only and clear end date
                  setDateRange({ from: selectedRange.from, to: undefined });
                  onChangeStart?.(
                    createChangeEvent(
                      startName,
                      formatDateForForm(selectedRange.from),
                    ),
                  );
                  onChangeEnd?.(createChangeEvent(endName, ''));
                }
              }
              // If we only have from, it's the start date selection
              else if (selectedRange.from && !selectedRange.to) {
                setDateRange({ from: selectedRange.from, to: undefined });
                onChangeStart?.(
                  createChangeEvent(
                    startName,
                    formatDateForForm(selectedRange.from),
                  ),
                );
                // Clear end date when selecting a new start date
                onChangeEnd?.(createChangeEvent(endName, ''));
              }
            }}
            disabled={[
              // Disable future dates (after today)
              {
                after: applicationContext
                  .getUtilities()
                  .prepareDateFromString(
                    applicationContext.getUtilities().createISODateString(),
                  )
                  .toJSDate(),
              },
            ]}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

DateRangePicker.displayName = 'DateRangePicker';
