import { fakeFile, setupTest } from './helpers';
import petitionsClerkCreatesNewCase from './journey/petitionsClerkCreatesNewCase';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkUpdatesCaseDetail from './journey/petitionsClerkUpdatesCaseDetail';
import petitionsClerkViewsDocketRecordAfterServing from './journey/petitionsClerkViewsDocketRecordAfterServing';

const test = setupTest();

describe('Case journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  petitionsClerkLogIn(test);
  petitionsClerkCreatesNewCase(test, fakeFile);
  // TODO this test does nothing currently
  // petitionsClerkUpdatesCaseDetail(test);
  // petitionsClerkViewsDocketRecordAfterServing(test);
});
