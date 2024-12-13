import {
  Practitioner,
  RawPractitioner,
} from '@shared/business/entities/Practitioner';
import { ROLES } from '@shared/business/entities/EntityConstants';
import { RawUser, User } from '@shared/business/entities/User';

export class UserFactory {
  private rawUser: RawUser | RawPractitioner;

  constructor(rawUser: RawUser | RawPractitioner) {
    this.rawUser = rawUser;
  }

  public getClass(): typeof User | typeof Practitioner {
    if (
      this.rawUser.role === ROLES.privatePractitioner ||
      this.rawUser.role === ROLES.irsPractitioner ||
      this.rawUser.role === ROLES.inactivePractitioner
    ) {
      return Practitioner;
    }

    return User;
  }
}
