import { JoiValidationConstants } from '@shared/business/entities/JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import { createEndOfDayISO } from '@shared/business/utilities/DateHandler';
import joi from 'joi';

export class OpinionSearchValidation extends JoiValidationEntity {
  public startDate: string;
  public endDate: string;

  constructor(rawProps) {
    super('OpinionSearchValidation');
    this.startDate = rawProps.startDate;
    this.endDate = rawProps.endDate;
  }

  getValidationRules() {
    return {
      startDate: JoiValidationConstants.ISO_DATE.max('now')
        .description(
          'The start date to search by, which cannot be greater than the current date, and is required when there is an end date provided',
        )
        .messages({
          '*': 'Enter date in format MM/DD/YYYY.',
          'date.max': 'Start date cannot be in the future. Enter a valid date.',
        }),
      endDate: joi
        .alternatives()
        .conditional('startDate', {
          is: JoiValidationConstants.ISO_DATE.exist().not(null),
          otherwise: JoiValidationConstants.ISO_DATE.max(
            createEndOfDayISO(),
          ).description(
            'The end date search filter must be of valid date format',
          ),
          then: JoiValidationConstants.ISO_DATE.max(createEndOfDayISO())
            .min(joi.ref('startDate'))
            .description(
              'The end date search filter must be of valid date format and greater than or equal to the start date',
            ),
        })
        .messages({
          '*': 'Enter date in format MM/DD/YYYY.',
          'date.max': 'End date cannot be in the future. Enter a valid date.',
          'date.min':
            'End date cannot be prior to start date. Enter a valid end date.',
        }),
    };
  }
}
