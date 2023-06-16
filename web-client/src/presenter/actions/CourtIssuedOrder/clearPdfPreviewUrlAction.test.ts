import { clearPdfPreviewUrlAction } from './clearPdfPreviewUrlAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearPdfPreviewUrlAction', () => {
  let revokeObjectURLStub;

  beforeAll(() => {
    revokeObjectURLStub = jest.fn();

    presenter.providers.router = {
      revokeObjectURL: revokeObjectURLStub,
    };
  });

  it('clears the pdfPreview object URL from the router', async () => {
    await runAction(clearPdfPreviewUrlAction, {
      modules: {
        presenter,
      },
    });

    expect(revokeObjectURLStub).toHaveBeenCalled();
  });
});
