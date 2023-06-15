import {
  FORMATS,
  calculateISODate,
  createISODateString,
  formatDateString,
} from '../../utilities/DateHandler';
import { JoiValidationEntity } from '../JoiValidationEntity';

export abstract class CourtIssuedDocument extends JoiValidationEntity {
  public attachments!: boolean;
  public documentTitle?: string;
  public documentType!: string;
  public eventCode?: string;
  public filingDate?: string;

  abstract getDocumentTitle(): string;
}

/**
 * these are in a separate file from the entity so they can be used
 * in each of the sub-types without a circular dependency
 */
export const VALIDATION_ERROR_MESSAGES = {
  attachments: 'Enter selection for Attachments',
  date: [
    {
      contains: 'must be greater than or equal to',
      message: 'Enter a valid date',
    },
    {
      contains: 'must be less than or equal to',
      message: 'Enter a valid date',
    },
    'Enter a date',
  ],
  docketNumbers: [
    { contains: 'is required', message: 'Enter docket number(s)' },
    {
      contains: 'must be less than or equal to',
      message: 'Limit is 500 characters. Enter 500 or fewer characters.',
    },
  ],
  documentType: 'Select a document type',
  filingDate: 'Enter a filing date',
  freeText: [
    { contains: 'is required', message: 'Enter a description' },
    {
      contains: 'must be less than or equal to',
      message: 'Limit is 1000 characters. Enter 1000 or fewer characters.',
    },
  ],
  judge: 'Select a judge',
  serviceStamp: 'Select a service stamp',
  trialLocation: 'Select a trial location',
} as const;

export const ENTERED_AND_SERVED_EVENT_CODES = [
  'ODJ',
  'OD',
  'ODD',
  'OAD',
  'DEC',
  'SDEC',
];

export const GENERIC_ORDER_DOCUMENT_TYPE = 'Order';
export const REPORT_PAMPHLET_DOCUMENT_TYPE = 'Tax Court Report Pamphlet';

export const DOCUMENT_TYPES_REQUIRING_DESCRIPTION = [
  GENERIC_ORDER_DOCUMENT_TYPE,
  REPORT_PAMPHLET_DOCUMENT_TYPE,
];

export const SERVICE_STAMP_OPTIONS = ['Served', 'Entered and Served'];

export const yesterdayISO = calculateISODate({ howMuch: -1, units: 'days' });
export const yesterdayFormatted = formatDateString(
  createISODateString(yesterdayISO),
  FORMATS.MMDDYYYY,
);
