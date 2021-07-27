import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { gotoPrintablePendingReportForCaseSequence } from '../sequences/gotoPrintablePendingReportForCaseSequence';
import { presenter } from '../presenter-mock';

const { CHAMBERS_SECTION } = applicationContext.getConstants();

describe('gotoPrintablePendingReportForCaseSequence', () => {
  let cerebralTest;
  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      section: CHAMBERS_SECTION,
    });
    applicationContext
      .getUseCases()
      .generatePrintablePendingReportInteractor.mockReturnValue(
        'http://example.com/mock-pdf-url',
      );
    applicationContext.getUseCases().getCaseInteractor.mockReturnValue({
      docketEntries: [
        {
          docketEntryId: '123',
          documentType: 'Proposed Stipulated Decision',
        },
      ],
    });
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.router = {
      revokeObjectURL: () => {},
    };
    presenter.sequences = {
      gotoPrintablePendingReportForCaseSequence,
    };
    cerebralTest = CerebralTest(presenter);
  });
  it('Should show the Printable Pending Report page', async () => {
    cerebralTest.setState('currentPage', 'SomeOtherPage');
    await cerebralTest.runSequence(
      'gotoPrintablePendingReportForCaseSequence',
      {
        docketNumber: '101-21',
      },
    );
    expect(cerebralTest.getState('currentPage')).toBe('SimplePdfPreviewPage');
    expect(cerebralTest.getState('pdfPreviewUrl')).toBe(
      'http://example.com/mock-pdf-url',
    );
    expect(cerebralTest.getState('screenMetadata.headerTitle')).toBe(
      'Pending Report',
    );
  });
});
