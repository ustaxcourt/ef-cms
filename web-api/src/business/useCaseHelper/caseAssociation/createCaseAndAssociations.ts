import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { Case } from '@shared/business/entities/cases/Case';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { PrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { createCase } from '@web-api/persistence/postgres/cases/createCase';
import { upsertDocketEntries } from '@web-api/persistence/postgres/docketEntries/upsertDocketEntries';

const createCaseDocketEntries = async ({
  authorizedUser,
  docketEntries,
  petitioners,
}: {
  authorizedUser: AuthUser;
  docketEntries: any;
  petitioners: any;
}) => {
  const validDocketEntries = DocketEntry.validateRawCollection(docketEntries, {
    authorizedUser,
    petitioners,
  });

  await upsertDocketEntries(validDocketEntries);
};

/**
 * connectIrsPractitioners
 *
 * @param {object} providers the providers object
 * @param {object} providers.docketNumber the docket number
 * @param {Array<object>} providers.irsPractitioners a list of IRS practitioners
 * @returns {Array<Promise>} promises which resolve upon creation of all IRS practitioners for this docket number
 */
const connectIrsPractitioners = ({
  applicationContext,
  docketNumber,
  irsPractitioners,
}) => {
  const validIrsPractitioners =
    IrsPractitioner.validateRawCollection(irsPractitioners);

  return validIrsPractitioners.map(practitioner =>
    applicationContext.getPersistenceGateway().updateIrsPractitionerOnCase({
      applicationContext,
      docketNumber,
      practitioner,
      userId: practitioner.userId,
    }),
  );
};

/**
 * connectPrivatePractitioners
 *
 * @param {object} providers the providers object
 * @param {object} providers.docketNumber the docket number
 * @param {Array<object>} providers.privatePractitioners a list of private practitioners
 * @returns {Array<Promise>} promises which resolve upon creation of all private practitioners for this docket number
 */
const connectPrivatePractitioners = ({
  applicationContext,
  docketNumber,
  privatePractitioners,
}) => {
  const validPrivatePractitioners =
    PrivatePractitioner.validateRawCollection(privatePractitioners);

  return validPrivatePractitioners.map(practitioner =>
    applicationContext.getPersistenceGateway().updatePrivatePractitionerOnCase({
      applicationContext,
      docketNumber,
      practitioner,
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
    createCaseDocketEntries({
      authorizedUser,
      docketEntries,
      petitioners: caseToCreate.petitioners,
    }),
    ...connectIrsPractitioners({
      applicationContext,
      docketNumber,
      irsPractitioners,
    }),
    ...connectPrivatePractitioners({
      applicationContext,
      docketNumber,
      privatePractitioners,
    }),
  ];

  return await Promise.all(requests);
};
