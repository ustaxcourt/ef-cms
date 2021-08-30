import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { gotoPrintablePendingReportSequence } from '../sequences/gotoPrintablePendingReportSequence';
import { presenter } from '../presenter-mock';

describe('gotoPrintablePendingReportSequence', () => {
  let cerebralTest;
  beforeAll(() => {
    applicationContext
      .getUseCases()
      .generatePrintablePendingReportInteractor.mockReturnValue(
        'http://example.com/mock-pdf-url',
      );
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.router = {
      revokeObjectURL: () => {},
    };
    presenter.sequences = {
      gotoPrintablePendingReportSequence,
    };
    cerebralTest = CerebralTest(presenter);
  });
  it('Should show the Printable Pending Report page', async () => {
    cerebralTest.setState('currentPage', 'SomeOtherPage');
    await cerebralTest.runSequence('gotoPrintablePendingReportSequence', {});
    expect(cerebralTest.getState('currentPage')).toBe('SimplePdfPreviewPage');
    expect(cerebralTest.getState('pdfPreviewUrl')).toBe(
      'http://example.com/mock-pdf-url',
    );
    expect(cerebralTest.getState('screenMetadata.headerTitle')).toBe(
      'Pending Report',
    );
  });
});
