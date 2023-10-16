import { Case } from './Case';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';
import joi from 'joi';

export class CaseQC extends Case {
  constructor(rawCase, { applicationContext, filtered = false }) {
    super(rawCase, {
      applicationContext,
      filtered,
    });
    this.entityName = 'CaseQC';
  }

  static VALIDATION_ERROR_MESSAGES = {
    ...Case.VALIDATION_ERROR_MESSAGES,
    hasVerifiedIrsNotice: 'Select an option',
  };

  getErrorToMessageMap() {
    return CaseQC.VALIDATION_ERROR_MESSAGES;
  }

  getValidationRules() {
    return {
      ...super.getValidationRules(),
      entityName: JoiValidationConstants.STRING.valid('CaseQC').required(),
      hasVerifiedIrsNotice: joi
        .boolean()
        .required()
        .description(
          'Whether the petitioner received an IRS notice, verified by the petitions clerk.',
        ),
    };
  }

  getValidationRules_NEW() {
    return {
      ...super.getValidationRules_NEW(),
      entityName: JoiValidationConstants.STRING.valid('CaseQC').required(),
      hasVerifiedIrsNotice: joi
        .boolean()
        .required()
        .description(
          'Whether the petitioner received an IRS notice, verified by the petitions clerk.',
        )
        .messages(setDefaultErrorMessage('Select an option')),
    };
  }
}
