const { asUserFromEmail } = require('../createUsers');

module.exports.createCase1 = async () => {
  let caseDetail;

  await asUserFromEmail('petitioner', async applicationContext => {
    caseDetail = await applicationContext
      .getUseCases()
      .createCaseInteractor({
        applicationContext,
        petitionFileId: '1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
        petitionMetadata: {
          "caseType": "Whistleblower",
          "contactPrimary": {
            "address3": "Architecto assumenda",
            "address2": "Suscipit animi solu",
            "city": "Aspernatur nostrum s",
            "phone": "+1 (537) 235-6147",
            "address1": "68 Fabien Freeway",
            "postalCode": "89499",
            "name": "Brett Osborne",
            "state": "AS",
            "countryType": "domestic",
            "email": "petitioner"
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

    await Promise.all(caseDetail.documents.map(addCoversheet));
  });

  await asUserFromEmail('docketclerk', async applicationContext => {

    const { caseId, docketNumber } = caseDetail;

    const documentMetadata = {
      "documentTitle": "Order of Dismissal for Lack of Jurisdiction",
      "documentType": "Order of Dismissal for Lack of Jurisdiction",
      "eventCode": "ODJ",
      "richText": "<p>Testing</p>",
      caseId,
      docketNumber,
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
};
