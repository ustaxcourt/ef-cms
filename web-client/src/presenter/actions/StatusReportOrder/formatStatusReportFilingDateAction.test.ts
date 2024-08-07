import { FORMATS } from '@shared/business/utilities/DateHandler';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { formatStatusReportFilingDateAction } from './formatStatusReportFilingDateAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('formatStatusReportFilingDateAction,', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should take in status report filing date and output formatted version', async () => {
    const statusReportFilingDate = '2024-07-04';
    const statusReportFilingDateFormatted = applicationContext
      .getUtilities()
      .formatDateString(statusReportFilingDate, FORMATS.YYYYMMDD);

    const result = await runAction(formatStatusReportFilingDateAction, {
      modules: {
        presenter,
      },
      props: {
        statusReportFilingDate,
      },
    });

    expect(result.output).toEqual({
      statusReportFilingDate: statusReportFilingDateFormatted,
    });
  });
});
