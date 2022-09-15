import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { generatePrintableTrialSessionCopyReportAction } from './generatePrintableTrialSessionCopyReportAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('generatePrintableTrialSessionCopyReportAction', () => {
  presenter.providers.applicationContext = applicationContext;
  const url = 'some URL';
  // const formattedCaseMock = {
  //   calendarNotes: formattedCase.calendarNotes,
  //   caseTitle: 'Case Notes Title',
  //   docketNumberWithSuffix: 'L',
  //   filingPartiesCode: 'OTP',
  //   inConsolidatedGroup: formattedCase.inConsolidatedGroup,
  //   irsPractitioners: formattedCase.irsPractitioners,
  //   leadCase: formattedCase.leadCase,
  //   privatePractitioners: formattedCase.privatePractitioners,
  //   trialStatus: formattedCase.trialStatus,
  //   userNotes: 'user notes',
  //   docketNumber: '678-90',
  //   notes: {
  //     docketNumber: '678-90',
  //     notes: 'this is a note added',
  //     userId: 'f0a1e52a-876f-4c03-853c-f66e407e5a1e',
  //   },
  // };
  beforeAll(() => {
    applicationContext
      .getUseCases()
      .generatePrintableTrialSessionCopyReportInteractor.mockReturnValue(url);
  });
  it('should return the printable trial session copy pdf URL', async () => {
    const result = await runAction(
      generatePrintableTrialSessionCopyReportAction,
      {
        modules: {
          presenter,
        },
        props: {
          formattedCases: [],
          formattedTrialSessionDetails: {
            estimatedEndDate: '12/12/12',
          },
        },
        state: {},
      },
    );
    expect(result.output.pdfUrl).toEqual(url);
  });
  it('should generate printable trial session copy pdf URL', async () => {
    const result = await runAction(
      generatePrintableTrialSessionCopyReportAction,
      {
        modules: {
          presenter,
        },
        props: {
          formattedCases: [],
          formattedTrialSessionDetails: {
            estimatedEndDate: '12/12/12',
          },
        },
        state: {},
      },
    );
    expect(result.output.pdfUrl).toEqual(url);
  });
});
