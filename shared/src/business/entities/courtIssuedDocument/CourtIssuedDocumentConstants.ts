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
