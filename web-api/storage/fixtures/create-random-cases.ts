const axios = require('axios');
const jwt = require('jsonwebtoken');
const {
  CASE_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
  PROCEDURE_TYPES,
  TRIAL_CITIES,
} = require('../../../shared/src/business/entities/EntityConstants');
const { faker } = require('@faker-js/faker');
const { userMap } = require('../../../shared/src/test/mockUserTokenMap');

const USAGE = `
Used for creating cases with random data locally

Usage: node create-random-cases.js [num-to-create]
`;

const numToCreate = process.argv[2];

const main = () => {
  const userName = 'petitioner';
  const user = {
    ...userMap[userName],
    sub: userMap[userName].userId,
  };
  const jwtToken = jwt.sign(user, 'secret');

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
    const preferredTrialCityObject = TRIAL_CITIES.ALL[faker.number.int() % 74];

    const preferredTrialCity =
      preferredTrialCityObject.city + ', ' + preferredTrialCityObject.state;

    //create a case
    const randomlyGeneratedData = {
      petitionFileId,
      petitionMetadata: {
        caseType: CASE_TYPES[faker.number.int() % 13],
        contactPrimary: {
          address1: faker.location.streetAddress(),
          city: faker.location.city(),
          countryType: COUNTRY_TYPES.DOMESTIC,
          name: faker.person.fullName(),
          phone: faker.phone.number(),
          postalCode: faker.location.zipCode(),
          state: faker.location.stateAbbr(),
        },
        contactSecondary: {
          address1: faker.location.streetAddress(),
          city: faker.location.city(),
          countryType: COUNTRY_TYPES.DOMESTIC,
          name: faker.person.fullName(),
          phone: faker.phone.number(),
          postalCode: faker.location.zipCode(),
          state: faker.location.stateAbbr(),
        },
        countryType: COUNTRY_TYPES.DOMESTIC,
        filingType: 'Myself and my spouse',
        hasIrsNotice: faker.random.boolean(),
        partyType: PARTY_TYPES.petitionerSpouse,
        preferredTrialCity,
        privatePractitioners: [],
        procedureType: PROCEDURE_TYPES[faker.number.int() % 2],
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
