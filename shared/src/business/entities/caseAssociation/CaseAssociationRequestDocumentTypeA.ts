import {
  ALL_DOCUMENT_TYPES,
  ALL_EVENT_CODES,
  OBJECTIONS_OPTIONS,
  SCENARIOS,
} from '../EntityConstants';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { SupportingDocumentInformationFactory } from '../externalDocument/SupportingDocumentInformationFactory';
import { VALIDATION_ERROR_MESSAGES } from '../externalDocument/ExternalDocumentInformationFactory';
import joi from 'joi';

// documentWithAttachments
export class CaseAssociationRequestDocumentTypeA extends JoiValidationEntity {
  public attachments: boolean;
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
    super('CaseAssociationRequestDocumentTypeA');

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
        return SupportingDocumentInformationFactory(
          item,
          CaseAssociationRequestDocumentTypeA.VALIDATION_ERROR_MESSAGES,
        );
      });
    }
  }

  static VALIDATION_RULES = {
    attachments: joi.boolean().required(),
    certificateOfService: joi.boolean().required(),
    certificateOfServiceDate: JoiValidationConstants.ISO_DATE.max('now').when(
      'certificateOfService',
      {
        is: true,
        otherwise: joi.optional(),
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
    filers: joi
      .array()
      .items(JoiValidationConstants.UUID.required())
      .when('partyIrsPractitioner', {
        is: false,
        otherwise: joi.optional(),
        then: joi.required(),
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
    ...VALIDATION_ERROR_MESSAGES,
    documentTitleTemplate: 'Select a document',
    eventCode: 'Select a document',
    filers: 'Select a party',
    scenario: 'Select a document',
  };

  getDocumentTitle = petitioners => {
    return this.documentTitleTemplate;
  };

  getValidationRules() {
    return CaseAssociationRequestDocumentTypeA.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return CaseAssociationRequestDocumentTypeA.VALIDATION_ERROR_MESSAGES;
  }
}

export type RawCaseAssociationRequestDocumentTypeA =
  ExcludeMethods<CaseAssociationRequestDocumentTypeA>;
