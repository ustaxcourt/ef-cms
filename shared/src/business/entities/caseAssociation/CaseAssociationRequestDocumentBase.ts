import {
  ALL_DOCUMENT_TYPES,
  ALL_EVENT_CODES,
  OBJECTIONS_OPTIONS,
  SCENARIOS,
} from '../EntityConstants';
import { CaseAssociationRequestDocument } from './CaseAssociationRequestDocument';
import { ExternalDocumentInformationFactory } from '../externalDocument/ExternalDocumentInformationFactory';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { SupportingDocumentInformationFactory } from '@shared/business/entities/externalDocument/SupportingDocumentInformationFactory';
import { setDefaultErrorMessages } from '@shared/business/entities/utilities/setDefaultErrorMessages';
import joi from 'joi';

export class CaseAssociationRequestDocumentBase extends CaseAssociationRequestDocument {
  public attachments?: boolean;
  public certificateOfService: boolean;
  public certificateOfServiceDate?: string;
  public documentTitle?: string;
  public documentTitleTemplate: string;
  public documentType: string;
  public eventCode: string;
  public filers?: string[];
  public hasSupportingDocuments?: boolean;
  public objections?: string;
  public partyIrsPractitioner?: boolean;
  public partyPrivatePractitioner?: boolean;
  public primaryDocumentFile: any;
  public scenario: string;
  public supportingDocuments?: any[];

  constructor(rawProps) {
    super('CaseAssociationRequestDocumentBase');

    this.attachments = rawProps.attachments;
    this.certificateOfService = rawProps.certificateOfService;
    this.certificateOfServiceDate = rawProps.certificateOfServiceDate;
    this.documentTitle = rawProps.documentTitle;
    this.documentTitleTemplate = rawProps.documentTitleTemplate;
    this.documentType = rawProps.documentType;
    this.eventCode = rawProps.eventCode;
    this.hasSupportingDocuments = rawProps.hasSupportingDocuments;
    this.objections = rawProps.objections;
    this.partyPrivatePractitioner = rawProps.partyPrivatePractitioner;
    this.partyIrsPractitioner = rawProps.partyIrsPractitioner;
    this.primaryDocumentFile = rawProps.primaryDocumentFile;
    this.filers = rawProps.filers || [];
    this.scenario = rawProps.scenario;
    this.supportingDocuments = rawProps.supportingDocuments;

    if (this.supportingDocuments) {
      this.supportingDocuments = this.supportingDocuments.map(item => {
        return new SupportingDocumentInformationFactory(
          item,
          CaseAssociationRequestDocumentBase.VALIDATION_ERROR_MESSAGES,
        );
      });
    }
  }

  static VALIDATION_RULES = {
    attachments: joi.boolean().optional(),
    certificateOfService: joi.boolean().required(),
    certificateOfServiceDate: JoiValidationConstants.ISO_DATE.max('now').when(
      'certificateOfService',
      {
        is: true,
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      },
    ),
    documentTitle: JoiValidationConstants.STRING.max(500).optional(),
    documentTitleTemplate: JoiValidationConstants.STRING.max(500).required(),
    documentType: JoiValidationConstants.STRING.valid(
      ...ALL_DOCUMENT_TYPES,
    ).required(),
    eventCode: JoiValidationConstants.STRING.valid(
      ...ALL_EVENT_CODES,
    ).required(),
    filers: joi.when('partyIrsPractitioner', {
      is: true,
      otherwise: joi.array().items(JoiValidationConstants.UUID).min(1),
      then: joi.array().max(0),
    }),
    hasSupportingDocuments: joi.boolean().optional(),
    objections: JoiValidationConstants.STRING.valid(
      ...OBJECTIONS_OPTIONS,
    ).optional(),
    partyIrsPractitioner: joi.boolean().optional(),
    partyPrivatePractitioner: joi.boolean().optional(),
    primaryDocumentFile: joi.object().required(),
    scenario: JoiValidationConstants.STRING.valid(...SCENARIOS).required(),
    supportingDocuments: joi.array().optional(),
  };

  static VALIDATION_ERROR_MESSAGES = {
    ...ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES,
    documentTitle:
      'Document title must be 500 characters or fewer. Update this document title and try again.',
    documentTitleTemplate: 'Select a document',
    eventCode: 'Select a document',
    filers: 'Select a party',
    scenario: 'Select a document',
  };

  // TODO
  getDocumentTitle = () => {
    return this.documentTitleTemplate;
  };

  getValidationRules() {
    return CaseAssociationRequestDocumentBase.VALIDATION_RULES;
  }

  static VALIDATION_RULES_NEW = {
    attachments: joi
      .boolean()
      .optional()
      .messages(setDefaultErrorMessages('Enter selection for Attachments.')),
    certificateOfService: joi
      .boolean()
      .required()
      .messages(
        setDefaultErrorMessages(
          'Indicate whether you are including a Certificate of Service',
        ),
      ),
    certificateOfServiceDate: JoiValidationConstants.ISO_DATE.max('now')
      .when('certificateOfService', {
        is: true,
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      })
      .messages({
        ...setDefaultErrorMessages('Enter date of service'),
        'date.max':
          'Certificate of Service date cannot be in the future. Enter a valid date.',
      }),
    documentTitle: JoiValidationConstants.STRING.max(500)
      .optional()
      .messages(
        setDefaultErrorMessages(
          'Document title must be 500 characters or fewer. Update this document title and try again.',
        ),
      ),
    documentTitleTemplate: JoiValidationConstants.STRING.max(500)
      .required()
      .messages(setDefaultErrorMessages('Select a document')),
    documentType: JoiValidationConstants.STRING.valid(...ALL_DOCUMENT_TYPES)
      .required()
      .messages(setDefaultErrorMessages('Select a document type')),
    eventCode: JoiValidationConstants.STRING.valid(...ALL_EVENT_CODES)
      .required()
      .messages(setDefaultErrorMessages('Select a document')),
    filers: joi
      .when('partyIrsPractitioner', {
        is: true,
        otherwise: joi.array().items(JoiValidationConstants.UUID).min(1),
        then: joi.array().max(0),
      })
      .messages(
        setDefaultErrorMessages('Select a party', {
          keysToIgnore: ['string.guid'],
        }),
      ),
    hasSupportingDocuments: joi
      .boolean()
      .optional()
      .messages(
        setDefaultErrorMessages('Enter selection for Supporting Documents.'),
      ),
    objections: JoiValidationConstants.STRING.valid(...OBJECTIONS_OPTIONS)
      .optional()
      .messages(setDefaultErrorMessages('Enter selection for Objections.')),
    partyIrsPractitioner: joi
      .boolean()
      .optional()
      .messages(setDefaultErrorMessages('Select a filing party')),
    partyPrivatePractitioner: joi.boolean().optional(), //COULD NOT FIND MESSAGE STRING ANYWHERE
    primaryDocumentFile: joi
      .object()
      .required()
      .messages(setDefaultErrorMessages('Upload a document')),
    scenario: JoiValidationConstants.STRING.valid(...SCENARIOS)
      .required()
      .messages(setDefaultErrorMessages('Select a document')),
    supportingDocuments: joi.array().optional(), //COULD NOT FIND MESSAGE STRING ANYWHERE
  };

  getValidationRules_NEW() {
    return CaseAssociationRequestDocumentBase.VALIDATION_RULES_NEW;
  }

  getErrorToMessageMap() {
    return CaseAssociationRequestDocumentBase.VALIDATION_ERROR_MESSAGES;
  }
}

export type RawCaseAssociationRequestDocumentBase =
  ExcludeMethods<CaseAssociationRequestDocumentBase>;
