import { Case } from './Case';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import joi from 'joi';

export class CaseQC extends Case {
  constructor(
    rawCase,
    {
      authorizedUser,
      filtered = false,
    }: { authorizedUser: UnknownAuthUser; filtered?: boolean },
  ) {
    super(rawCase, {
      authorizedUser,
      filtered,
    });
    this.entityName = 'CaseQC';
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
        )
        .messages({ '*': 'Select an option for IRS Notice provided' }),
    };
  }
}
