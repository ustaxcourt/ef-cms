import { CaseAssociationRequestDocument } from './CaseAssociationRequestDocument';
import { CaseAssociationRequestDocumentBase } from './CaseAssociationRequestDocumentBase';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { OBJECTIONS_OPTIONS } from '../EntityConstants';
import { SupportingDocumentInformationFactory } from '../externalDocument/SupportingDocumentInformationFactory';
import { setDefaultErrorMessages } from '@shared/business/entities/utilities/setDefaultErrorMessages';
import joi from 'joi';

export class CaseAssociationRequestDocumentTypeC extends CaseAssociationRequestDocument {
  public attachments: boolean;
  public certificateOfService: boolean;
  public certificateOfServiceDate?: string;
  public documentTitle?: string;
  public documentTitleTemplate: string;
  public documentType: string;
  public eventCode: string;
  public filers?: string[];
  public hasSupportingDocuments: boolean;
  public objections: string;
  public partyIrsPractitioner?: boolean;
  public partyPrivatePractitioner?: boolean;
  public primaryDocumentFile: any;
  public scenario: string;
  public supportingDocuments?: any[];

  constructor(rawProps) {
    super('CaseAssociationRequestDocumentTypeC');

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
          CaseAssociationRequestDocumentTypeC.VALIDATION_ERROR_MESSAGES,
        );
      });
    }
  }

  static VALIDATION_RULES = {
    ...CaseAssociationRequestDocumentBase.VALIDATION_RULES,
    attachments: joi.boolean().required(),
    hasSupportingDocuments: joi.boolean().required(),
    objections: JoiValidationConstants.STRING.valid(
      ...OBJECTIONS_OPTIONS,
    ).required(),
  };

  static VALIDATION_ERROR_MESSAGES =
    CaseAssociationRequestDocumentBase.VALIDATION_ERROR_MESSAGES;

  getDocumentTitle = () => {
    return this.documentTitleTemplate;
  };

  getValidationRules() {
    return CaseAssociationRequestDocumentTypeC.VALIDATION_RULES;
  }

  static VALIDATION_RULES_NEW = {
    ...CaseAssociationRequestDocumentBase.VALIDATION_RULES_NEW,
    attachments: joi
      .boolean()
      .required()
      .messages(setDefaultErrorMessages('Enter selection for Attachments.')),
    hasSupportingDocuments: joi
      .boolean()
      .required()
      .messages(
        setDefaultErrorMessages('Enter selection for Supporting Documents.'),
      ),
    objections: JoiValidationConstants.STRING.valid(...OBJECTIONS_OPTIONS)
      .required()
      .messages(setDefaultErrorMessages('Enter selection for Objections.')),
  };

  getValidationRules_NEW() {
    return CaseAssociationRequestDocumentTypeC.VALIDATION_RULES_NEW;
  }

  getErrorToMessageMap() {
    return CaseAssociationRequestDocumentTypeC.VALIDATION_ERROR_MESSAGES;
  }
}

export type RawCaseAssociationRequestDocumentTypeC =
  ExcludeMethods<CaseAssociationRequestDocumentTypeC>;
