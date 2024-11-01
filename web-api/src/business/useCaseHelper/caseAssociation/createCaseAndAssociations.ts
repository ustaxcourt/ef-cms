import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import { DocketEntry } from '../../../../../shared/src/business/entities/DocketEntry';
import { IrsPractitioner } from '../../../../../shared/src/business/entities/IrsPractitioner';
import { PrivatePractitioner } from '../../../../../shared/src/business/entities/PrivatePractitioner';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { upsertCase } from '@web-api/persistence/postgres/cases/upsertCase';

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
  docketNumber: any;
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
    applicationContext.getPersistenceGateway().createCase({
      applicationContext,
      caseToCreate,
    }),
    upsertCase({ rawCase: caseToCreate }),
    ...createCaseDocketEntries({
      applicationContext,
      authorizedUser,
      docketEntries,
      docketNumber,
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
