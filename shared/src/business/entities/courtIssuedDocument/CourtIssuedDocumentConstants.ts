import {
  FORMATS,
  calculateISODate,
  createISODateString,
  formatDateString,
} from '../../utilities/DateHandler';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { CourtIssuedDocumentTypeA } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentTypeA';
import { CourtIssuedDocumentTypeB } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentTypeB';
import { CourtIssuedDocumentTypeC } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentTypeC';
import { CourtIssuedDocumentTypeD } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentTypeD';
import { CourtIssuedDocumentTypeE } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentTypeE';
import { CourtIssuedDocumentTypeF } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentTypeF';
import { CourtIssuedDocumentTypeG } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentTypeG';
import { CourtIssuedDocumentTypeH } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentTypeH';

export abstract class CourtIssuedDocument extends JoiValidationEntity {
  public docketEntryId!: string;
  public attachments!: boolean;
  public documentTitle?: string;
  public generatedDocumentTitle?: string;
  public documentType!: string;
  public eventCode?: string;
  public filingDate?: string;
  public scenario?: string;
  public isLegacyServed?: boolean;

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

export type CourtIssuedDocumentAnyType = CourtIssuedDocument &
  Partial<CourtIssuedDocumentTypeA> &
  Partial<CourtIssuedDocumentTypeB> &
  Partial<CourtIssuedDocumentTypeC> &
  Partial<CourtIssuedDocumentTypeD> &
  Partial<CourtIssuedDocumentTypeE> &
  Partial<CourtIssuedDocumentTypeF> &
  Partial<CourtIssuedDocumentTypeG> &
  Partial<CourtIssuedDocumentTypeH>;
