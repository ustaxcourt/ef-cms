import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import joi from 'joi';

export class CaseSearchResult extends JoiValidationEntity {
  public caseCaption: string;
  public docketNumber: string;
  public docketNumberWithSuffix: string;
  public petitionerNames: string[];
  public petitionerStateNames: string[];
  public receivedAt: string;

  constructor(rawProps: RawCaseSearchResult) {
    super('CaseSearchResult');

    this.caseCaption = rawProps.caseCaption;
    this.docketNumber = rawProps.docketNumber;
    this.docketNumberWithSuffix = rawProps.docketNumberWithSuffix;
    this.petitionerNames = rawProps.petitionerNames;
    this.petitionerStateNames = rawProps.petitionerStateNames;
    this.receivedAt = rawProps.receivedAt;
  }

  static VALIDATION_RULES = {
    caseCaption: JoiValidationConstants.STRING.required(),
    docketNumber: JoiValidationConstants.DOCKET_NUMBER.required(),
    docketNumberWithSuffix: JoiValidationConstants.STRING.required(),
    petitionerNames: joi
      .array()
      .items(JoiValidationConstants.STRING)
      .required(),
    petitionerStateNames: joi
      .array()
      .items(JoiValidationConstants.STRING)
      .required(),
    receivedAt: JoiValidationConstants.STRING.required(),
  };

  getValidationRules() {
    return CaseSearchResult.VALIDATION_RULES;
  }
}

export type RawCaseSearchResult = ExcludeMethods<CaseSearchResult>;
