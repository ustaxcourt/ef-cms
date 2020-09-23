const faker = require('faker');
const {
  CASE_TYPES_MAP,
  COUNTRY_TYPES,
  FILING_TYPES,
  PARTY_TYPES,
  PROCEDURE_TYPES,
  ROLES,
  TRIAL_CITY_STRINGS,
} = require('../../../../shared/src/business/entities/EntityConstants');
const {
  getFakeFile,
} = require('../../../../shared/src/business/test/getFakeFile');

const createTrialSession = async ({ applicationContext }) => {
  let startDate = faker.date.future(1);
  let startDateObj = new Date(startDate);
  let selectedMonth = startDate.getMonth() + 1;

  while (selectedMonth === 7 || selectedMonth === 8) {
    startDate = faker.date.future(1);
    startDateObj = new Date(startDate);
    selectedMonth = startDate.getMonth() + 1;
  }

  const termsByMonth = {
    fall: [9, 10, 11, 12],
    spring: [4, 5, 6],
    summer: [7, 8],
    winter: [1, 2, 3],
  };

  let term = '';

  if (termsByMonth.winter.includes(selectedMonth)) {
    term = 'Winter';
  } else if (termsByMonth.spring.includes(selectedMonth)) {
    term = 'Spring';
  } else if (termsByMonth.summer.includes(selectedMonth)) {
    term = 'Summer';
  } else if (termsByMonth.fall.includes(selectedMonth)) {
    term = 'Fall';
  }

  let trialLocation = faker.random.arrayElement(TRIAL_CITY_STRINGS);

  return await applicationContext.getUseCases().createTrialSessionInteractor({
    applicationContext,
    trialSession: {
      isCalendared: false,
      maxCases: 100,
      sessionType: 'Hybrid',
      startDate: startDate.toISOString(),
      term,
      termYear: `${startDateObj.getFullYear()}`,
      trialLocation,
    },
  });
};

const createCase = async ({
  applicationContext,
  petitionFileId,
  stinFileId,
}) => {
  let petitionFile;
  let stinFile;
  let shouldUpload = false;

  if (!petitionFileId) {
    petitionFile = getFakeFile();
    petitionFileId = applicationContext.getUniqueId();

    shouldUpload = true;
  }

  if (!stinFileId) {
    stinFile = getFakeFile();
    stinFileId = applicationContext.getUniqueId();
    shouldUpload = true;
  }

  if (shouldUpload) {
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
  }

  const petitionerName = `${faker.name.firstName()} ${faker.name.lastName()}`;

  const caseDetail = await applicationContext
    .getUseCases()
    .createCaseInteractor({
      applicationContext,
      petitionFileId,
      petitionMetadata: {
        caseCaption: petitionerName,
        caseType: CASE_TYPES_MAP.cdp,
        contactPrimary: {
          address1: faker.address.streetAddress(),
          address2: faker.address.secondaryAddress(),
          address3: faker.address.streetSuffix(),
          city: faker.address.city(),
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: faker.internet.email(),
          name: petitionerName,
          phone: faker.phone.phoneNumber(),
          postalCode: faker.address.zipCode(),
          state: faker.address.stateAbbr(),
        },
        filingType: faker.random.arrayElement(FILING_TYPES[ROLES.petitioner]),
        hasIrsNotice: false,
        partyType: PARTY_TYPES.petitioner,
        preferredTrialCity: faker.random.arrayElement(TRIAL_CITY_STRINGS),
        procedureType: faker.random.arrayElement(PROCEDURE_TYPES),
      },
      stinFileId,
    });

  const addCoversheet = document => {
    return applicationContext.getUseCases().addCoversheetInteractor({
      applicationContext,
      docketNumber: caseDetail.docketNumber,
      documentId: document.documentId,
    });
  };

  for (const document of caseDetail.docketEntries) {
    if (shouldUpload) {
      await addCoversheet(document);
    }

    await applicationContext
      .getPersistenceGateway()
      .updateDocumentProcessingStatus({
        applicationContext,
        docketNumber: caseDetail.docketNumber,
        documentId: document.documentId,
      });
  }

  return { caseDetail, petitionFileId, stinFileId };
};

const addCaseToTrialSession = async ({
  applicationContext,
  docketNumber,
  trialSessionId,
}) => {
  return await applicationContext
    .getUseCases()
    .addCaseToTrialSessionInteractor({
      applicationContext,
      docketNumber,
      trialSessionId,
    });
};

const getClientId = async ({ cognito, userPoolId }) => {
  const results = await cognito
    .listUserPoolClients({
      MaxResults: 60,
      UserPoolId: userPoolId,
    })
    .promise();
  const clientId = results.UserPoolClients[0].ClientId;
  return clientId;
};

const getUserPoolId = async ({ cognito, env }) => {
  const results = await cognito
    .listUserPools({
      MaxResults: 50,
    })
    .promise();
  const userPoolId = results.UserPools.find(
    pool => pool.Name === `efcms-${env}`,
  ).Id;
  return userPoolId;
};

const getUserToken = async ({ cognito, env, password, username }) => {
  const userPoolId = await getUserPoolId({ cognito, env });
  const clientId = await getClientId({ cognito, userPoolId });

  const response = await cognito
    .adminInitiateAuth({
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      AuthParameters: {
        PASSWORD: password,
        USERNAME: username,
      },
      ClientId: clientId,
      UserPoolId: userPoolId,
    })
    .promise();
  return response.AuthenticationResult.IdToken;
};

module.exports = {
  addCaseToTrialSession,
  createCase,
  createTrialSession,
  getUserToken,
};
