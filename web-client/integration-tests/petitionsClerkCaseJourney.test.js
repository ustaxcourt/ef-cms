import { fakeFile, setupTest } from './helpers';
import petitionsClerkCreatesNewCase from './journey/petitionsClerkCreatesNewCase';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkRunsBatchProcess from './journey/petitionsClerkRunsBatchProcess';
import petitionsClerkSendsCaseToIRSHoldingQueue from './journey/petitionsClerkSendsCaseToIRSHoldingQueue';

const test = setupTest();

describe('Case journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  petitionsClerkLogIn(test);
  petitionsClerkCreatesNewCase(test, fakeFile);
  petitionsClerkSendsCaseToIRSHoldingQueue(test);
  petitionsClerkRunsBatchProcess(test);
});
