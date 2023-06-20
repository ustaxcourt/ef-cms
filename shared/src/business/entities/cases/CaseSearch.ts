import { COUNTRY_TYPES, US_STATES, US_STATES_OTHER } from '../EntityConstants';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import joiDate from '@hapi/joi-date';
import joiImported from 'joi';

const joi = joiImported.extend(joiDate);

export class CaseSearch extends JoiValidationEntity {
  petitionerName: string;
  startDate?: string;
  endDate?: string;
  petitionerState?: string;
  countryType?: string;

  constructor(rawProps) {
    super('CaseSearch');

    this.petitionerName = rawProps.petitionerName;
    this.petitionerState = rawProps.petitionerState || undefined;
    this.countryType = rawProps.countryType || undefined;
    this.startDate = rawProps.startDate || undefined;
    this.endDate = rawProps.endDate || undefined;
  }

  static JOI_VALID_DATE_SEARCH_FORMATS = ['MM/DD/YYYY'] as const;

  static VALIDATION_RULES = joi.object().keys({
    countryType: JoiValidationConstants.STRING.valid(
      COUNTRY_TYPES.DOMESTIC,
      COUNTRY_TYPES.INTERNATIONAL,
    ).optional(),
    endDate: joi
      .date()
      .iso()
      .format(CaseSearch.JOI_VALID_DATE_SEARCH_FORMATS)
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
      ),
    petitionerName: JoiValidationConstants.STRING.max(500).required(),
    petitionerState: JoiValidationConstants.STRING.valid(
      ...Object.keys(US_STATES),
      ...Object.keys(US_STATES_OTHER),
    ).optional(),
    startDate: joi
      .date()
      .iso()
      .format(CaseSearch.JOI_VALID_DATE_SEARCH_FORMATS)
      .max('now')
      .description(
        'The start date to search by, which cannot be greater than the current date, and is required when there is an end date provided',
      )
      .allow(null)
      .optional(),
  });

  static VALIDATION_ERROR_MESSAGES = {
    endDate: [
      {
        contains: 'ref:startDate',
        message: 'End date cannot be prior to start date.',
      },
      {
        contains: 'must be in [MM/DD/YYYY] format',
        message: 'Format date as MM/DD/YYYY',
      },
      {
        contains: 'must be less than or equal to "now"',
        message: 'End date cannot be in the future.',
      },
      'Enter a valid end date',
    ],
    petitionerName: 'Enter a name',
    startDate: [
      {
        contains: 'must be less than or equal to "now"',
        message: 'Start date cannot be in the future.',
      },
      {
        contains: 'must be in [MM/DD/YYYY] format',
        message: 'Format date as MM/DD/YYYY',
      },
      'Enter a valid start date',
    ],
  };

  getValidationRules() {
    return CaseSearch.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return CaseSearch.VALIDATION_ERROR_MESSAGES;
  }
}

export type RawCaseSearch = ExcludeMethods<CaseSearch>;
