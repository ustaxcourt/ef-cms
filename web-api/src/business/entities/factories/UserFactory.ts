import { Practitioner } from '@shared/business/entities/Practitioner';
import { ROLES, Role } from '@shared/business/entities/EntityConstants';
import { User } from '@shared/business/entities/User';

type MinimalFactoryInfo = {
  role: Role;
};

export class UserFactory {
  private rawUser: MinimalFactoryInfo;

  constructor(rawUser: MinimalFactoryInfo) {
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
