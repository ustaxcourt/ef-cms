import { admissionsClerkAddsNewPractitioner } from './journey/admissionsClerkAddsNewPractitioner';
import { admissionsClerkSearchesForPractitionerByBarNumber } from './journey/admissionsClerkSearchesForPractitionerByBarNumber';
import { admissionsClerkSearchesForPractitionersByName } from './journey/admissionsClerkSearchesForPractitionersByName';
import { loginAs, setupTest } from './helpers';

const test = setupTest();

describe('admissions clerk add and search for a practitioner', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'admissionsclerk');

  admissionsClerkAddsNewPractitioner(test);
  admissionsClerkSearchesForPractitionersByName(test);
  admissionsClerkSearchesForPractitionerByBarNumber(test);
});
