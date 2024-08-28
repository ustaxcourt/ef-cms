import { CASE_STATUS_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { Petitioner } from '../../../../shared/src/business/entities/contacts/Petitioner';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { withLocking } from '@web-api/business/useCaseHelper/acquireLock';

export const addPetitionerToCase = async (
  applicationContext: ServerApplicationContext,
  {
    caseCaption,
    contact,
    docketNumber,
  }: { caseCaption: string; contact: any; docketNumber: string },
  authorizedUser: UnknownAuthUser,
): Promise<RawCase> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ADD_PETITIONER_TO_CASE)) {
    throw new UnauthorizedError('Unauthorized for adding petitioner to case');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseToUpdate, { authorizedUser });

  if (caseEntity.status === CASE_STATUS_TYPES.new) {
    throw new Error(
      `Case with docketNumber ${docketNumber} has not been served`,
    );
  }

  caseEntity.caseCaption = caseCaption;

  const petitionerEntity = new Petitioner(contact);

  caseEntity.addPetitioner(petitionerEntity);

  const updatedCase = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      authorizedUser,
      caseToUpdate: caseEntity,
    });

  return new Case(updatedCase, { authorizedUser }).validate().toRawObject();
};

export const addPetitionerToCaseInteractor = withLocking(
  addPetitionerToCase,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
