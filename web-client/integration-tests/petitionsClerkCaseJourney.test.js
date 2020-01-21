import { fakeFile, setupTest } from './helpers';
import petitionsClerkCreatesNewCase from './journey/petitionsClerkCreatesNewCase';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkRunsBatchProcess from './journey/petitionsClerkRunsBatchProcess';
import petitionsClerkSendsCaseToIRSHoldingQueue from './journey/petitionsClerkSendsCaseToIRSHoldingQueue';
import petitionsClerkUpdatesCaseDetail from './journey/petitionsClerkUpdatesCaseDetail';
import petitionsClerkViewsDocketRecordAfterServing from './journey/petitionsClerkViewsDocketRecordAfterServing';

const test = setupTest();

describe('Case journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  petitionsClerkLogIn(test);
  petitionsClerkCreatesNewCase(test, fakeFile);
  petitionsClerkUpdatesCaseDetail(test);
  petitionsClerkSendsCaseToIRSHoldingQueue(test);
  petitionsClerkRunsBatchProcess(test);
  petitionsClerkViewsDocketRecordAfterServing(test);
});
