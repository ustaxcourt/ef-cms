jest.mock('@web-api/persistence/postgres/cases/getCaseByDocketNumber');
import { CaseDeadline } from '@shared/business/entities/CaseDeadline';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getcreateCaseDeadlineLockInfo } from '@web-api/business/useCases/caseDeadline/createCaseDeadlineInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';

describe('createCaseDeadlineInteractor - getcreateCaseDeadlineLockInfo', () => {
  const getCaseByDocketNumber = jest.mocked(getCaseByDocketNumberMock);

  it('should return the case entity lock info when there is no consolidated group', async () => {
    const TEST_DOCKET_NUMBER = 'TEST_DOCKET_NUMBER';

    getCaseByDocketNumber.mockResolvedValue({
      docketNumber: TEST_DOCKET_NUMBER,
      leadDocketNumber: undefined,
      consolidatedCases: [
        { docketNumber: TEST_DOCKET_NUMBER },
        { docketNumber: '111-11' },
        { docketNumber: '222-22' },
      ],
    } as RawCase);

    const lockInfo = await getcreateCaseDeadlineLockInfo(applicationContext, {
      caseDeadline: {
        docketNumber: TEST_DOCKET_NUMBER,
      } as CaseDeadline,
    });

    expect(lockInfo.identifiers.length).toEqual(1);
    expect(lockInfo.identifiers[0]).toEqual(`case|${TEST_DOCKET_NUMBER}`);
  });

  it('should return all the cases entity lock info when there is a consolidated group', async () => {
    const TEST_DOCKET_NUMBER = 'TEST_DOCKET_NUMBER';

    getCaseByDocketNumber.mockResolvedValue({
      docketNumber: TEST_DOCKET_NUMBER,
      leadDocketNumber: TEST_DOCKET_NUMBER,
      consolidatedCases: [
        { docketNumber: TEST_DOCKET_NUMBER },
        { docketNumber: '111-11' },
        { docketNumber: '222-22' },
      ],
    } as RawCase);

    const lockInfo = await getcreateCaseDeadlineLockInfo(applicationContext, {
      caseDeadline: {
        docketNumber: TEST_DOCKET_NUMBER,
      } as CaseDeadline,
    });

    expect(lockInfo.identifiers.length).toEqual(3);
    expect(lockInfo.identifiers).toEqual([
      `case|${TEST_DOCKET_NUMBER}`,
      'case|111-11',
      'case|222-22',
    ]);
  });
});
