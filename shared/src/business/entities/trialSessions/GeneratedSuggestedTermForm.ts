import { JoiValidationConstants } from '@shared/business/entities/JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import joi from 'joi';

export class GenerateSuggestedTermForm extends JoiValidationEntity {
  public termStartDate: string;
  public termEndDate: string;
  public termName: string;

  constructor(rawProps) {
    super('GenerateSuggestTermForm');
    this.termStartDate = rawProps.termStartDate;
    this.termEndDate = rawProps.termEndDate;
    this.termName = rawProps.termName;
  }

  getValidationRules() {
    return {
      termEndDate: JoiValidationConstants.DATE_RANGE_PICKER_DATE.min(
        joi.ref('termStartDate'),
      ).messages({
        '*': 'Enter date in format MM/DD/YYYY.',
        'date.min':
          'End date cannot be prior to start date. Enter a valid end date.',
      }),
      termName: JoiValidationConstants.STRING.min(1)
        .max(100)
        .description('The name of the term being created.')
        .messages({
          '*': 'Enter a term name',
          'termName.max': 'Term name must be 100 characters or fewer',
        }),
      termStartDate: JoiValidationConstants.DATE_RANGE_PICKER_DATE.greater(
        'now',
      ).messages({
        '*': 'Enter date in format MM/DD/YYYY.',
        'date.min': 'Start date cannot be in the past. Enter a valid date.',
      }),
    };
  }
}
