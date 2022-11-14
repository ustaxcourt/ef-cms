import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { generatePrintableTrialSessionCopyReportAction } from './generatePrintableTrialSessionCopyReportAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('generatePrintableTrialSessionCopyReportAction', () => {
  presenter.providers.applicationContext = applicationContext;
  const url = 'some URL';
  const formattedCaseMock = {
    calendarNotes: MOCK_CASE.calendarNotes,
    caseTitle: 'Case Notes Title',
    docketNumber: '678-90',
    docketNumberWithSuffix: 'L',
    filingPartiesCode: 'OTP',
    inConsolidatedGroup: MOCK_CASE.inConsolidatedGroup,
    irsPractitioners: MOCK_CASE.irsPractitioners,
    leadCase: MOCK_CASE.leadCase,
    notes: {
      docketNumber: '678-90',
      notes: 'this is a note added',
      userId: 'f0a1e52a-876f-4c03-853c-f66e407e5a1e',
    },
    privatePractitioners: MOCK_CASE.privatePractitioners,
    trialStatus: MOCK_CASE.trialStatus,
    userNotes: 'user notes',
  };
  beforeAll(() => {
    applicationContext
      .getUseCases()
      .generatePrintableTrialSessionCopyReportInteractor.mockReturnValue(url);
  });
  it('should get trial status from case metadata and return the printable trial session copy pdf URL', async () => {
    const result = await runAction(
      generatePrintableTrialSessionCopyReportAction,
      {
        modules: {
          presenter,
        },
        props: {
          formattedCases: [formattedCaseMock],
        },
        state: {
          formattedTrialSessionDetails: {
            estimatedEndDate: '12/12/12',
          },
          trialSessionWorkingCopy: {
            caseMetadata: formattedCaseMock,
          },
        },
      },
    );
    expect(result.output.pdfUrl).toEqual(url);
  });
  it('should get trial status from formattedCase and return the printable trial session copy pdf URL', async () => {
    //dont use mockcase for these fields
    const mockFormattedTrialSessionDetails = {
      chambersPhoneNumber: formattedCaseMock.chambersPhoneNumber,
      computedStatus: formattedCaseMock.computedStatus,
      estimatedEndDate: '2020-11-27T05:00:00.000Z',
      formattedCourtReporter: formattedCaseMock.formattedCourtReporter,
      formattedIrsCalendarAdministrator:
        formattedCaseMock.formattedIrsCalendarAdministrator,
      formattedJudge: formattedCaseMock.formattedJudge,
      formattedTerm: formattedCaseMock.formattedTerm,
      formattedTrialClerk: formattedCaseMock.formattedTrialClerk,
      startDate: '2020-11-27T05:00:00.000Z',
      trialLocation: formattedCaseMock.trialLocation,
    };

    const result = await runAction(
      generatePrintableTrialSessionCopyReportAction,
      {
        modules: {
          presenter,
        },
        props: {
          formattedCases: [formattedCaseMock],
        },
        state: {
          formattedTrialSessionDetails: mockFormattedTrialSessionDetails,
          trialSessionWorkingCopy: {
            caseMetadata: {},
          },
        },
      },
    );

    expect(
      applicationContext.getUseCases()
        .generatePrintableTrialSessionCopyReportInteractor.mock.calls[0][1]
        .formattedTrialSession,
    ).toEqual({
      endDateForAdditionalPageHeaders: 'Nov 27, 2020',
      formattedEstimatedEndDateFull: 'November 27, 2020',
      startDateForAdditionalPageHeaders: 'Nov 27, 2020',
    });
    expect(result.output.pdfUrl).toEqual(url);
  });
});
