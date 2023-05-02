import { DATE_RANGE_VALIDATION_RULE_KEYS } from '../EntityValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';

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
          'End date cannot be prior to start date. Enter a valid end date.',
      },
      {
        contains: 'must be less than or equal to',
        message: 'End date cannot be in the future. Enter a valid date.',
      },
      {
        contains: 'is required',
        message: 'Enter an end date.',
      },
      'Enter a valid end date.',
    ],
    startDate: [
      {
        contains: 'must be less than or equal to',
        message: 'Start date cannot be in the future. Enter a valid date.',
      },
      {
        contains: 'is required',
        message: 'Enter a start date.',
      },
      'Enter a valid start date.',
    ],
  };

  getValidationRules() {
    return {
      endDate: DATE_RANGE_VALIDATION_RULE_KEYS.endDate,
      startDate: DATE_RANGE_VALIDATION_RULE_KEYS.startDate,
    };
  }
  getErrorToMessageMap() {
    return CustomCaseInventorySearch.VALIDATION_ERROR_MESSAGES;
  }
}
