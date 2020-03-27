import { clearPdfPreviewUrlAction } from './clearPdfPreviewUrlAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('clearPdfPreviewUrlAction', () => {
  let revokeObjectURLStub;

  beforeEach(() => {
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
