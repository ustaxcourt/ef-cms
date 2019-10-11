import { Document } from '../../../../../shared/src/business/entities/Document';
import { generatePrintableFilingReceiptAction } from './generatePrintableFilingReceiptAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

let generatePrintableFilingReceiptInteractorMock;

describe('generatePrintableFilingReceiptAction', () => {
  beforeEach(() => {
    generatePrintableFilingReceiptInteractorMock = jest.fn();

    presenter.providers.applicationContext = {
      getEntityConstructors: () => ({
        Document,
      }),
      getUseCases: () => ({
        generatePrintableFilingReceiptInteractor: generatePrintableFilingReceiptInteractorMock,
      }),
    };
  });

  it('should call generatePrintableFilingReceiptInteractor', async () => {
    await runAction(generatePrintableFilingReceiptAction, {
      modules: {
        presenter,
      },
      props: {
        documentsFiled: {
          caseId: '123',
          docketNumber: '123-19',
          primaryDocumentFile: {},
        },
      },
      state: {
        form: {
          category: 'Motion',
          documentType: 'Motion for Judgment on the Pleadings',
        },
      },
    });

    expect(generatePrintableFilingReceiptInteractorMock).toHaveBeenCalled();
  });

  it('should generate a receipt with supporting documents', async () => {
    await runAction(generatePrintableFilingReceiptAction, {
      modules: {
        presenter,
      },
      props: {
        documentsFiled: {
          caseId: '123',
          docketNumber: '123-19',
          hasSupportingDocuments: true,
          primaryDocumentFile: {},
          supportingDocuments: [{}],
        },
      },
      state: {
        form: {
          category: 'Motion',
          documentType: 'Motion for Judgment on the Pleadings',
        },
      },
    });

    expect(
      generatePrintableFilingReceiptInteractorMock.mock.calls[0][0].documents,
    ).toHaveProperty('supportingDocuments');
  });

  it('should generate a receipt with a secondary document', async () => {
    await runAction(generatePrintableFilingReceiptAction, {
      modules: {
        presenter,
      },
      props: {
        documentsFiled: {
          caseId: '123',
          docketNumber: '123-19',
          primaryDocumentFile: {},
          secondaryDocument: {},
          secondaryDocumentFile: {},
        },
      },
      state: {
        form: {
          category: 'Motion',
          documentType: 'Motion for Judgment on the Pleadings',
        },
      },
    });

    expect(
      generatePrintableFilingReceiptInteractorMock.mock.calls[0][0].documents,
    ).toHaveProperty('secondaryDocument');
  });

  it('should generate a receipt with secondary supporting documents', async () => {
    await runAction(generatePrintableFilingReceiptAction, {
      modules: {
        presenter,
      },
      props: {
        documentsFiled: {
          caseId: '123',
          docketNumber: '123-19',
          hasSecondarySupportingDocuments: true,
          primaryDocumentFile: {},
          secondaryDocument: {},
          secondaryDocumentFile: {},
          secondarySupportingDocuments: [{}],
        },
      },
      state: {
        form: {
          category: 'Motion',
          documentType: 'Motion for Judgment on the Pleadings',
        },
      },
    });

    expect(
      generatePrintableFilingReceiptInteractorMock.mock.calls[0][0].documents,
    ).toHaveProperty('secondarySupportingDocuments');
  });
});
