import {
  IrsPractitioner,
  RawIrsPractitioner,
  entityName as irsPractitionerEntityName,
} from '../entities/IrsPractitioner';
import { NotFoundError } from '../../errors/errors';
import {
  Practitioner,
  entityName as practitionerEntityName,
} from '../entities/Practitioner';
import {
  PrivatePractitioner,
  entityName as privatePractitionerEntityName,
} from '../entities/PrivatePractitioner';
import { User } from '../entities/User';

/**
 * getUserInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {User} the retrieved user
 */

export const getUserInteractor = async (
  applicationContext: IApplicationContext,
): Promise<RawUser | RawPractitioner | RawIrsPractitioner> => {
  const authorizedUser = applicationContext.getCurrentUser();

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  if (!user) {
    throw new NotFoundError(
      `User id "${authorizedUser.userId}" not found in persistence.`,
    );
  }

  if (user.entityName === privatePractitionerEntityName) {
    return new PrivatePractitioner(user).validate().toRawObject();
  } else if (user.entityName === irsPractitionerEntityName) {
    return new IrsPractitioner(user).validate().toRawObject();
  } else if (user.entityName === practitionerEntityName) {
    return new Practitioner(user).validate().toRawObject();
  } else {
    return new User(user).validate().toRawObject();
  }
};
