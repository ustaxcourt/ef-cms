import {
  ALL_DOCUMENT_TYPES,
  ALL_EVENT_CODES,
  AMENDMENT_EVENT_CODES,
  AMICUS_BRIEF_EVENT_CODE,
  DOCUMENT_EXTERNAL_CATEGORIES_MAP,
  MAX_FILE_SIZE_MB,
} from '../EntityConstants';
import { DOCKET_ENTRY_VALIDATION_RULE_KEYS } from '@shared/business/entities/EntityValidationConstants';
import { ExternalDocumentFactory } from '../externalDocument/ExternalDocumentFactory';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';
import joi from 'joi';

export class DocketEntryFactory extends JoiValidationEntity {
  public dateReceived: string;
  public isDocumentRequired: boolean;
  public partyPrivatePractitioner: boolean;
  public primaryDocumentFile: object;
  public primaryDocumentFileSize: number;
  public secondaryDocumentFile: object;
  public additionalInfo?: string;
  public additionalInfo2?: string;
  public addToCoversheet?: boolean;
  public attachments?: string;
  public certificateOfService?: string;
  public certificateOfServiceDate?: string;
  public documentTitle: string;
  public documentType: string;
  public eventCode: string;
  public freeText?: string;
  public hasOtherFilingParty?: boolean;
  public hasSupportingDocuments?: boolean;
  public isAutoGenerated?: boolean;
  public isPaper?: boolean;
  public lodged?: string;
  public objections?: string;
  public filers: string[];
  public ordinalValue?: string;
  public otherIteration?: string;
  public otherFilingParty?: string;
  public partyIrsPractitioner?: boolean;
  public secondaryDocument?: any;
  public serviceDate?: string;
  public trialLocation?: string;
  public previousDocument?: {
    docketEntryId: string;
    documentTitle: string;
    documentType: string;
  };

  private freeText2?: string;
  private scenario: string;
  private selectedCases: string[];

  constructor(rawPropsParam) {
    super('DocketEntryFactory');
    this.additionalInfo = rawPropsParam.additionalInfo;
    this.additionalInfo2 = rawPropsParam.additionalInfo2;
    this.addToCoversheet = rawPropsParam.addToCoversheet;
    this.attachments = rawPropsParam.attachments;
    this.certificateOfService = rawPropsParam.certificateOfService;
    this.certificateOfServiceDate = rawPropsParam.certificateOfServiceDate;
    this.dateReceived = rawPropsParam.dateReceived;
    this.documentTitle = rawPropsParam.documentTitle;
    this.documentType = rawPropsParam.documentType;
    this.eventCode = rawPropsParam.eventCode;
    this.filers = rawPropsParam.filers;
    this.freeText = rawPropsParam.freeText;
    this.hasOtherFilingParty = rawPropsParam.hasOtherFilingParty;
    this.hasSupportingDocuments = rawPropsParam.hasSupportingDocuments;
    this.isAutoGenerated = rawPropsParam.isAutoGenerated;
    this.isDocumentRequired = rawPropsParam.isDocumentRequired;
    this.isPaper = rawPropsParam.isPaper;
    this.lodged = rawPropsParam.lodged;
    this.objections = rawPropsParam.objections;
    this.ordinalValue = rawPropsParam.ordinalValue;
    this.otherIteration = rawPropsParam.otherIteration;
    this.otherFilingParty = rawPropsParam.otherFilingParty;
    this.partyIrsPractitioner = rawPropsParam.partyIrsPractitioner;
    this.partyPrivatePractitioner = rawPropsParam.partyPrivatePractitioner;
    this.previousDocument = rawPropsParam.previousDocument;
    this.primaryDocumentFile = rawPropsParam.primaryDocumentFile;
    this.primaryDocumentFileSize = rawPropsParam.primaryDocumentFileSize;
    this.secondaryDocumentFile = rawPropsParam.secondaryDocumentFile;
    this.serviceDate = rawPropsParam.serviceDate;
    this.trialLocation = rawPropsParam.trialLocation;

    const { secondaryDocument } = rawPropsParam;
    if (secondaryDocument) {
      this.secondaryDocument = ExternalDocumentFactory(secondaryDocument);
    }

    this.scenario = rawPropsParam.scenario;
    this.freeText2 = rawPropsParam.freeText2;
    this.selectedCases = rawPropsParam.selectedCases;
  }

