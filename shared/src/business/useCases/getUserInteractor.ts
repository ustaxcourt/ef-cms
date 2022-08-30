import {
  entityName as irsPractitionerEntityName,
  IrsPractitioner,
} from '../entities/IrsPractitioner';
import {
  entityName as practitionerEntityName,
  Practitioner,
} from '../entities/Practitioner';
import {
  entityName as privatePractitionerEntityName,
  PrivatePractitioner,
} from '../entities/PrivatePractitioner';
import { NotFoundError } from '../../errors/errors';
import { User } from '../entities/User';

/**
 * getUserInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {User} the retrieved user
 */
export const getUserInteractor = async applicationContext => {
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
