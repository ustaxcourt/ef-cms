import {
  formatDateString,
  getIsoFromJsDate,
} from '@shared/business/utilities/DateHandler';
import { TRIAL_CITY_STRINGS } from '@shared/business/entities/EntityConstants';

export const formatJudgeName = (name: string | undefined): string => {
  return (
    name
      ?.replace('Chief Special Trial ', '')
      .replace('Special Trial ', '')
      .replace('Judge ', '') ?? ''
  );
};

export const formatCaseCaption = (caption: string | undefined): string => {
  if (!caption) return '';
  return caption.replace(/\r\n|\r|\n/g, ' ').trim();
};

export const alphabetizeCities = (
  cities: string[] = TRIAL_CITY_STRINGS,
): string[] => {
  if (!cities || cities.length === 0) return [];

  return cities.slice().sort((a, b) => {
    const [aCity, aState] = a.split(', ');
    const [bCity, bState] = b.split(', ');

    if (aState !== bState) {
      if (!aState) return 1;
      if (!bState) return -1;
      return aState.localeCompare(bState);
    }
    return (aCity || '').localeCompare(bCity || '');
  });
};

export const formatDate = (date: string | Date | undefined): string => {
  if (!date) return '';
  const isoDate = typeof date === 'string' ? date : getIsoFromJsDate(date);
  if (!isoDate) return '';
  return formatDateString(isoDate, 'YYYYMMDD');
};

export const formatCurrency = (amount: number | string | undefined): string => {
  if (!amount) return '0';
  const numericAmount =
    typeof amount === 'string' ? parseFloat(amount) : amount;
  return numericAmount.toFixed(2);
};
