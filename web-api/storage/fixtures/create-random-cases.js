const faker = require('faker');
const axios = require('axios');
const { Case } = require('../../../shared/src/business/entities/cases/Case');
const {
  ContactFactory,
} = require('../../../shared/src/business/entities/contacts/ContactFactory');

const {
  TrialSession,
} = require('../../../shared/src/business/entities/trialSessions/TrialSession');

const USAGE = `
Usage: node create-random-cases.js [authorization-token] [num-to-create]

authorization-token should not include the string "Bearer "

authorization-token should be a token for a petitioner user
`;

const jwtToken = process.argv[2];
const numToCreate = process.argv[3];

const main = () => {
  if (!jwtToken || !numToCreate) {
    console.log(USAGE);
    return;
  }
  console.log(`creating ${numToCreate} cases`);

  const authToken = `Bearer ${jwtToken}`;
  const petitionFileId = '5bd2f4eb-e08a-41e4-8d18-13b9ffd4514c';
  const stinFileId = '2da6d239-555a-40e8-af81-1949c8270cd7';

  const instance = axios.create({
    headers: { Authorization: authToken },
  });

  for (let i = 0; i < numToCreate; i++) {
    const preferredTrialCityObject =
      TrialSession.TRIAL_CITIES.ALL[faker.random.number() % 74];

    const preferredTrialCity =
      preferredTrialCityObject.city + ', ' + preferredTrialCityObject.state;

    //create a case
    const randomlyGeneratedData = {
      petitionFileId,
      petitionMetadata: {
        caseType: Case.CASE_TYPES[faker.random.number() % 13],
        contactPrimary: {
          address1: faker.address.streetAddress(),
          city: faker.address.city(),
          countryType: 'domestic',
          name: faker.name.findName(),
          phone: faker.phone.phoneNumber(),
          postalCode: faker.address.zipCode(),
          state: faker.address.stateAbbr(),
        },
        contactSecondary: {
          address1: faker.address.streetAddress(),
          city: faker.address.city(),
          countryType: 'domestic',
          name: faker.name.findName(),
          phone: faker.phone.phoneNumber(),
          postalCode: faker.address.zipCode(),
          state: faker.address.stateAbbr(),
        },
        countryType: 'domestic',
        filingType: 'Myself and my spouse',
        hasIrsNotice: faker.random.boolean(),
        partyType: ContactFactory.PARTY_TYPES.petitionerSpouse,
        practitioners: [],
        preferredTrialCity,
        procedureType: Case.PROCEDURE_TYPES[faker.random.number() % 2],
      },
      stinFileId,
    };

    instance
      .post('http://localhost:3002/', {
        ...randomlyGeneratedData,
      })
      .then(res => {
        console.log(`statusCode: ${res.statusCode}`);
        console.log(res);
      })
      .catch(error => {
        console.error(error);
      });
  }
};

main();
