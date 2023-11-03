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
  CASE_STATUS_RULE,
} from '@shared/business/entities/EntityValidationConstants';
import { CaseStatus } from '@shared/business/entities/EntityConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';

export class ConsolidatedCaseSummary extends JoiValidationEntity {
  public caseCaption: string;
  public docketNumber: string;
  public docketNumberWithSuffix: string;
  public irsPractitioners: object[];
  public isSealed: boolean;
  public leadDocketNumber: string;
  public petitioners: object[];
  public privatePractitioners: object[];
  public sortableDocketNumber: number;
  public status: CaseStatus;

  constructor(rawCase: any) {
    super('ConsolidatedCaseSummary');

    this.caseCaption = rawCase.caseCaption;
    this.docketNumber = rawCase.docketNumber;
    this.docketNumberWithSuffix = rawCase.docketNumberWithSuffix;
    this.irsPractitioners = rawCase.irsPractitioners || [];
    this.leadDocketNumber = rawCase.leadDocketNumber;
    this.isSealed = rawCase.isSealed;
    this.petitioners = rawCase.petitioners || [];
    this.privatePractitioners = rawCase.privatePractitioners || [];
    this.sortableDocketNumber = rawCase.sortableDocketNumber;
    this.status = rawCase.status;
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
    status: CASE_STATUS_RULE,
  } as const;

  static getFields() {
    return Object.getOwnPropertyNames.call(
      Object,
      new ConsolidatedCaseSummary({}),
    );
  }

  getValidationRules() {
    return ConsolidatedCaseSummary.VALIDATION_RULES;
  }
}

export type RawConsolidatedCaseSummary =
  ExcludeMethods<ConsolidatedCaseSummary>;
