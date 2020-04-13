import { admissionsClerkEditsPractitionerInfo } from './journey/admissionsClerkEditsPractitionerInfo';
import { loginAs, setupTest } from './helpers';

const test = setupTest();

describe('admissions clerk edits practitioner info', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'admissionsclerk');

  admissionsClerkEditsPractitionerInfo(test);
});
