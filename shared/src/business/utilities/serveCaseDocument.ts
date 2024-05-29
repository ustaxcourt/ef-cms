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
  const documentType = INITIAL_DOCUMENT_TYPES[initialDocumentTypeKey];

  if (
    documentType.eventCode ===
    INITIAL_DOCUMENT_TYPES.attachmentToPetition.eventCode
  ) {
    const docketEntriesByDocumentType = caseEntity.docketEntries.filter(
      doc => doc.documentType === documentType.documentType,
    );

    for (const docketEntry of docketEntriesByDocumentType) {
      await serveDocument(docketEntry, caseEntity, applicationContext);
    }
  } else {
    const docketEntry = caseEntity.docketEntries.find(
      doc => doc.documentType === documentType.documentType,
    );
    await serveDocument(docketEntry, caseEntity, applicationContext);
  }
};

async function serveDocument(docketEntry, caseEntity, applicationContext) {
  if (
    docketEntry &&
    !DocketEntry.isUnservable(docketEntry) &&
    docketEntry.isFileAttached
  ) {
    docketEntry.setAsServed([
      {
        name: 'IRS',
        role: ROLES.irsSuperuser,
      },
    ]);
    caseEntity.updateDocketEntry(docketEntry);

    if (
      docketEntry.documentType === INITIAL_DOCUMENT_TYPES.petition.documentType
    ) {
      await applicationContext
        .getUseCaseHelpers()
        .sendIrsSuperuserPetitionEmail({
          applicationContext,
          caseEntity,
          docketEntryId: docketEntry.docketEntryId,
        });
    } else {
      await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
        applicationContext,
        caseEntity,
        docketEntryId: docketEntry.docketEntryId,
        servedParties: {
          // IRS superuser is served every document by default, so we don't need to explicitly include them as a party here
          electronic: [],
        },
      });
    }
  }
}
