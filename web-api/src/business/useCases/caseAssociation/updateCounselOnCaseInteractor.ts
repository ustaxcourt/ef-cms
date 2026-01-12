import { Case } from '@shared/business/entities/cases/Case';
import {
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '@shared/business/entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';

/**
 * updateCounselOnCase
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case the user is attached to
 * @param {object} providers.userData the data being updated on the user
 * @param {string} providers.userId the id of the user to be updated on the case
 * @returns {Promise} the promise of the update case call
 */
const updateCounselOnCase = async (
  _applicationContext: ServerApplicationContext,
  {
    docketNumber,
    userData,
    userId,
  }: { docketNumber: string; userData: any; userId: string },
  authorizedUser: UnknownAuthUser,
): Promise<RawCase> => {
  const editableFields = {
    representing: userData.representing,
    serviceIndicator: userData.serviceIndicator,
  };

  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.ASSOCIATE_USER_WITH_CASE)
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToUpdate = await getCaseByDocketNumber({
    docketNumber,
  });

  const userToUpdate = await getUserById({
    userId,
  });

  if (!userToUpdate) {
    throw new NotFoundError(`Could not find user ${userId}`);
  }

  const caseEntity = new Case(caseToUpdate, { authorizedUser });

  if (userToUpdate.role === ROLES.privatePractitioner) {
    caseEntity.updatePrivatePractitioner({
      userId,
      ...editableFields,
    });

    caseEntity.petitioners.map(petitioner => {
      if (editableFields.representing.includes(petitioner.contactId)) {
        petitioner.serviceIndicator = SERVICE_INDICATOR_TYPES.SI_NONE;
      } else if (
        !Case.isPetitionerRepresented(caseEntity, petitioner.contactId)
      ) {
        const serviceIsPaper = !petitioner.email;
        petitioner.serviceIndicator = serviceIsPaper
          ? SERVICE_INDICATOR_TYPES.SI_PAPER
          : SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;
      }
    });
  } else if (userToUpdate.role === ROLES.irsPractitioner) {
    caseEntity.updateIrsPractitioner({
      serviceIndicator: editableFields.serviceIndicator,
      userId,
    });
  } else {
    throw new Error('User is not a practitioner');
  }

  const updatedCase = await updateCaseAndAssociations({
    authorizedUser,
    caseToUpdate: caseEntity,
  });

  return new Case(updatedCase, { authorizedUser }).validate().toRawObject();
};

export const updateCounselOnCaseInteractor = withLocking(
  updateCounselOnCase,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
