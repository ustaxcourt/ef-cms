import { Case } from '../entities/cases/Case';
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
  if (
    initialDocumentType.eventCode ===
    INITIAL_DOCUMENT_TYPES.attachmentToPetition.eventCode
  ) {
    const initialDocketEntries = caseEntity.docketEntries.filter(
      doc => doc.documentType === initialDocumentType.documentType,
    );

    const documentServiceCalls = initialDocketEntries.map(
      initialDocketEntry => {
        return serveDocuments({
          applicationContext,
          caseEntity,
          initialDocketEntry,
        });
      },
    );
    try {
      await Promise.all(documentServiceCalls);
    } catch (e) {
      applicationContext.logger.error(
        'Error sending service case documents to IRS',
        e,
      );
    }
  } else {
    const initialDocketEntry = caseEntity.docketEntries.find(
      doc => doc.documentType === initialDocumentType.documentType,
    );
    await serveDocuments({
      applicationContext,
      caseEntity,
      initialDocketEntry,
    });
  }
};

const serveDocuments = ({
  applicationContext,
  caseEntity,
  initialDocketEntry,
}: {
  applicationContext: IApplicationContext;
  caseEntity: Case;
  initialDocketEntry: DocketEntry;
}) => {
  if (initialDocketEntry && !initialDocketEntry.isMinuteEntry) {
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
      return applicationContext
        .getUseCaseHelpers()
        .sendIrsSuperuserPetitionEmail({
          applicationContext,
          caseEntity,
          docketEntryId: initialDocketEntry.docketEntryId,
        });
    } else {
      return applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
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
