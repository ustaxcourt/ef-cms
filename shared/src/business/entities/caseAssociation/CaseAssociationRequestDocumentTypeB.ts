import { CaseAssociationRequestDocument } from './CaseAssociationRequestDocument';
import { CaseAssociationRequestDocumentBase } from './CaseAssociationRequestDocumentBase';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { OBJECTIONS_OPTIONS } from '../EntityConstants';
import { SupportingDocumentInformationFactory } from '../externalDocument/SupportingDocumentInformationFactory';
import { replaceBracketed } from '../../utilities/replaceBracketed';

export class CaseAssociationRequestDocumentTypeB extends CaseAssociationRequestDocument {
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

  constructor(rawProps) {
    super('CaseAssociationRequestDocumentTypeB');

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
        return new SupportingDocumentInformationFactory(item);
      });
    }
  }

  static VALIDATION_RULES = {
    ...CaseAssociationRequestDocumentBase.VALIDATION_RULES,
    objections: JoiValidationConstants.STRING.valid(...OBJECTIONS_OPTIONS)
      .required()
      .messages({ '*': 'Enter selection for Objections.' }),
  };

  getValidationRules() {
    return CaseAssociationRequestDocumentTypeB.VALIDATION_RULES;
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

export type RawCaseAssociationRequestDocumentTypeB =
  ExcludeMethods<CaseAssociationRequestDocumentTypeB>;
