const {
  CASE_TYPES_MAP,
  COUNTRY_TYPES,
  PARTY_TYPES,
} = require('../../../../shared/src/business/entities/EntityConstants');
const {
  getFakeFile,
} = require('../../../../shared/src/business/test/getFakeFile');
const { asUserFromEmail } = require('../createUsers');

module.exports.createCase1 = async () => {
  let caseDetail;

  await asUserFromEmail('petitioner@example.com', async applicationContext => {
    const petitionFile = getFakeFile();
    const petitionFileId = applicationContext.getUniqueId();

    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      applicationContext,
      document: petitionFile,
      documentId: petitionFileId,
    });

    const stinFile = getFakeFile();
    const stinFileId = applicationContext.getUniqueId();

    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      applicationContext,
      document: stinFile,
      documentId: stinFileId,
    });

    caseDetail = await applicationContext.getUseCases().createCaseInteractor({
      applicationContext,
      petitionFileId,
      petitionMetadata: {
        caseType: CASE_TYPES_MAP.whistleblower,
        contactPrimary: {
          address1: '68 Fabien Freeway',
          address2: 'Suscipit animi solu',
          address3: 'Architecto assumenda',
          city: 'Aspernatur nostrum s',
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'petitioner@example.com',
          name: 'Brett Osborne',
          phone: '+1 (537) 235-6147',
          postalCode: '89499',
          state: 'AK',
        },
        filingType: 'Myself',
        hasIrsNotice: false,
        partyType: PARTY_TYPES.petitioner,
        preferredTrialCity: 'Birmingham, Alabama',
        procedureType: 'Regular',
      },
      stinFileId,
    });

    const addCoversheet = document => {
      return applicationContext.getUseCases().addCoversheetInteractor({
        applicationContext,
        caseId: caseDetail.caseId,
        documentId: document.documentId,
      });
    };

    const coversheets = [];

    for (const document of caseDetail.documents) {
      coversheets.push(addCoversheet(document));
    }

    await Promise.all(coversheets);
  });

  await asUserFromEmail('docketclerk@example.com', async applicationContext => {
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
      //todo - do not hard code a judge
      nameForSigning: 'Maurice B. Foley',
      originalDocumentId: documentId,
      signedDocumentId: documentId,
    });
  });

  await asUserFromEmail('docketclerk@example.com', async applicationContext => {
    const { caseId, docketNumber } = caseDetail;

    const documentMetadata = {
      caseId,
      docketNumber,
      documentTitle: 'Something',
      documentType: 'Miscellaneous',
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
