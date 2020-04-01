import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { generatePdfFromScanSessionAction } from './generatePdfFromScanSessionAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('generatePdfFromScanSessionAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

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

    expect(
      applicationContext.getUseCases().generatePDFFromJPGDataInteractor,
    ).toHaveBeenCalled();
  });
});
