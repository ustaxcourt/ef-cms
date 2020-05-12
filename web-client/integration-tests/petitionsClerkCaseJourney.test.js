import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';

const test = setupTest();

describe('Case journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitionsclerk');
  petitionsClerkCreatesNewCase(test, fakeFile);
  // TODO this test does nothing currently
  // petitionsClerkUpdatesCaseDetail(test);
  // petitionsClerkViewsDocketRecordAfterServing(test);
});
