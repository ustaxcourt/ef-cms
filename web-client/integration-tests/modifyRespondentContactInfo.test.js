import { loginAs, setupTest, uploadPetition } from './helpers';
import petitionsClerkAddsRespondentsToCase from './journey/petitionsClerkAddsRespondentsToCase';
import respondentUpdatesAddress from './journey/respondentUpdatesAddress';
import respondentViewsCaseDetailNoticeOfChangeOfAddress from './journey/respondentViewsCaseDetailNoticeOfChangeOfAddress';

const test = setupTest();

describe('Modify Respondent Contact Information', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  let caseDetail;
  test.createdDocketNumbers = [];

  for (let i = 0; i < 3; i++) {
    loginAs(test, 'petitioner');

    it(`create case #${i} and associate a respondent`, async () => {
      caseDetail = await uploadPetition(test);
      test.createdDocketNumbers.push(caseDetail.docketNumber);
    });

    loginAs(test, 'petitionsclerk');
    petitionsClerkAddsRespondentsToCase(test);
  }

  loginAs(test, 'irsPractitioner');
  respondentUpdatesAddress(test);
  for (let i = 0; i < 3; i++) {
    respondentViewsCaseDetailNoticeOfChangeOfAddress(test, i);
  }
});
