import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { gotoSignPDFDocumentSequence } from '../sequences/gotoSignPDFDocumentSequence';
import { presenter } from '../presenter-mock';
describe('gotoSignPDFDocumentSequence', () => {
  let test;
  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue({ section: 'chambers' });
    applicationContext.getUseCases().getCaseInteractor.mockReturnValue({
      documents: [
        {
          documentId: '123',
          documentType: 'Proposed Stipulated Decision',
        },
      ],
    });
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      gotoSignPDFDocumentSequence,
    };
    test = CerebralTest(presenter);
  });
  it('Should set state.pdfForSigning and show the PDFSigner page', async () => {
    test.setState('currentPage', 'SomeOtherPage');
    await test.runSequence('gotoSignPDFDocumentSequence', {
      documentId: '123',
      pageNumber: 2,
    });

    const pdfForSigning = test.getState('pdfForSigning');
    expect(test.getState('currentPage')).toBe('SignStipDecision');
    expect(pdfForSigning.documentId).toEqual('123');
    expect(pdfForSigning.pageNumber).toEqual(2);
  });
});
