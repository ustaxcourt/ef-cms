import {
  CASE_CAPTION_RULE,
  CASE_DOCKET_NUMBER_RULE,
  CASE_DOCKET_NUMBER_WITH_SUFFIX_RULE,
  CASE_IRS_PRACTITIONERS_RULE,
  CASE_IS_SEALED_RULE,
  CASE_LEAD_DOCKET_NUMBER_RULE,
  CASE_PETITIONERS_RULE,
  CASE_PRIVATE_PRACTITIONERS_RULE,
  CASE_SORTABLE_DOCKET_NUMBER_RULE,
} from '@shared/business/entities/EntityValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';

export class ConsolidatedCaseDTO extends JoiValidationEntity {
  public caseCaption: string;
  public docketNumber: string;
  public isSealed: boolean;
  public docketNumberWithSuffix: string;
  public entityName: string;
  public irsPractitioners: object[];
  public leadDocketNumber: string;
  public petitioners: object[];
  public privatePractitioners: object[];
  public sortableDocketNumber: number;

  constructor(rawCase: any) {
    super('ConsolidatedCaseDTO');
    this.caseCaption = rawCase.caseCaption;
    this.docketNumber = rawCase.docketNumber;
    this.docketNumberWithSuffix = rawCase.docketNumberWithSuffix;
    this.entityName = rawCase.entityName;
    this.irsPractitioners = rawCase.irsPractitioners || [];
    this.leadDocketNumber = rawCase.leadDocketNumber;
    this.isSealed = rawCase.isSealed;
    this.petitioners = rawCase.petitioners || [];
    this.privatePractitioners = rawCase.privatePractitioners || [];
    this.sortableDocketNumber = rawCase.sortableDocketNumber;
  }

  static VALIDATION_RULES = {
    caseCaption: CASE_CAPTION_RULE,
    docketNumber: CASE_DOCKET_NUMBER_RULE,
    docketNumberWithSuffix: CASE_DOCKET_NUMBER_WITH_SUFFIX_RULE,
    irsPractitioners: CASE_IRS_PRACTITIONERS_RULE,
    isSealed: CASE_IS_SEALED_RULE,
    leadDocketNumber: CASE_LEAD_DOCKET_NUMBER_RULE,
    petitioners: CASE_PETITIONERS_RULE,
    privatePractitioners: CASE_PRIVATE_PRACTITIONERS_RULE,
    sortableDocketNumber: CASE_SORTABLE_DOCKET_NUMBER_RULE,
  } as const;

  static VALIDATION_ERROR_MESSAGES = {} as const;

  static getFields() {
    return Object.getOwnPropertyNames.call(Object, new ConsolidatedCaseDTO({}));
  }

  getValidationRules() {
    return ConsolidatedCaseDTO.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return ConsolidatedCaseDTO.VALIDATION_ERROR_MESSAGES;
  }
}
