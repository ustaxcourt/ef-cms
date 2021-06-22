const {
  INITIAL_DOCUMENT_TYPES,
  ROLES,
} = require('../entities/EntityConstants');

/**
 *
 * @param {object} applicationContext the applicationContext
 * @param {object} caseEntity the case entity
 * @param {string} initialDocumentTypeKey the initialDocumentTypeKey
 */

const serveCaseDocument = async ({
  applicationContext,
  caseEntity,
  initialDocumentTypeKey,
}) => {
  const initialDocumentType = INITIAL_DOCUMENT_TYPES[initialDocumentTypeKey];

  const initialDocketEntry = caseEntity.docketEntries.find(
    doc => doc.documentType === initialDocumentType.documentType,
  );

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

module.exports = {
  serveCaseDocument,
};
