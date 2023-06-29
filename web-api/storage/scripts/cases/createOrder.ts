const { asUserFromEmail } = require('../createUsers');

module.exports.createOrder = async ({ docketNumber }) => {
  const createdDocketEntryId = await asUserFromEmail(
    'docketclerk@example.com',
    async applicationContext => {
      const docketEntryId = '25100ec6-eeeb-4e88-872f-c99fad1fe6c7';

      const documentMetadata = {
        attachments: false,
        docketEntryId,
        docketNumber,
        documentTitle: 'Order of Dismissal for Lack of Jurisdiction',
        documentType: 'Order of Dismissal for Lack of Jurisdiction',
        eventCode: 'ODJ',
        freeText: 'abcdef',
        generatedDocumentTitle: 'Order of Dismissal for Lack of Jurisdiction',
        judge: 'Carluzzo',
        richText: '<p>Testing</p>',
        serviceStamp: 'Served',
      };

      documentMetadata.draftOrderState = { ...documentMetadata };

      await applicationContext
        .getUseCases()
        .fileCourtIssuedOrderInteractor(applicationContext, {
          documentMetadata,
          primaryDocumentFileId: docketEntryId,
        });

      await applicationContext
        .getUseCases()
        .saveSignedDocumentInteractor(applicationContext, {
          docketNumber,
          //todo - do not hard code a judge
          nameForSigning: 'Maurice B. Foley',
          originalDocketEntryId: docketEntryId,
          signedDocketEntryId: docketEntryId,
        });

      await applicationContext
        .getUseCases()
        .fileCourtIssuedDocketEntryInteractor(applicationContext, {
          docketNumbers: [docketNumber],
          documentMeta: documentMetadata,
          subjectDocketNumber: docketNumber,
        });

      await applicationContext
        .getUseCases()
        .serveCourtIssuedDocumentInteractor(applicationContext, {
          docketEntryId,
          docketNumbers: [docketNumber],
          subjectCaseDocketNumber: docketNumber,
        });

      return docketEntryId;
    },
  );

  return createdDocketEntryId;
};
