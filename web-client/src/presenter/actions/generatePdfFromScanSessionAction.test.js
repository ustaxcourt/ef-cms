import { generatePdfFromScanSessionAction } from './generatePdfFromScanSessionAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { applicationContextForClient } from '../../../../shared/src/business/test/createTestApplicationContext';

describe('generatePdfFromScanSessionAction', () => {
  let generatePDFFromJPGDataInteractor;
  beforeEach(() => {
    const applicationContext = applicationContextForClient;
    presenter.providers.applicationContext = applicationContext;
    generatePDFFromJPGDataInteractor = applicationContext.getUseCases()
      .generatePDFFromJPGDataInteractor;

    global.File = class {
      constructor() {
        this.foo = 'bar';
      }
    };
  });

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

    expect(generatePDFFromJPGDataInteractor).toHaveBeenCalled();
  });
});
