import {
  // <<<<<<< HEAD
  IrsPractitioner,
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
// =======
//   entityName as irsPractitionerEntityName,
//   IrsPractitioner,
// } from '../entities/IrsPractitioner';
// import {
//   entityName as practitionerEntityName,
//   Practitioner,
// } from '../entities/Practitioner';
// import {
//   entityName as privatePractitionerEntityName,
//   PrivatePractitioner,
// } from '../entities/PrivatePractitioner';
// import { NotFoundError } from '../../errors/errors';
// >>>>>>> 9c85711760d2913d6ef83ad7dfa9d23edd18a71a
import { User } from '../entities/User';

/**
 * getUserInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {User} the retrieved user
 */

export const getUserInteractor = async (
  applicationContext: IApplicationContext,
): Promise<TUser | TPractitioner> => {
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
