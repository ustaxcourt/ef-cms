import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('setNoticeOfTrialDate', () => {
  it('should set noticeOfTrialDate on the given case', () => {
    const caseEntity = new Case(MOCK_CASE, { applicationContext });
    const result = caseEntity.setNoticeOfTrialDate();

    expect(result.isValid()).toBeTruthy();
  });

  it('should set noticeOfTrialDate when passed through Case constructor', () => {
    const isoDateString = applicationContext
      .getUtilities()
      .createISODateString();

    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        noticeOfTrialDate: isoDateString,
      },
      { applicationContext },
    );

    expect(caseEntity.isValid()).toBeTruthy();
    expect(caseEntity.noticeOfTrialDate).toEqual(isoDateString);
  });
});
