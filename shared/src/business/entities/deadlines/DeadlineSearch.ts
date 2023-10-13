import { JoiValidationEntity } from '../JoiValidationEntity';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';
import joiDate from '@joi/date';
import joiImported, { Root } from 'joi';

const joi: Root = joiImported.extend(joiDate);

export class DeadlineSearch extends JoiValidationEntity {
  public startDate: string;
  public endDate: string;

  constructor(rawProps) {
    super('DeadlineSearch');

    this.startDate = rawProps.startDate;
    this.endDate = rawProps.endDate;
  }

  static JOI_VALID_DATE_SEARCH_FORMATS = ['MM/DD/YYYY'];

  static VALIDATION_RULES = {
    endDate: joi
      .date()
      .iso()
      .format(DeadlineSearch.JOI_VALID_DATE_SEARCH_FORMATS)
      .min(joi.ref('startDate'))
      .required()
      .description(
        'The end date search filter must be greater than or equal to the start date, and less than or equal to the current date',
      ),
    startDate: joi
      .date()
      .iso()
      .format(DeadlineSearch.JOI_VALID_DATE_SEARCH_FORMATS)
      .required()
      .description(
        'The start date to search by, which cannot be greater than the current date, and is required when there is an end date provided',
      ),
  };

  static VALIDATION_RULES_NEW = {
    endDate: joi
      .date()
      .iso()
      .format(DeadlineSearch.JOI_VALID_DATE_SEARCH_FORMATS)
      .min(joi.ref('startDate'))
      .required()
      .description(
        'The end date search filter must be greater than or equal to the start date, and less than or equal to the current date',
      )
      .messages({
        ...setDefaultErrorMessage('Enter a valid end date'),
        'any.ref':
          'End date cannot be prior to Start Date. Enter a valid End date.',
        'any.required': 'Enter an End date.',
        'date.min':
          'End date cannot be prior to Start Date. Enter a valid End date.',
      }),
    startDate: joi
      .date()
      .iso()
      .format(DeadlineSearch.JOI_VALID_DATE_SEARCH_FORMATS)
      .required()
      .description(
        'The start date to search by, which cannot be greater than the current date, and is required when there is an end date provided',
      )
      .messages({
        ...setDefaultErrorMessage('Enter a valid start date'),
        'any.required': 'Enter a Start date.',
      }),
  };

  static VALIDATION_ERROR_MESSAGES = {
    endDate: [
      {
        contains: 'ref:startDate',
        message:
          'End date cannot be prior to Start Date. Enter a valid End date.',
      },
      {
        contains: 'is required',
        message: 'Enter an End date.',
      },
      'Enter a valid end date',
    ],
    startDate: [
      {
        contains: 'is required',
        message: 'Enter a Start date.',
      },
      'Enter a valid start date',
    ],
  };

  getValidationRules() {
    return DeadlineSearch.VALIDATION_RULES;
  }

  getValidationRules_NEW() {
    return DeadlineSearch.VALIDATION_RULES_NEW;
  }

  getErrorToMessageMap() {
    return DeadlineSearch.VALIDATION_ERROR_MESSAGES;
  }
}

export type RawDeadlineSearch = ExcludeMethods<DeadlineSearch>;
