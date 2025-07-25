import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { Case } from '@shared/business/entities/cases/Case';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { PrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { createCase } from '@web-api/persistence/postgres/cases/createCase';
import { upsertDocketEntries } from '@web-api/persistence/postgres/docketEntries/upsertDocketEntries';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { Contact } from '@shared/business/entities/contacts/Contact';
import { associateUsersWithCases } from '@web-api/persistence/postgres/cases/userOnCase/associateUsersWithCases';
import { ROLES } from '@shared/business/entities/EntityConstants';

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

  await associateUsersWithCases(
    validIrsPractitioners.map(irs => ({
      docketNumber,
      userId: irs.userId,
      serviceIndicator: irs.serviceIndicator,
      actingAsRole: ROLES.irsPractitioner,
    })),
  );
};

const connectPrivatePractitioners = async ({
  docketNumber,
  privatePractitioners,
}) => {
  const validPrivatePractitioners =
    PrivatePractitioner.validateRawCollection(privatePractitioners);

  await associateUsersWithCases(
    validPrivatePractitioners.map(privatePractitioner => ({
      docketNumber,
      userId: privatePractitioner.userId,
      serviceIndicator: privatePractitioner.serviceIndicator,
      representing: privatePractitioner.representing,
      actingAsRole: ROLES.privatePractitioner,
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
  await associateUsersWithCases(
    petitioners.map(petitioner => ({
      docketNumber,
      userId: petitioner.contactId,
      serviceIndicator: petitioner.serviceIndicator,
      actingAsRole: ROLES.petitioner,
    })),
  );
};

export const createCaseAndAssociations = async ({
  authorizedUser,
  caseToCreate,
}: {
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
