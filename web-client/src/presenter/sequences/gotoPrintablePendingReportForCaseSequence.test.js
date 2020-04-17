import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { gotoPrintablePendingReportForCaseSequence } from '../sequences/gotoPrintablePendingReportForCaseSequence';
import { presenter } from '../presenter-mock';

describe('gotoPrintablePendingReportForCaseSequence', () => {
  let test;
  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue({ section: 'chambers' });
    applicationContext
      .getUseCases()
      .generatePrintablePendingReportInteractor.mockReturnValue(
        'http://example.com/mock-pdf-url',
      );
    applicationContext.getUseCases().getCaseInteractor.mockReturnValue({
      documents: [
        {
          documentId: '123',
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
    test = CerebralTest(presenter);
  });
  it('Should show the Printable Pending Report page', async () => {
    test.setState('currentPage', 'SomeOtherPage');
    await test.runSequence('gotoPrintablePendingReportForCaseSequence', {
      docketNumber: '101-21',
    });
    expect(test.getState('currentPage')).toBe('SimplePdfPreviewPage');
    expect(test.getState('pdfPreviewUrl')).toBe(
      'http://example.com/mock-pdf-url',
    );
    expect(test.getState('screenMetadata.headerTitle')).toBe('Pending Report');
  });
});
