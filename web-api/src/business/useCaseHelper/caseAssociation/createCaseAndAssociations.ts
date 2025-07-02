import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { Case } from '@shared/business/entities/cases/Case';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { PrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { createCase } from '@web-api/persistence/postgres/cases/createCase';
import { upsertDocketEntries } from '@web-api/persistence/postgres/docketEntries/upsertDocketEntries';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { upsertUserOnCaseRecords } from '@web-api/persistence/postgres/users/cases/upsertUserOnCaseRecords';
import { Contact } from '@shared/business/entities/contacts/Contact';

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

const connectIrsPractitioners = async ({ docketNumber, irsPractitioners }) => {
  const validIrsPractitioners =
    IrsPractitioner.validateRawCollection(irsPractitioners);

  await upsertUserOnCaseRecords(
    validIrsPractitioners.map(irs => ({
      docketNumber,
      userId: irs.userId,
      serviceIndicator: irs.serviceIndicator,
    })),
  );
};

const connectPrivatePractitioners = async ({
  docketNumber,
  privatePractitioners,
}) => {
  const validPrivatePractitioners =
    PrivatePractitioner.validateRawCollection(privatePractitioners);

  await upsertUserOnCaseRecords(
    validPrivatePractitioners.map(privatePractitioner => ({
      docketNumber,
      userId: privatePractitioner.userId,
      serviceIndicator: privatePractitioner.serviceIndicator,
      representing: privatePractitioner.representing,
    })),
  );
};

const connectPetitioners = async ({
  docketNumber,
  petitioners,
}: {
  docketNumber: string;
  petitioners: Contact[];
}) => {
  await upsertUserOnCaseRecords(
    petitioners.map(petitioner => ({
      docketNumber,
      userId: petitioner.contactId,
      serviceIndicator: petitioner.serviceIndicator,
    })),
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
    petitioners,
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
    connectIrsPractitioners({
      docketNumber,
      irsPractitioners,
    }),
    connectPrivatePractitioners({
      docketNumber,
      privatePractitioners,
    }),
    connectPetitioners({
      docketNumber,
      petitioners,
    }),
  ];

  return await settlePromises(requests);
};
