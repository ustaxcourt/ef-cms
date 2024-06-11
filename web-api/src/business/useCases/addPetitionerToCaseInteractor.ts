import { CASE_STATUS_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { Petitioner } from '../../../../shared/src/business/entities/contacts/Petitioner';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { withLocking } from '@web-api/business/useCaseHelper/acquireLock';

/**
 * used to add a petitioner to a case
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.contact the contact data to add to the case
 * @param {string} providers.docketNumber the docket number of the case
 * @returns {object} the case data
 */
export const addPetitionerToCase = async (
  applicationContext: ServerApplicationContext,
  {
    caseCaption,
    contact,
    docketNumber,
  }: { caseCaption: string; contact: any; docketNumber: string },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ADD_PETITIONER_TO_CASE)) {
    throw new UnauthorizedError('Unauthorized for adding petitioner to case');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  if (caseEntity.status === CASE_STATUS_TYPES.new) {
    throw new Error(
      `Case with docketNumber ${docketNumber} has not been served`,
    );
  }

  caseEntity.caseCaption = caseCaption;

  const petitionerEntity = new Petitioner(contact, {
    applicationContext,
  });

  caseEntity.addPetitioner(petitionerEntity);

  const updatedCase = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });

  return new Case(updatedCase, { applicationContext }).validate().toRawObject();
};

export const addPetitionerToCaseInteractor = withLocking(
  addPetitionerToCase,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
