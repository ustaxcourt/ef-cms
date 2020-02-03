import { CerebralTest } from 'cerebral/test';
import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter';

let test;

presenter.providers.router = {
  revokeObjectURL: () => {},
};

presenter.providers.applicationContext = {
  ...applicationContext,
  getCurrentUser: () => ({
    section: 'chambers',
  }),
  getUseCases: () => ({
    generatePrintablePendingReportInteractor: () => {
      return 'http://example.com/mock-pdf-url';
    },
  }),
};

test = CerebralTest(presenter);

describe('gotoPrintablePendingReportSequence', () => {
  it('Should show the Printable Pending Report page', async () => {
    test.setState('currentPage', 'SomeOtherPage');
    await test.runSequence('gotoPrintablePendingReportSequence', {});
    expect(test.getState('currentPage')).toBe('SimplePdfPreviewPage');
    expect(test.getState('pdfPreviewUrl')).toBe(
      'http://example.com/mock-pdf-url',
    );
    expect(test.getState('screenMetadata.headerTitle')).toBe('Pending Report');
  });
});
