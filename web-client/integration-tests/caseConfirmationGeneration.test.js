import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionerChoosesCaseType } from './journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from './journey/petitionerChoosesProcedureType';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';
import { userNavigatesToCreateCaseConfirmation } from './journey/userNavigatesToCreateCaseConfirmation';

describe('Case Confirmation', () => {
  const cerebralTest = setupTest();
  afterAll(() => {
    cerebralTest.closeSocket();
  });

  describe('Petitioner creates a case / Petitionsclerk Sends to Holding Queue / Petitionsclerk then has access to case confirmation', () => {
    loginAs(cerebralTest, 'petitioner@example.com');

    it('login as a petitioner and create a case', async () => {
      const caseDetail = await uploadPetition(cerebralTest);
      cerebralTest.docketNumber = caseDetail.docketNumber;
    });

    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkSubmitsCaseToIrs(cerebralTest);
    userNavigatesToCreateCaseConfirmation(cerebralTest);
  });

  describe('Petitioner creates a case / Petitionsclerk Sends to Holding Queue / Petitioner then has access to case confirmation', () => {
    loginAs(cerebralTest, 'petitioner@example.com');
    petitionerChoosesProcedureType(cerebralTest);
    petitionerChoosesCaseType(cerebralTest);

    it('login as a petitioner and create a case', async () => {
      const caseDetail = await uploadPetition(cerebralTest);
      cerebralTest.docketNumber = caseDetail.docketNumber;
    });

    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkSubmitsCaseToIrs(cerebralTest);
    loginAs(cerebralTest, 'petitioner@example.com');
    userNavigatesToCreateCaseConfirmation(cerebralTest);
  });

  describe('Petitionsclerk creates a case then serves case then has access to case confirmation', () => {
    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkCreatesNewCase(cerebralTest);
    userNavigatesToCreateCaseConfirmation(cerebralTest);
  });
});
