import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { formatCustomCaseReportDataForCsvAction } from '@web-client/presenter/actions/CaseInventoryReport/formatCustomCaseReportDataForCsvAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('formatCustomCaseReportDataForCsvAction', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should return the csv data string and title', async () => {
    const result = await runAction(formatCustomCaseReportDataForCsvAction, {
      modules: {
        presenter,
      },
      props: {
        formattedCases: [
          {
            associatedJudge: 'associatedJudge1',
            calendaringHighPriority: 'calendaringHighPriority1',
            caseCaption: 'caseCaption1',
            caseType: 'caseType1',
            docketNumber: 'docketNumber1',
            preferredTrialCity: 'preferredTrialCity1',
            receivedAt: 'receivedAt1',
            status: 'status1',
          },
          {
            associatedJudge: 'associatedJudge2',
            calendaringHighPriority: 'calendaringHighPriority2',
            caseCaption: 'caseCaption2',
            caseType: 'caseType2',
            docketNumber: 'docketNumber2',
            preferredTrialCity: 'preferredTrialCity2',
            receivedAt: 'receivedAt2',
            status: 'status2',
          },
        ],
      },
    });

    expect(result.output.csvString).toEqual(
      'Docket No.,Date Created,Case Title,Case Status,Case Type,Judge,Requested Place of Trial,Calendaring High Priority\ndocketNumber1,receivedAt1,caseCaption1,status1,caseType1,associatedJudge1,preferredTrialCity1,calendaringHighPriority1\ndocketNumber2,receivedAt2,caseCaption2,status2,caseType2,associatedJudge2,preferredTrialCity2,calendaringHighPriority2',
    );
    expect(result.output.fileName).toContain('Custom Case Report - ');
  });
});
