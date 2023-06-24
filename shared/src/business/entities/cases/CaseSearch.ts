import {
  CASE_SEARCH_MIN_YEAR,
  COUNTRY_TYPES,
  US_STATES,
  US_STATES_OTHER,
} from '../EntityConstants';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import joi from 'joi';

export class CaseSearch extends JoiValidationEntity {
  petitionerName: string;
  yearFiledMin?: string;
  yearFiledMax?: number;
  petitionerState?: string;
  countryType?: string;

  constructor(rawProps) {
    super('CaseSearch');

    this.petitionerName = rawProps.petitionerName;
    this.yearFiledMin = rawProps.yearFiledMin || CASE_SEARCH_MIN_YEAR;
    this.yearFiledMax = rawProps.yearFiledMax || undefined;
    this.petitionerState = rawProps.petitionerState || undefined;
    this.countryType = rawProps.countryType || undefined;
  }

  static VALIDATION_RULES = {
    countryType: JoiValidationConstants.STRING.valid(
      COUNTRY_TYPES.DOMESTIC,
      COUNTRY_TYPES.INTERNATIONAL,
    ).optional(),
    petitionerName: JoiValidationConstants.STRING.max(500).required(),
    petitionerState: JoiValidationConstants.STRING.valid(
      ...Object.keys(US_STATES),
      ...Object.keys(US_STATES_OTHER),
    ).optional(),
    yearFiledMax: JoiValidationConstants.YEAR_MAX_CURRENT.min(
      joi.ref('yearFiledMin'),
    ).when('yearFiledMin', {
      is: joi.number(),
      otherwise: joi.number().min(1900),
      then: joi.number().min(joi.ref('yearFiledMin')),
    }),
    yearFiledMin: JoiValidationConstants.YEAR_MAX_CURRENT,
  };

  static VALIDATION_ERROR_MESSAGES = {
    petitionerName: 'Enter a name',
    yearFiledMax: [
      {
        contains: 'must be larger',
        message: 'Enter an ending year which occurs after start year',
      },
      'Enter a valid ending year',
    ],
    yearFiledMin: 'Enter a valid start year',
  };

  getValidationRules() {
    return CaseSearch.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return CaseSearch.VALIDATION_ERROR_MESSAGES;
  }
}

export type RawCaseSearch = ExcludeMethods<CaseSearch>;
