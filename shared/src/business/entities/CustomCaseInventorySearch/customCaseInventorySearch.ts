import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import joi from 'joi';
import joiDate from '@hapi/joi-date';
joi.extend(joiDate);
const { DATE_RANGE_SEARCH_OPTIONS } = require('../EntityConstants');

/**
 * Custom Case Inventory Report Entity
 *
 * @param {object} rawProps the raw activity search data
 * @constructor
 */

export class CustomCaseInventorySearch extends JoiValidationEntity {
  public startDate: string;
  public endDate: string;

  constructor(rawProps) {
    super('CustomCaseInventorySearch');
    this.startDate = rawProps.startDate;
    this.endDate = rawProps.endDate;
  }

  static VALIDATION_ERROR_MESSAGES = {
    endDate: [
      {
        contains: 'ref:startDate',
        message:
          'End date cannot be prior to Start Date. Enter a valid End date.',
      },
      {
        contains: 'must be less than or equal to',
        message: 'End date cannot be in the future. Enter a valid date.',
      },
      {
        contains: 'is required',
        message: 'Enter an end date.',
      },
      'Enter a valid end date',
    ],
    startDate: [
      {
        contains: 'is required',
        message: 'Enter a start date.',
      },
      {
        contains: 'must be less than or equal to',
        message: 'Start date cannot be in the future. Enter a valid date.',
      },
      'Enter a valid start date',
    ],
  };

  getValidationRules() {
    return {
      endDate: joi.alternatives().conditional('startDate', {
        is: joi.exist().not(null),
        otherwise: JoiValidationConstants.ISO_DATE.format(
          'YYYY-MM-DDTHH:mm:ss.SSSZ',
        )
          .less(joi.ref('tomorrow'))
          .optional()
          .description(
            'The end date search filter is not required if there is no start date',
          ),
        then: JoiValidationConstants.ISO_DATE.format('YYYY-MM-DDTHH:mm:ss.SSSZ')
          .less(joi.ref('tomorrow'))
          .min(joi.ref('startDate'))
          .optional()
          .description(
            'The end date search filter must be greater than or equal to the start date, and less than or equal to the current date',
          ),
      }),
      startDate: joi.alternatives().conditional('dateRange', {
        is: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
        otherwise: joi.forbidden(),
        then: JoiValidationConstants.ISO_DATE.format('YYYY-MM-DDTHH:mm:ss.SSSZ')
          .max('now')
          .required()
          .description(
            'The start date to search by, which cannot be greater than the current date, and is required when there is an end date provided',
          ),
      }),
    };
  }
  getErrorToMessageMap() {
    return CustomCaseInventorySearch.VALIDATION_ERROR_MESSAGES;
  }
}
