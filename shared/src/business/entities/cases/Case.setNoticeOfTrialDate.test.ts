import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { createISODateString } from '@shared/business/utilities/DateHandler';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('setNoticeOfTrialDate', () => {
  it('should set noticeOfTrialDate on the given case', () => {
    const caseEntity = new Case(MOCK_CASE, {
      authorizedUser: mockDocketClerkUser,
    });
    const result = caseEntity.setNoticeOfTrialDate();

    expect(result.isValid()).toBeTruthy();
  });

  it('should set noticeOfTrialDate when passed through Case constructor', () => {
    const isoDateString = createISODateString();

    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        noticeOfTrialDate: isoDateString,
      },
      { authorizedUser: mockDocketClerkUser },
    );

    expect(caseEntity.isValid()).toBeTruthy();
    expect(caseEntity.noticeOfTrialDate).toEqual(isoDateString);
  });
});
