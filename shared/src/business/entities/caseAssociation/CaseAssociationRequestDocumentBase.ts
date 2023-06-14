import {
  ALL_DOCUMENT_TYPES,
  ALL_EVENT_CODES,
  SCENARIOS,
} from '../EntityConstants';
import { CaseAssociationRequestDocument } from './CaseAssociationRequestDocument';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { VALIDATION_ERROR_MESSAGES } from '../externalDocument/ExternalDocumentInformationFactory';
import joi from 'joi';

export class CaseAssociationRequestDocumentBase extends CaseAssociationRequestDocument {
  public certificateOfService: boolean;
  public certificateOfServiceDate?: string;
  public documentTitle?: string;
  public documentTitleTemplate: string;
  public documentType: string;
  public eventCode: string;
  public filers?: string[];
  public partyIrsPractitioner?: boolean;
  public partyPrivatePractitioner?: boolean;
  public primaryDocumentFile: any;
  public scenario: string;

  constructor(rawProps) {
    super('CaseAssociationRequestDocumentBase');

    this.certificateOfService = rawProps.certificateOfService;
    this.certificateOfServiceDate = rawProps.certificateOfServiceDate;
    this.documentTitle = rawProps.documentTitle;
    this.documentTitleTemplate = rawProps.documentTitleTemplate;
    this.documentType = rawProps.documentType;
    this.eventCode = rawProps.eventCode;
    this.partyPrivatePractitioner = rawProps.partyPrivatePractitioner;
    this.partyIrsPractitioner = rawProps.partyIrsPractitioner;
    this.primaryDocumentFile = rawProps.primaryDocumentFile;
    this.filers = rawProps.filers || [];
    this.scenario = rawProps.scenario;
  }

  static VALIDATION_RULES = {
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
    partyIrsPractitioner: joi.boolean().optional(),
    partyPrivatePractitioner: joi.boolean().optional(),
    primaryDocumentFile: joi.object().required(),
    scenario: JoiValidationConstants.STRING.valid(...SCENARIOS).required(),
  };

  static VALIDATION_ERROR_MESSAGES = {
    ...VALIDATION_ERROR_MESSAGES,
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

  getErrorToMessageMap() {
    return CaseAssociationRequestDocumentBase.VALIDATION_ERROR_MESSAGES;
  }
}

export type RawCaseAssociationRequestDocumentBase =
  ExcludeMethods<CaseAssociationRequestDocumentBase>;
