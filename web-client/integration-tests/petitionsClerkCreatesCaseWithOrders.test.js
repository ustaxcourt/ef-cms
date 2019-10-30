import { fakeFile, setupTest } from './helpers';
import petitionsClerkCreatesNewCase from './journey/petitionsClerkCreatesNewCase';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkRunsBatchProcess from './journey/petitionsClerkRunsBatchProcess';
import petitionsClerkSendsCaseToIRSHoldingQueue from './journey/petitionsClerkSendsCaseToIRSHoldingQueue';
import petitionsClerkUpdatesCaseWithNoOrders from './journey/petitionsClerkUpdatesCaseWithNoOrders';
import petitionsClerkUpdatesCaseWithOrders from './journey/petitionsClerkUpdatesCaseWithOrders';

const test = setupTest();

describe('Petitions clerk case journey (with orders)', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  // case has orders => orders needed summary
  petitionsClerkLogIn(test);
  petitionsClerkCreatesNewCase(test, fakeFile);
  petitionsClerkSendsCaseToIRSHoldingQueue(test);
  petitionsClerkRunsBatchProcess(test);
  petitionsClerkUpdatesCaseWithOrders(test);

  // case does not have orders => no orders needed summary
  petitionsClerkLogIn(test);
  petitionsClerkCreatesNewCase(test, fakeFile);
  petitionsClerkSendsCaseToIRSHoldingQueue(test);
  petitionsClerkRunsBatchProcess(test);
  petitionsClerkUpdatesCaseWithNoOrders(test);
});