  getValidationRules() {
    const eFiledObjectionRequiredEventCodes = [
      ...DOCUMENT_EXTERNAL_CATEGORIES_MAP['Motion'].map(entry => {
        return entry.eventCode;
      }),
      'M116',
      'M112',
      'APLD',
    ];

    let schema = joi.object().keys({
      addToCoversheet: DOCKET_ENTRY_VALIDATION_RULE_KEYS.addToCoversheet,
      additionalInfo: DOCKET_ENTRY_VALIDATION_RULE_KEYS.additionalInfo,
      additionalInfo2: DOCKET_ENTRY_VALIDATION_RULE_KEYS.additionalInfo2,
      attachments: DOCKET_ENTRY_VALIDATION_RULE_KEYS.attachments,
      certificateOfService:
        DOCKET_ENTRY_VALIDATION_RULE_KEYS.certificateOfService,
      certificateOfServiceDate:
        DOCKET_ENTRY_VALIDATION_RULE_KEYS.certificateOfServiceDate,
      dateReceived: JoiValidationConstants.ISO_DATE.max('now')
        .required()
        .messages({
          ...setDefaultErrorMessage('Enter a valid date received'),
          'date.max':
            'Received date cannot be in the future. Enter a valid date.',
        }),
      documentTitle: DOCKET_ENTRY_VALIDATION_RULE_KEYS.documentTitle,
      documentType: JoiValidationConstants.STRING.valid(...ALL_DOCUMENT_TYPES)
        .optional()
        .messages(setDefaultErrorMessage('Select a document type')),
      eventCode: JoiValidationConstants.STRING.valid(...ALL_EVENT_CODES)
        .required()
        .messages(setDefaultErrorMessage('Select a document type')),
      freeText: DOCKET_ENTRY_VALIDATION_RULE_KEYS.freeText,
      hasOtherFilingParty:
        DOCKET_ENTRY_VALIDATION_RULE_KEYS.hasOtherFilingParty,
      hasSupportingDocuments:
        DOCKET_ENTRY_VALIDATION_RULE_KEYS.hasSupportingDocuments,
      isAutoGenerated: DOCKET_ENTRY_VALIDATION_RULE_KEYS.isAutoGenerated,
      isDocumentRequired: joi.boolean().optional(),
      lodged: DOCKET_ENTRY_VALIDATION_RULE_KEYS.lodged,
      objections: JoiValidationConstants.STRING.when('isPaper', {
        is: true,
        otherwise: joi.when('eventCode', {
          is: joi.exist().valid(...eFiledObjectionRequiredEventCodes),
          otherwise: joi.when('eventCode', {
            is: joi.exist().valid(...AMENDMENT_EVENT_CODES),
            otherwise: joi.optional(),
            then: joi.when('previousDocument.eventCode', {
              is: joi.exist().valid(...eFiledObjectionRequiredEventCodes),
              otherwise: joi.optional(),
              then: joi.required(),
            }),
          }),
          then: joi.required(),
        }),
        then: joi.optional(),
      }).messages(setDefaultErrorMessage('Enter selection for Objections.')),
      ordinalValue: DOCKET_ENTRY_VALIDATION_RULE_KEYS.ordinalValue,
      otherFilingParty: DOCKET_ENTRY_VALIDATION_RULE_KEYS.otherFilingParty,
      otherIteration: DOCKET_ENTRY_VALIDATION_RULE_KEYS.otherIteration,
      previousDocument: joi.object().optional(),
      primaryDocumentFile: joi
        .object()
        .when('isDocumentRequired', {
          is: true,
          otherwise: joi.optional(),
          then: joi.required(),
        })
        .messages(setDefaultErrorMessage('Upload a document')),
      primaryDocumentFileSize: JoiValidationConstants.MAX_FILE_SIZE_BYTES.when(
        'primaryDocumentFile',
        {
          is: joi.exist().not(null),
          otherwise: joi.optional().allow(null),
          then: joi.required(),
        },
      ).messages({
        ...setDefaultErrorMessage('Your document file size is empty.'),
        'number.max': `Your document file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      }),
      serviceDate: DOCKET_ENTRY_VALIDATION_RULE_KEYS.serviceDate,
      trialLocation: DOCKET_ENTRY_VALIDATION_RULE_KEYS.trialLocation,
    });

    const schemaOptionalItems = {
      filers: joi
        .when('eventCode', {
          is: joi.exist().valid(AMICUS_BRIEF_EVENT_CODE),
          otherwise: joi
            .array()
            .items(JoiValidationConstants.UUID.required())
            .required(),
          then: joi.optional(),
        })
        .messages(setDefaultErrorMessage('Select a filing party')),
    };

    const addToSchema = itemName => {
      schema = schema.keys({
        [itemName]: schemaOptionalItems[itemName],
      });
    };

    const exDoc = ExternalDocumentFactory(this);
    const rules = exDoc.getValidationRules();
    const docketEntryExternalDocumentSchema = rules.validate
      ? rules
      : joi.object().keys(rules);

    schema = schema.concat(docketEntryExternalDocumentSchema).concat(
      joi.object({
        category: JoiValidationConstants.STRING.optional().messages(
          setDefaultErrorMessage('Select a Category.'),
        ), // omitting category
      }),
    );

    if (
      this.filers?.length === 0 &&
      this.partyIrsPractitioner !== true &&
      this.partyPrivatePractitioner !== true &&
      this.hasOtherFilingParty !== true &&
      !this.isAutoGenerated
    ) {
      addToSchema('filers');
    }
    return schema;
  }
}
