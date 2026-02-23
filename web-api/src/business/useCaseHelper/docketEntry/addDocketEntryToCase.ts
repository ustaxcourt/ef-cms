import { Case } from '@shared/business/entities/cases/Case';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { SIGNED_DOCUMENT_TYPES } from '@shared/business/entities/EntityConstants';
import { getDocketEntryMetaForCase } from '@web-api/persistence/postgres/docketEntries/getDocketEntryMetaForCase';
import { updateCaseAutomaticBlock } from '@web-api/business/useCaseHelper/automaticBlock/updateCaseAutomaticBlock';
import { upsertCases } from '@web-api/persistence/postgres/cases/upsertCases';
import { upsertDocketEntries } from '@web-api/persistence/postgres/docketEntries/upsertDocketEntries';

export const addDocketEntryToCase = async ({
  caseEntity,
  docketEntryEntity,
}: {
  caseEntity: Case;
  docketEntryEntity: DocketEntry;
}) => {
  const meta = await getDocketEntryMetaForCase(caseEntity.docketNumber);

  caseEntity.addDocketEntry(docketEntryEntity, {
    nextIndex: meta.nextDocketEntryIndex,
    petitionServedAt: meta.petitionServedAt,
  });

  const hasPendingItems =
    meta.hasPendingDocketEntries || DocketEntry.isPending(docketEntryEntity);
  const hasDocketedStipDecision =
    meta.hasDocketedStipDecision ||
    (docketEntryEntity.eventCode ===
      SIGNED_DOCUMENT_TYPES.signedStipulatedDecision.eventCode &&
      docketEntryEntity.isOnDocketRecord);

  await updateCaseAutomaticBlock({
    caseEntity,
    hasDocketedStipDecision,
    hasPendingItems,
  });

  const rawCase = caseEntity.toRawObject({ processPendingItems: false });
  rawCase.hasPendingItems = hasPendingItems;

  await Promise.all([
    upsertDocketEntries([docketEntryEntity.validate().toRawObject()]),
    upsertCases([rawCase]),
  ]);
};
