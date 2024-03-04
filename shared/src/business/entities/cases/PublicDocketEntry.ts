import {
  ALL_EVENT_CODES,
  DOCKET_ENTRY_SEALED_TO_TYPES,
} from '../EntityConstants';
import { DOCKET_ENTRY_VALIDATION_RULE_KEYS } from '../EntityValidationConstants';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import joi from 'joi';

export class PublicDocketEntry extends JoiValidationEntity {
  public additionalInfo?: string;
  public additionalInfo2?: string;
  public attachments?: boolean;
  public certificateOfService?: boolean;
  public certificateOfServiceDate?: string;
  public docketEntryId?: string;
  public docketNumber: string;
  public documentTitle?: string;
  public documentType?: string;
  public eventCode?: string;
  public filedBy?: string;
  public filedByRole?: string;
  public filingDate: string;
  public freeText?: string;
  public index?: number;
  public isFileAttached?: boolean;
  public isLegacyServed?: boolean;
  public isMinuteEntry?: boolean;
  public isOnDocketRecord?: boolean;
  public isPaper?: boolean;
  public isSealed: boolean;
  public isStricken?: boolean;
  public lodged?: boolean;
  public numberOfPages?: number;
  public objections?: string;
  public processingStatus?: string;
  public receivedAt: string;
  public sealedTo?: string;
  public servedAt?: string;
  public servedPartiesCode?: string;
  public previousDocument?: {
    docketEntryId: string;
    documentTitle: string;
    documentType: string;
  };

  constructor(rawProps) {
    super('PublicDocketEntry');
    this.additionalInfo = rawProps.additionalInfo;
    this.additionalInfo2 = rawProps.additionalInfo2;
    this.attachments = rawProps.attachments;
    this.certificateOfService = rawProps.certificateOfService;
    this.certificateOfServiceDate = rawProps.certificateOfServiceDate;
    this.docketEntryId = rawProps.docketEntryId;
    this.docketNumber = rawProps.docketNumber;
    this.documentTitle = rawProps.documentTitle;
    this.documentType = rawProps.documentType;
    this.eventCode = rawProps.eventCode;
    this.filedBy = rawProps.filedBy;
    this.filingDate = rawProps.filingDate;
    this.freeText = rawProps.freeText;
    this.index = rawProps.index;
    this.isFileAttached = rawProps.isFileAttached;
    this.filedByRole = rawProps.filedByRole;
    this.isLegacyServed = rawProps.isLegacyServed;
    this.isMinuteEntry = DocketEntry.isMinuteEntry({
      eventCode: rawProps.eventCode,
    });
    this.isOnDocketRecord = rawProps.isOnDocketRecord;
    this.isPaper = rawProps.isPaper;
    this.isSealed = !!rawProps.isSealed;
    this.isStricken = rawProps.isStricken;
    this.lodged = rawProps.lodged;
    this.numberOfPages = rawProps.numberOfPages;
    this.objections = rawProps.objections;
    this.processingStatus = rawProps.processingStatus;
    this.receivedAt = rawProps.receivedAt;
    this.sealedTo = rawProps.sealedTo;
    this.servedAt = rawProps.servedAt;
    this.servedPartiesCode = rawProps.servedPartiesCode;
    if (rawProps.previousDocument) {
      this.previousDocument = {
        docketEntryId: rawProps.previousDocument.docketEntryId,
        documentTitle: rawProps.previousDocument.documentTitle,
        documentType: rawProps.previousDocument.documentType,
      };
    }
  }

  static VALIDATION_RULES = {
    additionalInfo: DOCKET_ENTRY_VALIDATION_RULE_KEYS.additionalInfo,
    additionalInfo2: DOCKET_ENTRY_VALIDATION_RULE_KEYS.additionalInfo2,
    attachments: DOCKET_ENTRY_VALIDATION_RULE_KEYS.attachments,
    certificateOfService:
      DOCKET_ENTRY_VALIDATION_RULE_KEYS.certificateOfService,
    certificateOfServiceDate:
      DOCKET_ENTRY_VALIDATION_RULE_KEYS.certificateOfServiceDate,
    createdAt: JoiValidationConstants.ISO_DATE.optional().description(
      'When the Document was added to the system.',
    ),
    docketEntryId: JoiValidationConstants.UUID.optional(),
    docketNumber: DOCKET_ENTRY_VALIDATION_RULE_KEYS.docketNumber,
    documentTitle: DOCKET_ENTRY_VALIDATION_RULE_KEYS.documentTitle,
    documentType: JoiValidationConstants.STRING.optional().description(
      'The type of this document.',
    ),
    eventCode: JoiValidationConstants.STRING.valid(
      ...ALL_EVENT_CODES,
    ).optional(),
    filedBy: JoiValidationConstants.STRING.optional().allow('', null),
    filingDate: JoiValidationConstants.ISO_DATE.max('now')
      .required()
      .description('Date that this Document was filed.'),
    freeText: JoiValidationConstants.STRING.max(1000).optional(),
    index: DOCKET_ENTRY_VALIDATION_RULE_KEYS.index,
    isFileAttached: DOCKET_ENTRY_VALIDATION_RULE_KEYS.isFileAttached,
    isLegacyServed: DOCKET_ENTRY_VALIDATION_RULE_KEYS.isLegacyServed,
    isMinuteEntry: joi.boolean().optional(),
    isPaper: DOCKET_ENTRY_VALIDATION_RULE_KEYS.isPaper,
    isSealed: joi.boolean().required(),
    isStricken: joi
      .boolean()
      .optional()
      .description(
        'Indicates the item has been removed from the docket record.',
      ),
    lodged: DOCKET_ENTRY_VALIDATION_RULE_KEYS.lodged,
    numberOfPages: DOCKET_ENTRY_VALIDATION_RULE_KEYS.numberOfPages,
    objections: DOCKET_ENTRY_VALIDATION_RULE_KEYS.objections,
    processingStatus: JoiValidationConstants.STRING.optional(),
    receivedAt: JoiValidationConstants.ISO_DATE.max('now').required(),
    sealedTo: JoiValidationConstants.STRING.when('isSealed', {
      is: true,
      otherwise: joi.optional().allow(null),
      then: joi
        .valid(...Object.values(DOCKET_ENTRY_SEALED_TO_TYPES))
        .required(),
    }).description("If sealed, the type of users who it's sealed from."),
    servedAt: JoiValidationConstants.ISO_DATE.max('now').optional(),
    servedPartiesCode: DOCKET_ENTRY_VALIDATION_RULE_KEYS.servedPartiesCode,
  } as const;

  getValidationRules() {
    return PublicDocketEntry.VALIDATION_RULES;
  }
}
