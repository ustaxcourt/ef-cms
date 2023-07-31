import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { generatePdfFromScanSessionAction } from './generatePdfFromScanSessionAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

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
