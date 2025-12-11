import {
  FORMATS,
  calculateISODate,
  createISODateString,
  formatDateString,
} from '../../utilities/DateHandler';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { RawCourtIssuedDocumentTypeA } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentTypeA';
import { RawCourtIssuedDocumentTypeB } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentTypeB';
import { RawCourtIssuedDocumentTypeC } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentTypeC';
import { RawCourtIssuedDocumentTypeD } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentTypeD';
import { RawCourtIssuedDocumentTypeE } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentTypeE';
import { RawCourtIssuedDocumentTypeF } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentTypeF';
import { RawCourtIssuedDocumentTypeG } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentTypeG';
import { RawCourtIssuedDocumentTypeH } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentTypeH';
import {
  DocketEntryRelation,
  UNSERVABLE_EVENT_CODES,
} from '../EntityConstants';
import { JoiValidationConstants } from '../JoiValidationConstants';
import joi from 'joi';

export abstract class CourtIssuedDocument extends JoiValidationEntity {
  public affectedDocketEntries?: Array<DocketEntryRelation>;
  public docketEntryId!: string;
  public attachments!: boolean;
  public documentTitle!: string;
  public generatedDocumentTitle?: string;
  public documentType!: string;
  public eventCode!: string;
  public filingDate?: string;
  public scenario?: string;
  public isLegacyServed?: boolean;
  public orderType?: string;

  abstract getDocumentTitle(): string;
  static VALIDATION_RULES = {
    affectedDocketEntries: joi
      .array()
      .items(JoiValidationConstants.RELATED_DOCKET_ENTRY),
    attachments: joi
      .boolean()
      .required()
      .messages({ '*': 'Enter selection for Attachments' }),
    documentTitle: JoiValidationConstants.STRING.optional(),
    documentType: JoiValidationConstants.STRING.required().messages({
      '*': 'Select a document type',
    }),
    eventCode: JoiValidationConstants.STRING.optional(),
    filingDate: joi
      .when('eventCode', {
        is: joi
          .exist()
          .not(null)
          .valid(...UNSERVABLE_EVENT_CODES),
        otherwise: joi.optional().allow(null),
        then: JoiValidationConstants.ISO_DATE.max('now').required(),
      })
      .messages({ '*': 'Enter a filing date' }),
  };
}

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

export type RawCourtIssuedDocument = ExcludeMethods<CourtIssuedDocument>;

export type CourtIssuedDocumentAnyType = RawCourtIssuedDocument &
  Partial<RawCourtIssuedDocumentTypeA> &
  Partial<RawCourtIssuedDocumentTypeB> &
  Partial<RawCourtIssuedDocumentTypeC> &
  Partial<RawCourtIssuedDocumentTypeD> &
  Partial<RawCourtIssuedDocumentTypeE> &
  Partial<RawCourtIssuedDocumentTypeF> &
  Partial<RawCourtIssuedDocumentTypeG> &
  Partial<RawCourtIssuedDocumentTypeH>;
