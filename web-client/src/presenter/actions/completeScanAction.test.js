import { completeScanAction } from './completeScanAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

const mockCompleteScanSession = jest.fn();
const mockGeneratePDFFromJPGData = jest.fn();
const mockOnComplete = jest.fn();

// Mocking File
global.File = class {
  constructor() {
    this.foo = 'bar';
  }
};

presenter.providers.applicationContext = {
  getScanner: () => ({
    completeScanSession: () => {
      mockCompleteScanSession();
      return {
        error: false,
        scannedBuffer: {},
      };
    },
  }),
  getUseCases: () => ({
    generatePDFFromJPGDataInteractor: () => {
      return mockGeneratePDFFromJPGData();
    },
  }),
};

describe('completeScanAction', () => {
  it('completes the scanning process by passing the scanned data to a handler function', async () => {
    const result = await runAction(completeScanAction, {
      modules: {
        presenter,
      },
      props: {
        onComplete: mockOnComplete,
      },
      state: {
        batches: {
          petition: [{ pages: [] }],
        },
        documentSelectedForScan: 'petition',
        isScanning: true,
      },
    });

    // expect(mockCompleteScanSession).toHaveBeenCalled();
    expect(mockGeneratePDFFromJPGData).toHaveBeenCalled();
    expect(mockOnComplete).toHaveBeenCalled();
    expect(result.state.isScanning).toEqual(false);
  });
});
