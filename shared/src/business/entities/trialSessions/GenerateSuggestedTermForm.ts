import joi from 'joi';
import { GenerateSuggestedTermModal } from '@shared/business/entities/trialSessions/GenerateSuggestedTermModal';

export class GenerateSuggestedTermForm extends GenerateSuggestedTermModal {
  public maxSessionsPerLocation: number;
  public maxSessionsPerWeek: number;
  public smallCaseMinimumQuantity: number;
  public smallCaseMaxQuantity: number;
  public regularCaseMinimumQuantity: number;
  public regularCaseMaxQuantity: number;
  public hybridCaseMinimumQuantity: number;
  public hybridCaseMaxQuantity: number;

  constructor(rawProps: any) {
    super(rawProps, 'GenerateSuggestedTermForm');
    this.maxSessionsPerLocation = rawProps.maxSessionsPerLocation;
    this.maxSessionsPerWeek = rawProps.maxSessionsPerWeek;
    this.smallCaseMinimumQuantity = rawProps.smallCaseMinimumQuantity;
    this.smallCaseMaxQuantity = rawProps.smallCaseMaxQuantity;
    this.regularCaseMinimumQuantity = rawProps.regularCaseMinimumQuantity;
    this.regularCaseMaxQuantity = rawProps.regularCaseMaxQuantity;
    this.hybridCaseMinimumQuantity = rawProps.hybridCaseMinimumQuantity;
    this.hybridCaseMaxQuantity = rawProps.hybridCaseMaxQuantity;
  }

  getValidationRules() {
    return {
      ...GenerateSuggestedTermModal.VALIDATION_RULES,
      maxSessionsPerLocation: joi
        .number()
        .integer()
        .min(0)
        .required()
        .messages({
          'number.base': 'Max sessions per location must be a number.',
          'number.integer': 'Max sessions per location must be a whole number.',
          'number.min': 'Max sessions per location cannot be negative.',
          '*': 'Max sessions per location is required',
        }),
      maxSessionsPerWeek: joi.number().integer().min(0).required().messages({
        'number.base': 'Max sessions per week must be a number.',
        'number.integer': 'Max sessions per week must be a whole number.',
        'number.min': 'Max sessions per week cannot be negative.',
        '*': 'Max sessions per week is required',
      }),
      smallCaseMinimumQuantity: joi
        .number()
        .integer()
        .min(0)
        .required()
        .messages({
          'number.base': 'Small case minimum quantity must be a number.',
          'number.integer':
            'Small case minimum quantity must be a whole number.',
          'number.min': 'Small case minimum quantity cannot be negative.',
          '*': 'Small case minimum quantity is required',
        }),
      smallCaseMaxQuantity: joi
        .number()
        .integer()
        .min(joi.ref('smallCaseMinimumQuantity'))
        .required()
        .messages({
          'number.base': 'Small case max quantity must be a number.',
          'number.integer': 'Small case max quantity must be a whole number.',
          'number.min':
            'Small case max quantity must be greater than or equal to the Small case minimum quantity.',
          '*': 'Small case max quantity is required',
        }),
      regularCaseMinimumQuantity: joi
        .number()
        .integer()
        .min(0)
        .required()
        .messages({
          'number.base': 'Regular case minimum quantity must be a number.',
          'number.integer':
            'Regular case minimum quantity must be a whole number.',
          'number.min': 'Regular case minimum quantity cannot be negative.',
          '*': 'Regular case minimum quantity is required',
        }),
      regularCaseMaxQuantity: joi
        .number()
        .integer()
        .min(joi.ref('regularCaseMinimumQuantity'))
        .required()
        .messages({
          'number.base': 'Regular case max quantity must be a number.',
          'number.integer': 'Regular case max quantity must be a whole number.',
          'number.min':
            'Regular case max quantity must be greater than or equal to the Regular case minimum quantity.',
          '*': 'Regular case max quantity is required',
        }),
      hybridCaseMinimumQuantity: joi
        .number()
        .integer()
        .min(0)
        .required()
        .messages({
          'number.base': 'Hybrid case minimum quantity must be a number.',
          'number.integer':
            'Hybrid case minimum quantity must be a whole number.',
          'number.min': 'Hybrid case minimum quantity cannot be negative.',
          '*': 'Hybrid case minimum quantity is required',
        }),
      hybridCaseMaxQuantity: joi
        .number()
        .integer()
        .min(joi.ref('hybridCaseMinimumQuantity'))
        .required()
        .messages({
          'number.base': 'Hybrid case max quantity must be a number.',
          'number.integer': 'Hybrid case max quantity must be a whole number.',
          'number.min':
            'Hybrid case max quantity must be greater than or equal to the Hybrid case minimum quantity.',
          '*': 'Hybrid case max quantity is required',
        }),
    };
  }
}

export type RawGenerateSuggestedTermForm = ExcludeMethods<
  Omit<GenerateSuggestedTermForm, 'entityName'>
>;
