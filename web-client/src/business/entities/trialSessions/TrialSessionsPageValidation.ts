import {
  JoiValidationConstants,
  extendedJoi as joi,
} from '@shared/business/entities/JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';

export class TrialSessionsPageValidation extends JoiValidationEntity {
  public endDate: string;
  public startDate: string;

  constructor(rawProps: RawTrialSessionsPageValidation) {
    super('TrialSessionsPageValidation');
    this.endDate = rawProps.endDate;
    this.startDate = rawProps.startDate;
  }

  getValidationRules() {
    const isoDate = JoiValidationConstants.ISO_DATE;
    const emptyOrIsoDate = joi
      .alternatives()
      .try(joi.string().valid(''), isoDate);

    return {
      endDate: joi
        .alternatives()
        .conditional('startDate', {
          is: isoDate,
          otherwise: emptyOrIsoDate,
          then: joi
            .alternatives()
            .try(joi.string().valid(''), isoDate.min(joi.ref('startDate'))),
        })
        .messages({
          '*': 'Enter date in format MM/DD/YYYY.',
          'date.min': 'End date cannot be prior to start date.',
        })
        .description(
          'The end date search filter must be of valid date format and greater than or equal to the start date',
        ),
      startDate: emptyOrIsoDate
        .description(
          'The start date to search by, which cannot be greater than the current date, and is required when there is an end date provided',
        )
        .messages({
          '*': 'Enter date in format MM/DD/YYYY.',
        }),
    };
  }
}

export type RawTrialSessionsPageValidation =
  ExcludeMethods<TrialSessionsPageValidation>;
