import {
  prepareDateFromString,
  FORMATS,
} from '@shared/business/utilities/DateHandler';

export const getColumnTextFields = (dataTestId: string) => {
  return cy.get(`[data-testid^="${dataTestId}"]`).then($cells => {
    return $cells.toArray().map(cell => cell.innerText);
  });
};

export const sortFiledDateColumnAsc = (a: string, b: string) => {
  const dateA = prepareDateFromString(a, FORMATS.MMDDYYYY).toMillis();
  const dateB = prepareDateFromString(b, FORMATS.MMDDYYYY).toMillis();
  return dateA - dateB;
};
