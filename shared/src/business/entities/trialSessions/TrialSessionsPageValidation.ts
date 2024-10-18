import { JoiValidationConstants } from '@shared/business/entities/JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import joi from 'joi';

export class TrialSessionsPageValidation extends JoiValidationEntity {
  public endDate: string;
  public startDate: string;

  constructor(rawProps) {
    super('TrialSessionsPageValidation');
    this.endDate = rawProps.endDate;
    this.startDate = rawProps.startDate;
  }

  getValidationRules() {
    return {
      endDate: joi
        .alternatives()
        .conditional('startDate', {
          is: JoiValidationConstants.ISO_DATE.exist().not(null),
          otherwise: JoiValidationConstants.ISO_DATE,
          then: JoiValidationConstants.ISO_DATE.min(
            joi.ref('startDate'),
          ).description(
            'The end date search filter must be of valid date format and greater than or equal to the start date',
          ),
        })
        .messages({
          '*': 'Enter date in format MM/DD/YYYY.',
          'date.min': 'End date cannot be prior to start date.',
        }),
      startDate: JoiValidationConstants.ISO_DATE.description(
        'The start date to search by, which cannot be greater than the current date, and is required when there is an end date provided',
      ).messages({
        '*': 'Enter date in format MM/DD/YYYY.',
      }),
    };
  }
}
