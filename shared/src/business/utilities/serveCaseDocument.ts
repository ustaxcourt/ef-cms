import { Case } from '@shared/business/entities/cases/Case';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { INITIAL_DOCUMENT_TYPES, ROLES } from '../entities/EntityConstants';
import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const serveCaseDocument = async ({
  applicationContext,
  caseEntity,
  initialDocumentTypeKey,
  authorizedUser,
}: {
  applicationContext: ServerApplicationContext;
  caseEntity: Case;
  initialDocumentTypeKey: string;
  authorizedUser: AuthUser;
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
      await serveDocument({
        docketEntry,
        caseEntity,
        applicationContext,
        authorizedUser,
      });
    }
  } else {
    const docketEntry = caseEntity.docketEntries.find(
      doc => doc.documentType === documentType.documentType,
    );

    await serveDocument({
      docketEntry,
      caseEntity,
      applicationContext,
      authorizedUser,
    });
  }
};

async function serveDocument({
  docketEntry,
  caseEntity,
  applicationContext,
  authorizedUser,
}: {
  docketEntry?: RawDocketEntry;
  caseEntity: Case;
  applicationContext: ServerApplicationContext;
  authorizedUser: AuthUser;
}) {
  if (
    docketEntry &&
    !DocketEntry.isUnservable(docketEntry) &&
    docketEntry.isFileAttached
  ) {
    const docketEntryEntity = new DocketEntry(docketEntry, { authorizedUser });
    docketEntryEntity.setAsServed([
      {
        name: 'IRS',
        role: ROLES.irsSuperuser,
      },
    ]);
    caseEntity.updateDocketEntry(docketEntryEntity);

    if (
      docketEntryEntity.documentType ===
      INITIAL_DOCUMENT_TYPES.petition.documentType
    ) {
      await applicationContext
        .getUseCaseHelpers()
        .sendIrsSuperuserPetitionEmail({
          applicationContext,
          caseEntity,
          docketEntryId: docketEntryEntity.docketEntryId,
        });
    } else {
      await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
        applicationContext,
        caseEntity,
        docketEntryId: docketEntryEntity.docketEntryId,
        servedParties: {
          // IRS superuser is served every document by default, so we don't need to explicitly include them as a party here
          electronic: [],
          all: [],
          paper: [],
        },
      });
    }
  }
}
