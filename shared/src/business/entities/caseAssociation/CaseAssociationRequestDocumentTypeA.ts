import { CaseAssociationRequestDocument } from './CaseAssociationRequestDocument';
import { CaseAssociationRequestDocumentBase } from './CaseAssociationRequestDocumentBase';
import { SupportingDocumentInformationFactory } from '../externalDocument/SupportingDocumentInformationFactory';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';
import joi from 'joi';

export class CaseAssociationRequestDocumentTypeA extends CaseAssociationRequestDocument {
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
        return new SupportingDocumentInformationFactory(
          item,
          CaseAssociationRequestDocumentTypeA.VALIDATION_ERROR_MESSAGES,
        );
      });
    }
  }

  static VALIDATION_RULES = {
    ...CaseAssociationRequestDocumentBase.VALIDATION_RULES,
    attachments: joi.boolean().required(),
  };

  static VALIDATION_ERROR_MESSAGES =
    CaseAssociationRequestDocumentBase.VALIDATION_ERROR_MESSAGES;

  getDocumentTitle = () => {
    return this.documentTitleTemplate;
  };

  getValidationRules() {
    return CaseAssociationRequestDocumentTypeA.VALIDATION_RULES;
  }

  static VALIDATION_RULES_NEW = {
    ...CaseAssociationRequestDocumentBase.VALIDATION_RULES_NEW,
    attachments: joi
      .boolean()
      .required()
      .messages(setDefaultErrorMessage('Enter selection for Attachments.')),
  };

  getValidationRules_NEW() {
    return CaseAssociationRequestDocumentTypeA.VALIDATION_RULES_NEW;
  }

  getErrorToMessageMap() {
    return CaseAssociationRequestDocumentTypeA.VALIDATION_ERROR_MESSAGES;
  }
}

export type RawCaseAssociationRequestDocumentTypeA =
  ExcludeMethods<CaseAssociationRequestDocumentTypeA>;
