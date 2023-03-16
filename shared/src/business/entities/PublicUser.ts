import { ROLES } from './EntityConstants';
import { User } from './User';

/**
 * constructor
 *
 * @param {object} rawUser the raw user data
 * @constructor
 */
export class PublicUser extends User {
  constructor(rawUser, options?) {
    super(rawUser, options);
    this.entityName = 'PublicUser';
    this.name = rawUser.name;
    this.role = rawUser.role;
    if (this.role === ROLES.judge || this.role === ROLES.legacyJudge) {
      this.judgeFullName = rawUser.judgeFullName;
      this.judgeTitle = rawUser.judgeTitle;
    }
  }

  getErrorToMessageMap() {
    return {
      role: 'Role is required',
    } as any;
  }
}
