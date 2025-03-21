import { downloadMinuteSheetFormPdfAction } from './downloadMinuteSheetFormPdfAction';
import { generateTrialSessionMinutesPdfInteractor } from '@shared/proxies/trialSessionMinutes/generateTrialSessionMinutesPdfProxy';
import { openUrlInNewTab } from '@web-client/presenter/utilities/openUrlInNewTab';
import { presenter } from '@web-client/presenter/presenter';
import { runAction } from '@web-client/presenter/test.cerebral';

jest.mock(
  '@shared/proxies/trialSessionMinutes/generateTrialSessionMinutesPdfProxy',
);
jest.mock('@web-client/presenter/utilities/openUrlInNewTab');

describe('downloadMinuteSheetFormPdfAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate and open the PDF in a new tab', async () => {
    const mockPdfUrl = 'http://example.com/pdf';
    (generateTrialSessionMinutesPdfInteractor as jest.Mock).mockResolvedValue(
      mockPdfUrl,
    );

    const mockDocketNumber = '123-45';
    const mockTrialSessionId = 'trial-session-id-123';

    await runAction(downloadMinuteSheetFormPdfAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
        trialSession: {
          trialSessionId: mockTrialSessionId,
        },
      },
    });

    expect(generateTrialSessionMinutesPdfInteractor).toHaveBeenCalledWith({
      docketNumber: mockDocketNumber,
      trialSessionId: mockTrialSessionId,
    });

    expect(openUrlInNewTab).toHaveBeenCalledWith({
      url: mockPdfUrl,
    });
  });
});
