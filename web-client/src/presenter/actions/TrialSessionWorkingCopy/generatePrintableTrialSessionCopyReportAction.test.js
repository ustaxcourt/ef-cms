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
    const expectedformattedTrialSessionDTO = {
      chambersPhoneNumber: formattedCaseMock.chambersPhoneNumber,
      computedStatus: formattedCaseMock.computedStatus,
      endDateForAdditionalPageHeaders: '',
      formattedCourtReporter: formattedCaseMock.formattedCourtReporter,
      formattedEstimatedEndDateFull: '',
      formattedIrsCalendarAdministrator:
        formattedCaseMock.formattedIrsCalendarAdministrator,
      formattedJudge: formattedCaseMock.formattedJudge,
      formattedStartDateFull: formattedCaseMock.formattedStartDateFull,
      formattedTerm: formattedCaseMock.formattedTerm,
      formattedTrialClerk: formattedCaseMock.formattedTrialClerk,
      startDateForAdditionalPageHeaders: '',
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
          formattedTrialSessionDetails: {
            estimatedEndDate: '12/12/12',
          },
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
    ).toMEqual(expectedformattedTrialSessionDTO);
    expect(result.output.pdfUrl).toEqual(url);
  });
});
