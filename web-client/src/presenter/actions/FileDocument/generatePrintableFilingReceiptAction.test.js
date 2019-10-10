import { Document } from '../../../../../shared/src/business/entities/Document';
import { generatePrintableFilingReceiptAction } from './generatePrintableFilingReceiptAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

let createObjectURLMock;
let generatePrintableFilingReceiptInteractorMock;

global.window = global;
global.Blob = args => args;

describe('generatePrintableFilingReceiptAction', () => {
  beforeEach(() => {
    createObjectURLMock = jest.fn();
    generatePrintableFilingReceiptInteractorMock = jest.fn();

    presenter.providers.applicationContext = {
      getEntityConstructors: () => ({
        Document,
      }),
      getUseCases: () => ({
        generatePrintableFilingReceiptInteractor: args => {
          generatePrintableFilingReceiptInteractorMock();
          return args;
        },
      }),
    };
    presenter.providers.router = {
      createObjectURL: args => {
        createObjectURLMock();
        return args;
      },
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

  it('should call createObjectURLMock, generating a url', async () => {
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

    expect(createObjectURLMock).toHaveBeenCalled();
  });

  it('should generate a receipt with supporting documents', async () => {
    const result = await runAction(generatePrintableFilingReceiptAction, {
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

    const { documents } = result.output.printReceiptLink[0];

    expect(documents).toHaveProperty('supportingDocuments');
  });

  it('should generate a receipt with a secondary document', async () => {
    const result = await runAction(generatePrintableFilingReceiptAction, {
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

    const { documents } = result.output.printReceiptLink[0];

    expect(documents).toHaveProperty('secondaryDocument');
  });

  it('should generate a receipt with secondary supporting documents', async () => {
    const result = await runAction(generatePrintableFilingReceiptAction, {
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

    const { documents } = result.output.printReceiptLink[0];

    expect(documents).toHaveProperty('secondarySupportingDocuments');
  });
});
