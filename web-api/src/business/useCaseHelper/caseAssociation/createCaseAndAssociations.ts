import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { Case } from '@shared/business/entities/cases/Case';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { PrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { createCase } from '@web-api/persistence/postgres/cases/createCase';
import { associateUserWithCase } from '@web-api/persistence/postgres/users/cases/associateUserWithCase';

/**
 * createCaseDocketEntries
 *
 * @param {object} providers the providers object
 * @param {Array<object>} providers.docketEntries a list of docket entries
 * @param {object} providers.docketNumber the docket number
 * @returns {Array<Promise>} promises which resolve upon creation of all docket entries
 */
const createCaseDocketEntries = ({
  applicationContext,
  authorizedUser,
  docketEntries,
  docketNumber,
  petitioners,
}: {
  applicationContext: ServerApplicationContext;
  authorizedUser: AuthUser;
  docketEntries: any;
  docketNumber: string;
  petitioners: any;
}) => {
  const validDocketEntries = DocketEntry.validateRawCollection(docketEntries, {
    authorizedUser,
    petitioners,
  });

  return validDocketEntries.map(doc =>
    applicationContext.getPersistenceGateway().updateDocketEntry({
      applicationContext,
      docketEntryId: doc.docketEntryId,
      docketNumber,
      document: doc,
    }),
  );
};

const connectIrsPractitioners = ({ docketNumber, irsPractitioners }) => {
  const validIrsPractitioners =
    IrsPractitioner.validateRawCollection(irsPractitioners);

  return validIrsPractitioners.map(
    async practitioner =>
      await associateUserWithCase({
        docketNumber,
        userId: practitioner.userId,
      }),
  );
};

const connectPrivatePractitioners = ({
  docketNumber,
  privatePractitioners,
}) => {
  const validPrivatePractitioners =
    PrivatePractitioner.validateRawCollection(privatePractitioners);

  return validPrivatePractitioners.map(
    async practitioner =>
      await associateUserWithCase({
        docketNumber,
        userId: practitioner.userId,
      }),
  );
};

/**
 * createCaseAndAssociations
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseToCreate the case object to be created
 * @returns {Promise} which resolves when case and associations have been created
 */
export const createCaseAndAssociations = async ({
  applicationContext,
  authorizedUser,
  caseToCreate,
}: {
  applicationContext: ServerApplicationContext;
  authorizedUser: AuthUser;
  caseToCreate: any;
}) => {
  const caseEntity = caseToCreate.validate
    ? caseToCreate
    : new Case(caseToCreate, {
        authorizedUser,
      });

  const validRawCaseEntity = caseEntity.validate().toRawObject();

  const {
    docketEntries,
    docketNumber,
    irsPractitioners,
    privatePractitioners,
  } = validRawCaseEntity;

  const requests = [
    createCase({
      caseToCreate,
    }),
    ...createCaseDocketEntries({
      applicationContext,
      authorizedUser,
      docketEntries,
      docketNumber,
      petitioners: caseToCreate.petitioners,
    }),
    ...connectIrsPractitioners({
      docketNumber,
      irsPractitioners,
    }),
    ...connectPrivatePractitioners({
      docketNumber,
      privatePractitioners,
    }),
  ];

  return await Promise.all(requests);
};
