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
    it(`create case #${i} and associate a respondent`, async () => {
      await loginAs(test, 'petitioner');
      caseDetail = await uploadPetition(test);
      await wait(1000);
      test.createdDocketNumbers.push(caseDetail.docketNumber);
      await loginAs(test, 'petitionsclerk');
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
