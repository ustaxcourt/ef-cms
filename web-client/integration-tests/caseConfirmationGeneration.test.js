import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionerChoosesCaseType } from './journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from './journey/petitionerChoosesProcedureType';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';
import { userNavigatesToCreateCaseConfirmation } from './journey/userNavigatesToCreateCaseConfirmation';

const cerebralTest = setupTest();

describe('Case Confirmation', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  describe('Petitioner creates a case / Petitionsclerk Sends to Holding Queue / Petitionsclerk then has access to case confirmation', () => {
    loginAs(cerebralTest, 'petitioner@example.com');
    petitionerChoosesProcedureType(cerebralTest);
    petitionerChoosesCaseType(cerebralTest);
    petitionerCreatesNewCase(cerebralTest, fakeFile);
    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkSubmitsCaseToIrs(cerebralTest);
    userNavigatesToCreateCaseConfirmation(cerebralTest);
  });

  describe('Petitioner creates a case / Petitionsclerk Sends to Holding Queue / Petitioner then has access to case confirmation', () => {
    loginAs(cerebralTest, 'petitioner@example.com');
    petitionerChoosesProcedureType(cerebralTest);
    petitionerChoosesCaseType(cerebralTest);
    petitionerCreatesNewCase(cerebralTest, fakeFile);
    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkSubmitsCaseToIrs(cerebralTest);
    loginAs(cerebralTest, 'petitioner@example.com');
    userNavigatesToCreateCaseConfirmation(cerebralTest);
  });

  describe('Petitionsclerk creates a case then serves case then has access to case confirmation', () => {
    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkCreatesNewCase(cerebralTest, fakeFile);
    userNavigatesToCreateCaseConfirmation(cerebralTest);
  });
});
