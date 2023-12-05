import { CaseAssociationRequestDocument } from './CaseAssociationRequestDocument';
import { CaseAssociationRequestDocumentBase } from './CaseAssociationRequestDocumentBase';
import { GENERATION_TYPES } from '@web-client/getConstants';
import { SupportingDocumentInformationFactory } from '../externalDocument/SupportingDocumentInformationFactory';
import { replaceBracketed } from '../../utilities/replaceBracketed';
import joi from 'joi';

export class CaseAssociationRequestDocumentTypeD extends CaseAssociationRequestDocument {
  public attachments?: boolean;
  public certificateOfService: boolean;
  public certificateOfServiceDate?: string;
  public documentTitle?: string;
  public documentTitleTemplate: string;
  public documentType: string;
  public eventCode: string;
  public filers?: string[];
  public hasSupportingDocuments?: boolean;
  public objections: string;
  public partyIrsPractitioner?: boolean;
  public partyPrivatePractitioner?: boolean;
  public primaryDocumentFile: any;
  public scenario: string;
  public supportingDocuments?: any[];
  public generationType: string;

  constructor(rawProps) {
    super('CaseAssociationRequestDocumentTypeD');

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
    this.generationType = rawProps.generationType;

    if (this.supportingDocuments) {
      this.supportingDocuments = this.supportingDocuments.map(item => {
        return new SupportingDocumentInformationFactory(item);
      });
    }
  }

  static VALIDATION_RULES = {
    ...CaseAssociationRequestDocumentBase.VALIDATION_RULES,
    primaryDocumentFile: joi.when('generationType', {
      is: GENERATION_TYPES.AUTO,
      otherwise: joi.object().required().messages({ '*': 'Upload a document' }),
      then: joi.object().optional(),
    }),
  };

  getValidationRules() {
    return CaseAssociationRequestDocumentTypeD.VALIDATION_RULES;
  }

  getDocumentTitle = petitioners => {
    let petitionerNames;
    if (this.partyIrsPractitioner) {
      petitionerNames = 'Respondent';
    } else {
      const petitionerNamesArray = this.filers?.map(
        contactId => petitioners.find(p => p.contactId === contactId).name,
      );

      if (petitionerNamesArray.length > 1) {
        petitionerNames = 'Petrs. ';
      } else {
        petitionerNames = 'Petr. ';
      }
      petitionerNames += petitionerNamesArray.join(' & ');
    }

    return replaceBracketed(this.documentTitleTemplate, petitionerNames);
  };
}

export type RawCaseAssociationRequestDocumentTypeD =
  ExcludeMethods<CaseAssociationRequestDocumentTypeD>;
