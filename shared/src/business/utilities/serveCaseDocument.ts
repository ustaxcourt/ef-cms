import { Case } from '@shared/business/entities/cases/Case';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { INITIAL_DOCUMENT_TYPES, ROLES } from '../entities/EntityConstants';

export const serveCaseDocument = async ({
  applicationContext,
  caseEntity,
  initialDocumentTypeKey,
}: {
  applicationContext: IApplicationContext;
  caseEntity: Case;
  initialDocumentTypeKey: string;
}) => {
  const initialDocumentType = INITIAL_DOCUMENT_TYPES[initialDocumentTypeKey];

  const initialDocketEntry = caseEntity.docketEntries.find(
    doc => doc.documentType === initialDocumentType.documentType,
  );

  if (
    initialDocketEntry &&
    !DocketEntry.isUnservable(initialDocketEntry) &&
    initialDocketEntry.isFileAttached
  ) {
    initialDocketEntry.setAsServed([
      {
        name: 'IRS',
        role: ROLES.irsSuperuser,
      },
    ]);
    caseEntity.updateDocketEntry(initialDocketEntry);

    if (
      initialDocketEntry.documentType ===
      INITIAL_DOCUMENT_TYPES.petition.documentType
    ) {
      await applicationContext
        .getUseCaseHelpers()
        .sendIrsSuperuserPetitionEmail({
          applicationContext,
          caseEntity,
          docketEntryId: initialDocketEntry.docketEntryId,
        });
    } else {
      await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
        applicationContext,
        caseEntity,
        docketEntryId: initialDocketEntry.docketEntryId,
        servedParties: {
          //IRS superuser is served every document by default, so we don't need to explicitly include them as a party here
          electronic: [],
        },
      });
    }
  }
};
