const createApplicationContext = require('../../../src/applicationContext');

const createTrialSession = async () => {
  const user = {
    email: 'docketclerk',
    name: 'Test Docketclerk',
    role: 'docketclerk',
    userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
  };

  const applicationContext = createApplicationContext(user);

  return await applicationContext.getUseCases().createTrialSessionInteractor({
    applicationContext,
    trialSession: {
      maxCases: 100,
      sessionType: 'Regular',
      startDate: '2025-03-01T00:00:00.000Z',
      term: 'Fall',
      termYear: '2025',
      trialLocation: 'Birmingham, Alabama',
    },
  });
};

const createCase = async () => {
  const user = {
    email: 'petitioner',
    name: 'Test Petitioner',
    role: 'petitioner',
    userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
  };

  const applicationContext = createApplicationContext(user);

  const petitionFile = Buffer.from(
    'JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDg0ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDUgODAgVGQKICAgIChDb25ncmF0aW9ucywgeW91IGZvdW5kIHRoZSBFYXN0ZXIgRWdnLikgVGoKICBFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA3NyAwMDAwMCBuIAowMDAwMDAwMTc4IDAwMDAwIG4gCjAwMDAwMDA0NTcgMDAwMDAgbiAKdHJhaWxlcgogIDw8ICAvUm9vdCAxIDAgUgogICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjU2NQolJUVPRgo=',
    'base64',
    {
      type: 'application/pdf',
    },
  );
  petitionFile.name = 'petitionFile.pdf';
  const petitionFileId = applicationContext.getUniqueId();

  const stinFile = Buffer.from(
    'JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDg0ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDUgODAgVGQKICAgIChDb25ncmF0aW9ucywgeW91IGZvdW5kIHRoZSBFYXN0ZXIgRWdnLikgVGoKICBFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA3NyAwMDAwMCBuIAowMDAwMDAwMTc4IDAwMDAwIG4gCjAwMDAwMDA0NTcgMDAwMDAgbiAKdHJhaWxlcgogIDw8ICAvUm9vdCAxIDAgUgogICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjU2NQolJUVPRgo=',
    'base64',
    {
      type: 'application/pdf',
    },
  );
  stinFile.name = 'stinFile.pdf';
  const stinFileId = applicationContext.getUniqueId();

  try {
    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      applicationContext,
      document: petitionFile,
      documentId: petitionFileId,
    });

    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      applicationContext,
      document: stinFile,
      documentId: stinFileId,
    });
  } catch (e) {
    console.log('e', e);
  }

  const caseDetail = await applicationContext
    .getUseCases()
    .createCaseInteractor({
      applicationContext,
      petitionFileId,
      petitionMetadata: {
        caseCaption: 'Brett Osborne',
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
      stinFileId,
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

  return caseDetail;
};

const addCaseToTrialSession = async ({ caseId, trialSessionId }) => {
  const user = {
    email: 'docketclerk',
    name: 'Test Docketclerk',
    role: 'docketclerk',
    userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
  };

  const applicationContext = createApplicationContext(user);

  return await applicationContext
    .getUseCases()
    .addCaseToTrialSessionInteractor({
      applicationContext,
      caseId,
      trialSessionId,
    });
};

module.exports = { addCaseToTrialSession, createCase, createTrialSession };
