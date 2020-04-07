import { generatePdfFromScanSessionAction } from './generatePdfFromScanSessionAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

const mockGeneratePDFFromJPGData = jest.fn();

// Mocking File
global.File = class {
  constructor() {
    this.foo = 'bar';
  }
};

presenter.providers.applicationContext = {
  getUseCases: () => ({
    generatePDFFromJPGDataInteractor: () => {
      return mockGeneratePDFFromJPGData();
    },
  }),
};

describe('generatePdfFromScanSessionAction', () => {
  it('generates a PDF from provided scan batches', async () => {
    await runAction(generatePdfFromScanSessionAction, {
      modules: {
        presenter,
      },
      state: {
        currentViewMetadata: {
          documentSelectedForScan: 'petition',
        },
        scanner: {
          batches: {
            petition: [{ pages: [] }],
          },
          isScanning: true,
        },
      },
    });

    expect(mockGeneratePDFFromJPGData).toHaveBeenCalled();
  });
});
