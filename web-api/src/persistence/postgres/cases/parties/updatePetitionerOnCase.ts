import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { Case } from '@shared/business/entities/cases/Case';
import { Petitioner } from '@shared/business/entities/contacts/Petitioner';
import { getCaseMetadataByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseMetadataByDocketNumber';
import { upsertCases } from '@web-api/persistence/postgres/cases/upsertCases';

export const updatePetitionerOnCase = async ({
  docketNumber,
  petitioner,
  oldContactId,
  authorizedUser,
}: {
  docketNumber: string;
  petitioner: Petitioner;
  oldContactId?: string;
  authorizedUser: AuthUser;
}): Promise<void> => {
  const theCase = await getCaseMetadataByDocketNumber({ docketNumber });
  const caseEntity = new Case(theCase, { authorizedUser });

  const contactId = oldContactId ?? petitioner.contactId;

  if (!contactId) {
    throw new Error('Cannot update petitioner without a contactId');
  }

  // Find and replace the petitioner information on the case
  const foundIndex = caseEntity.petitioners.findIndex(
    p => p.contactId === contactId,
  );
  if (foundIndex === -1) {
    throw new Error(
      `Petitioner with contactId ${contactId} not found on case ${docketNumber}`,
    );
  }
  caseEntity.petitioners.splice(foundIndex, 1, petitioner as TPetitioner);

  const updatedCase = caseEntity.validate().toRawObject();
  await upsertCases([updatedCase]);
};
