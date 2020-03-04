import { setupTest } from './helpers';

import {
  loginAs,
  setupTest as setupTestClient,
  uploadPetition,
} from '../integration-tests/helpers';

import { ContactFactory } from '../../shared/src/business/entities/contacts/ContactFactory';

// Docket clerk
import docketClerkLogIn from '../integration-tests/journey/docketClerkLogIn';
import docketClerkSignsOut from '../integration-tests/journey/docketClerkSignsOut';

// Public User
import docketClerkSealsCase from '../integration-tests/journey/docketClerkSealsCase';
import unauthedUserNavigatesToPublicSite from './journey/unauthedUserNavigatesToPublicSite';
import unauthedUserSearchesForSealedCaseByName from './journey/unauthedUserSearchesForSealedCaseByName';
import unauthedUserViewsCaseDetailForSealedCase from './journey/unauthedUserViewsCaseDetailForSealedCase';
import unauthedUserViewsPrintableDocketRecord from './journey/unauthedUserViewsPrintableDocketRecord';

const test = setupTest();
const testClient = setupTestClient();

describe('Petitioner creates cases to search for', () => {
  beforeAll(() => {
    jest.setTimeout(10000);
  });

  loginAs(testClient, 'petitioner');

  it('Create case', async () => {
    const caseDetail = await uploadPetition(testClient, {
      contactSecondary: {
        address1: '734 Cowley Parkway',
        city: 'Somewhere',
        countryType: 'domestic',
        name: 'NOTAREALNAMEFORTESTINGPUBLIC',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'CT',
      },
      partyType: ContactFactory.PARTY_TYPES.petitionerSpouse,
    });
    test.docketNumber = caseDetail.docketNumber;
    testClient.docketNumber = caseDetail.docketNumber;
  });
});

describe('Docket clerk seals the case (should not be viewable to the public)', () => {
  docketClerkLogIn(testClient);
  docketClerkSealsCase(testClient);
  docketClerkSignsOut(testClient);
});

describe('Unauthed user searches for a sealed case by docket number', () => {
  unauthedUserNavigatesToPublicSite(test);
  unauthedUserViewsCaseDetailForSealedCase(test);
  unauthedUserViewsPrintableDocketRecord(test);
});

describe('Unauthed user searches for a sealed case by name', () => {
  unauthedUserNavigatesToPublicSite(test);
  unauthedUserSearchesForSealedCaseByName(test);
  unauthedUserViewsPrintableDocketRecord(test);
});
