import { JoiValidationConstants } from '@shared/business/entities/JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import joi from 'joi';

export class GenerateSuggestedTermForm extends JoiValidationEntity {
  public termStartDate: string;
  public termEndDate: string;
  public termName: string;
  public maxSessionsPerLocation: number;
  public maxSessionsPerWeek: number;
  public smallCaseMinimumQuantity: number;
  public smallCaseMaxQuantity: number;
  public regularCaseMinimumQuantity: number;
  public regularCaseMaxQuantity: number;
  public hybridCaseMinimumQuantity: number;
  public hybridCaseMaxQuantity: number;
  public minimumCasesPerLocation: number;

  constructor(rawProps: any) {
    super('GenerateSuggestedTermForm');
    this.termStartDate = rawProps.termStartDate;
    this.termEndDate = rawProps.termEndDate;
    this.termName = rawProps.termName;

    this.maxSessionsPerLocation = rawProps.maxSessionsPerLocation;
    this.maxSessionsPerWeek = rawProps.maxSessionsPerWeek;
    this.smallCaseMinimumQuantity = rawProps.smallCaseMinimumQuantity;
    this.smallCaseMaxQuantity = rawProps.smallCaseMaxQuantity;
    this.regularCaseMinimumQuantity = rawProps.regularCaseMinimumQuantity;
    this.regularCaseMaxQuantity = rawProps.regularCaseMaxQuantity;
    this.hybridCaseMinimumQuantity = rawProps.hybridCaseMinimumQuantity;
    this.hybridCaseMaxQuantity = rawProps.hybridCaseMaxQuantity;
    this.minimumCasesPerLocation = rawProps.minimumCasesPerLocation;
  }

  getValidationRules() {
    return {
      termEndDate: JoiValidationConstants.DATE_RANGE_PICKER_DATE.min(
        joi.ref('termStartDate'),
      )
        .greater('now')
        .required()
        .messages({
          '*': 'Enter date in format MM/DD/YYYY.',
          'any.ref': 'Enter a start date',
          'date.greater': 'End date cannot be in the past. Enter a valid date.',
          'date.min':
            'End date cannot be prior to start date. Enter a valid end date.',
        }),
      termName: JoiValidationConstants.STRING.required()
        .max(100)
        .description('The name of the term being created.')
        .messages({
          '*': 'Enter a term name',
          'string.max': 'Term name must be 100 characters or fewer.',
        }),
      termStartDate: JoiValidationConstants.DATE_RANGE_PICKER_DATE.greater(
        'now',
      )
        .required()
        .messages({
          '*': 'Enter date in format MM/DD/YYYY.',
          'date.greater':
            'Start date cannot be in the past. Enter a valid date.',
        }),
    };
  }
}

export type RawGenerateSuggestedTermForm = ExcludeMethods<
  Omit<GenerateSuggestedTermForm, 'entityName'>
>;
