const { asUserFromEmail } = require('../createUsers');

module.exports.createCase1 = async () => {
  let caseDetail;

  await asUserFromEmail('petitioner', async applicationContext => {
    caseDetail = await applicationContext.getUseCases().createCaseInteractor({
      applicationContext,
      petitionFileId: '1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
      petitionMetadata: {
        caseType: 'Whistleblower',
        contactPrimary: {
          address1: '68 Fabien Freeway',
          address2: 'Suscipit animi solu',
          address3: 'Architecto assumenda',
          city: 'Aspernatur nostrum s',
          countryType: 'domestic',
          email: 'petitioner',
          name: 'Brett Osborne',
          phone: '+1 (537) 235-6147',
          postalCode: '89499',
          state: 'AS',
        },
        filingType: 'Myself',
        hasIrsNotice: false,
        partyType: 'Petitioner',
        preferredTrialCity: 'Birmingham, Alabama',
        procedureType: 'Regular',
      },
      stinFileId: 'b1aa4aa2-c214-424c-8870-d0049c5744d8',
    });

    const addCoversheet = document => {
      return applicationContext.getUseCases().addCoversheetInteractor({
        applicationContext,
        caseId: caseDetail.caseId,
        documentId: document.documentId,
      });
    };

    for (const document of caseDetail.documents) {
      await addCoversheet(document);
    }
  });

  await asUserFromEmail('docketclerk', async applicationContext => {
    const { caseId, docketNumber } = caseDetail;

    const documentMetadata = {
      caseId,
      docketNumber,
      documentTitle: 'Order of Dismissal for Lack of Jurisdiction',
      documentType: 'Order of Dismissal for Lack of Jurisdiction',
      eventCode: 'ODJ',
      richText: '<p>Testing</p>',
    };

    documentMetadata.draftState = { ...documentMetadata };
    const documentId = '25100ec6-eeeb-4e88-872f-c99fad1fe6c7';

    caseDetail = await applicationContext
      .getUseCases()
      .fileCourtIssuedOrderInteractor({
        applicationContext,
        documentMetadata,
        primaryDocumentFileId: documentId,
      });

    await applicationContext.getUseCases().saveSignedDocumentInteractor({
      applicationContext,
      caseId,
      originalDocumentId: documentId,
      signedDocumentId: documentId,
    });
  });

  await asUserFromEmail('docketclerk', async applicationContext => {
    const { caseId, docketNumber } = caseDetail;

    const documentMetadata = {
      caseId,
      docketNumber,
      documentTitle: 'Something',
      documentType: 'MISC - Miscellaneous',
      eventCode: 'MISC',
      freeText: 'Something',
      scenario: 'Type A',
    };

    documentMetadata.draftState = { ...documentMetadata };
    const documentId = 'dd219579-9f1a-49e3-a092-f79164631ae8';

    caseDetail = await applicationContext
      .getUseCases()
      .fileCourtIssuedOrderInteractor({
        applicationContext,
        documentMetadata,
        primaryDocumentFileId: documentId,
      });
  });
};
