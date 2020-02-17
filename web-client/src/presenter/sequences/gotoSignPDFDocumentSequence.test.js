import { CerebralTest } from 'cerebral/test';
import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter';

let test;
presenter.providers.applicationContext = {
  ...applicationContext,
  getCurrentUser: () => ({
    section: 'chambers',
  }),
  getUseCases: () => ({
    getCaseInteractor: () => ({
      documents: [
        {
          documentId: '123',
          documentType: 'Proposed Stipulated Decision',
        },
      ],
    }),
    loadPDFForSigningInteractor: () => {
      1;
    },
  }),
};

test = CerebralTest(presenter);

describe('gotoSignPDFDocumentSequence', () => {
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
