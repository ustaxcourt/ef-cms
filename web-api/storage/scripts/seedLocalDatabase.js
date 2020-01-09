const AWS = require('aws-sdk');
const seedEntries = require('../fixtures/seed');
const { asUserFromEmail, createUsers } = require('./createUsers');

const client = new AWS.DynamoDB.DocumentClient({
  credentials: {
    accessKeyId: 'noop',
    secretAccessKey: 'noop',
  },
  endpoint: 'http://localhost:8000',
  region: 'us-east-1',
});

const putEntries = async entries => {
  await Promise.all(
    entries.map(item =>
      client
        .put({
          Item: item,
          TableName: 'efcms-local',
        })
        .promise(),
    ),
  );
};

module.exports.seedLocalDatabase = async entries => {
  if (entries) {
    await putEntries(entries);
  } else {
    await createUsers();

    await putEntries(seedEntries);

    await asUserFromEmail('petitioner', async applicationContext => {
      const caseDetail = await applicationContext
        .getUseCases()
        .createCaseInteractor({
          applicationContext,
          petitionFileId: '1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
          petitionMetadata: {
            caseType: 'Whistleblower',
            contactPrimary: {
              address1: '68 Someway Freeway',
              city: 'City',
              countryType: 'domestic',
              email: 'petitioner',
              name: 'Brett Third Osborne',
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

      await Promise.all(caseDetail.documents.map(addCoversheet));
    });
  }
};
