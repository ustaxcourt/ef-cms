import { JoiValidationConstants } from '@shared/business/entities/JoiValidationConstants';
import { JoiValidationEntity_New } from '@shared/business/entities/joiValidationEntity/JoiValidationEntity_New';
import { ROLES } from './EntityConstants';
import { User } from './User';

/**
 * constructor
 *
 * @param {object} rawUser the raw user data
 * @constructor
 */
export class PublicUser extends JoiValidationEntity_New {
  public name: string;
  public role: string;
  public judgeFullName?: string;
  public judgeTitle?: string;

  constructor(rawUser) {
    super('PublicUser');
    this.name = rawUser.name;
    this.role = rawUser.role;
    if (this.role === ROLES.judge || this.role === ROLES.legacyJudge) {
      this.judgeFullName = rawUser.judgeFullName;
      this.judgeTitle = rawUser.judgeTitle;
    }
  }

  getValidationRules() {
    return {
      ...User.BASE_USER_VALIDATION,
      name: JoiValidationConstants.STRING.max(100).required(),
      role: User.BASE_USER_VALIDATION.role.messages({
        '*': 'Role is required',
      }),
    };
  }
}
