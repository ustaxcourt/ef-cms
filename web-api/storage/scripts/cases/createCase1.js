const {
  COUNTRY_TYPES,
  PARTY_TYPES,
} = require('../../../../shared/src/business/entities/EntityConstants');
const { asUserFromEmail } = require('../createUsers');

module.exports.createCase1 = async () => {
  let caseDetail;

  await asUserFromEmail('petitioner', async applicationContext => {
    const petitionFile = Buffer.from(
      'JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDg0ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDUgODAgVGQKICAgIChDb25ncmF0aW9ucywgeW91IGZvdW5kIHRoZSBFYXN0ZXIgRWdnLikgVGoKICBFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA3NyAwMDAwMCBuIAowMDAwMDAwMTc4IDAwMDAwIG4gCjAwMDAwMDA0NTcgMDAwMDAgbiAKdHJhaWxlcgogIDw8ICAvUm9vdCAxIDAgUgogICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjU2NQolJUVPRgo=',
      'base64',
      {
        type: 'application/pdf',
      },
    );
    petitionFile.name = 'petitionFile.pdf';
    const petitionFileId = applicationContext.getUniqueId();

    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      applicationContext,
      document: petitionFile,
      documentId: petitionFileId,
    });

    const stinFile = Buffer.from(
      'JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDg0ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDUgODAgVGQKICAgIChDb25ncmF0aW9ucywgeW91IGZvdW5kIHRoZSBFYXN0ZXIgRWdnLikgVGoKICBFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA3NyAwMDAwMCBuIAowMDAwMDAwMTc4IDAwMDAwIG4gCjAwMDAwMDA0NTcgMDAwMDAgbiAKdHJhaWxlcgogIDw8ICAvUm9vdCAxIDAgUgogICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjU2NQolJUVPRgo=',
      'base64',
      {
        type: 'application/pdf',
      },
    );
    stinFile.name = 'stinFile.pdf';
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
        caseType: 'Whistleblower',
        contactPrimary: {
          address1: '68 Fabien Freeway',
          address2: 'Suscipit animi solu',
          address3: 'Architecto assumenda',
          city: 'Aspernatur nostrum s',
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'petitioner',
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
      //todo - dont hardcode a judge
      nameForSigning: 'Maurice B. Foley',
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
