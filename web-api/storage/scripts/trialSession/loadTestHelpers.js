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

  const caseDetail = await applicationContext
    .getUseCases()
    .createCaseInteractor({
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
