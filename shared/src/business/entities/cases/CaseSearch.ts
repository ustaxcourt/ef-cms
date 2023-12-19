import { COUNTRY_TYPES, US_STATES, US_STATES_OTHER } from '../EntityConstants';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import joiDate from '@joi/date';
import joiImported, { Root } from 'joi';

const joi: Root = joiImported.extend(joiDate);

export class CaseSearch extends JoiValidationEntity {
  countryType?: string;
  endDate?: string;
  petitionerName: string;
  petitionerState?: string;
  startDate?: string;

  constructor(rawProps) {
    super('CaseSearch');

    this.countryType = rawProps.countryType || undefined;
    this.endDate = rawProps.endDate || undefined;
    this.petitionerName = rawProps.petitionerName;
    this.petitionerState = rawProps.petitionerState || undefined;
    this.startDate = rawProps.startDate || undefined;
  }

  static JOI_VALID_DATE_SEARCH_FORMAT = 'MM/DD/YYYY';

  static VALIDATION_RULES = {
    countryType: JoiValidationConstants.STRING.valid(
      'all',
      COUNTRY_TYPES.DOMESTIC,
      COUNTRY_TYPES.INTERNATIONAL,
    ).optional(),
    endDate: joi
      .date()
      .iso()
      .format(CaseSearch.JOI_VALID_DATE_SEARCH_FORMAT)
      .max('now')
      .allow(null)
      .optional()
      .when('startDate', {
        is: joi.exist(),
        otherwise: joi.date().allow(null),
        then: joi.date().min(joi.ref('startDate')).optional(),
      })
      .description(
        'The end date search filter must be greater than or equal to the start date, and less than or equal to the current date',
      )
      .messages({
        '*': 'Enter a valid end date',
        'any.ref': 'End date cannot be prior to start date.',
        'any.required': 'Enter an End date.',
        'date.format': 'Format date as MM/DD/YYYY',
        'date.max': 'End date cannot be in the future.',
        'date.min': 'End date cannot be prior to start date.',
      }),
    petitionerName: JoiValidationConstants.STRING.max(500)
      .required()
      .messages({ '*': 'Enter a name' }),
    petitionerState: JoiValidationConstants.STRING.valid(
      ...Object.keys(US_STATES),
      ...Object.keys(US_STATES_OTHER),
    ).optional(),
    startDate: joi
      .date()
      .iso()
      .format(CaseSearch.JOI_VALID_DATE_SEARCH_FORMAT)
      .max('now')
      .description(
        'The start date to search by, which cannot be greater than the current date, and is required when there is an end date provided',
      )
      .allow(null)
      .optional()
      .messages({
        '*': 'Enter a valid start date',
        'date.format': 'Format date as MM/DD/YYYY',
        'date.max': 'Start date cannot be in the future.',
      }),
  };

  getValidationRules() {
    return CaseSearch.VALIDATION_RULES;
  }
}

export type RawCaseSearch = ExcludeMethods<CaseSearch>;
