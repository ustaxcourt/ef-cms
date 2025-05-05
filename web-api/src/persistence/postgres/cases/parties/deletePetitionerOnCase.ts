import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { Case } from '@shared/business/entities/cases/Case';
import { getCaseMetadataByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseMetadataByDocketNumber';
import { upsertCases } from '@web-api/persistence/postgres/cases/upsertCases';

export const deletePetitionerOnCase = async ({
  contactId,
  docketNumber,
  authorizedUser,
}: {
  contactId: string;
  docketNumber: string;
  authorizedUser: AuthUser;
}): Promise<void> => {
  const theCase = await getCaseMetadataByDocketNumber({ docketNumber });
  const caseEntity = new Case(theCase, { authorizedUser });
  caseEntity.removePetitioner(contactId);
  const updatedCase = caseEntity.validate().toRawObject();
  await upsertCases([updatedCase]);
};
