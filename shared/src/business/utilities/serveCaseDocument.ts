import { Case } from '../entities/cases/Case';
import { INITIAL_DOCUMENT_TYPES, ROLES } from '../entities/EntityConstants';

/**
 *
 * @param {object} applicationContext the applicationContext
 * @param {object} caseEntity the case entity
 * @param {string} initialDocumentTypeKey the initialDocumentTypeKey
 */

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

  const initialDocketEntries = caseEntity.docketEntries.filter(
    doc => doc.documentType === initialDocumentType.documentType,
  );

  // todo: evaluate the impact of using a map to make this calls.
  // We can isolate the check for ATPs and only loop when ATP documents are being "serviced"
  const documentServiceCalls = initialDocketEntries.map(initialDocketEntry => {
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
  });

  try {
    await Promise.all(documentServiceCalls);
  } catch (e) {
    applicationContext.logger.error(
      'Error sending service case documents to IRS',
      e,
    );
  }
};
