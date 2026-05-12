import {
  JoiValidationConstants,
  extendedJoi as joi,
} from '@shared/business/entities/JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import { createEndOfDayISO } from '@shared/business/utilities/DateHandler';

export class OpinionSearchValidation extends JoiValidationEntity {
  public startDate: string;
  public endDate: string;

  constructor(rawProps: RawOpinionSearchValidation) {
    super('OpinionSearchValidation');
    this.startDate = rawProps.startDate;
    this.endDate = rawProps.endDate;
  }

  getValidationRules() {
    const startIso = JoiValidationConstants.ISO_DATE.max('now').messages({
      '*': 'Enter date in format MM/DD/YYYY.',
      'date.max': 'Start date cannot be in the future. Enter a valid date.',
    });
    const endIsoMax = JoiValidationConstants.ISO_DATE.max(
      createEndOfDayISO(),
    ).messages({
      '*': 'Enter date in format MM/DD/YYYY.',
      'date.max': 'End date cannot be in the future. Enter a valid date.',
      'date.min':
        'End date cannot be prior to start date. Enter a valid end date.',
    });
    const emptyOrStartIso = joi
      .alternatives()
      .try(joi.string().valid(''), startIso);
    const emptyOrEndIsoMax = joi
      .alternatives()
      .try(joi.string().valid(''), endIsoMax);

    return {
      startDate: emptyOrStartIso.description(
        'The start date to search by, which cannot be greater than the current date, and is required when there is an end date provided',
      ),
      endDate: joi.alternatives().conditional('startDate', {
        is: startIso,
        otherwise: emptyOrEndIsoMax.description(
          'The end date search filter must be of valid date format',
        ),
        then: joi
          .alternatives()
          .try(
            joi.string().valid(''),
            JoiValidationConstants.ISO_DATE.max(createEndOfDayISO())
              .min(joi.ref('startDate'))
              .messages({
                '*': 'Enter date in format MM/DD/YYYY.',
                'date.max':
                  'End date cannot be in the future. Enter a valid date.',
                'date.min':
                  'End date cannot be prior to start date. Enter a valid end date.',
              }),
          )
          .description(
            'The end date search filter must be of valid date format and greater than or equal to the start date',
          ),
      }),
    };
  }
}

export type RawOpinionSearchValidation =
  ExcludeMethods<OpinionSearchValidation>;
