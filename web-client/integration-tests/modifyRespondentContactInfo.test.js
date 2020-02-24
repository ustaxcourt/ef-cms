import { loginAs, setupTest, uploadPetition, wait } from './helpers';
import respondentLogIn from './journey/respondentLogIn';
import respondentSignsOut from './journey/respondentSignsOut';
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

    it('associates a respondent', async () => {
      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: test.createdDocketNumbers[i],
      });
      await test.runSequence('updateFormValueSequence', {
        key: 'respondentSearch',
        value: 'RT6789',
      });
      await test.runSequence('openAddRespondentModalSequence');
      await test.runSequence('associateRespondentWithCaseSequence');
      expect(test.getState('caseDetail.respondents.length')).toEqual(1);
    });
  }

  respondentLogIn(test);
  respondentUpdatesAddress(test);
  for (let i = 0; i < 3; i++) {
    respondentViewsCaseDetailNoticeOfChangeOfAddress(test, i);
  }
  respondentSignsOut(test);
});
