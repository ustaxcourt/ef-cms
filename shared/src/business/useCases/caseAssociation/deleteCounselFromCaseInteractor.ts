import { Case } from '../../entities/cases/Case';
import { ROLES } from '../../entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { aggregatePartiesForService } from '../../utilities/aggregatePartiesForService';
import { withLocking } from '@shared/business/useCaseHelper/acquireLock';

/**
 * deleteCounselFromCase
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case the user is attached to
 * @param {string} providers.userId the id of the user to be removed from the case
 * @returns {Promise} the promise of the update case call
 */
export const deleteCounselFromCase = async (
  applicationContext: IApplicationContext,
  { docketNumber, userId }: { docketNumber: string; userId: string },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.ASSOCIATE_USER_WITH_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const userToDelete = await applicationContext
    .getPersistenceGateway()
    .getUserById({
      applicationContext,
      userId,
    });

  let caseEntity = new Case(caseToUpdate, { applicationContext });

  if (userToDelete.role === ROLES.privatePractitioner) {
    caseEntity.removePrivatePractitioner(userToDelete);
  } else if (userToDelete.role === ROLES.irsPractitioner) {
    caseEntity.removeIrsPractitioner(userToDelete);
  } else {
    throw new Error('User is not a practitioner');
  }

  caseEntity = setupServiceIndicatorForUnrepresentedPetitioners(caseEntity);

  aggregatePartiesForService(caseEntity);

  await applicationContext.getPersistenceGateway().deleteUserFromCase({
    applicationContext,
    docketNumber,
    userId,
  });

  const updatedCase = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });

  return new Case(updatedCase, { applicationContext }).validate().toRawObject();
};

export const setupServiceIndicatorForUnrepresentedPetitioners = (
  caseEntity: Case,
) => {
  caseEntity.petitioners.forEach(petitioner => {
    if (!Case.isPetitionerRepresented(caseEntity, petitioner.contactId)) {
      petitioner.serviceIndicator = undefined;
    }
  });

  return caseEntity;
};

export const deleteCounselFromCaseInteractor = withLocking(
  deleteCounselFromCase,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
