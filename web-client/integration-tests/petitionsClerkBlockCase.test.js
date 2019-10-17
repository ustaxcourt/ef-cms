import { fakeFile, setupTest } from './helpers';
import petitionsClerkBlocksCase from './journey/petitionsClerkBlocksCase';
import petitionsClerkCreatesNewCase from './journey/petitionsClerkCreatesNewCase';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkUnblocksCase from './journey/petitionsClerkUnblocksCase';

const test = setupTest();

describe('Blocking a Case', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  petitionsClerkLogIn(test);
  petitionsClerkCreatesNewCase(test, fakeFile, 'Jackson, Mississippi');
  petitionsClerkBlocksCase(test);
  petitionsClerkUnblocksCase(test);
});
