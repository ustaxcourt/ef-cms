import { fakeFile, setupTest } from './helpers';
import petitionsClerkCreatesNewCase from './journey/petitionsClerkCreatesNewCase';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkPrioritizesCase from './journey/petitionsClerkPrioritizesCase';
import petitionsClerkUnprioritizesCase from './journey/petitionsClerkUnprioritizesCase';

const test = setupTest();

describe('Prioritize a Case', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  petitionsClerkLogIn(test);
  petitionsClerkCreatesNewCase(test, fakeFile, 'Jackson, Mississippi');
  petitionsClerkPrioritizesCase(test);
  petitionsClerkUnprioritizesCase(test);
});
