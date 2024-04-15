import { isPrintPreviewPreparedAction } from './isPrintPreviewPreparedAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

presenter.providers.path = {
  no: jest.fn(),
  yes: jest.fn(),
};

describe('isPrintPreviewPreparedAction', () => {
  beforeAll(() => {
    jest.resetAllMocks();
  });

  it('executes "no" path if pdfPreviewUrl is NOT set', async () => {
    await runAction(isPrintPreviewPreparedAction, {
      modules: {
        presenter,
      },
      state: {
        docketNumber: '123-19',
      },
    });
    expect(presenter.providers.path.no).toHaveBeenCalled();
    expect(presenter.providers.path.yes).not.toHaveBeenCalled();
  });
  it('executes "yes" path if pdfPreviewUrl is set', async () => {
    await runAction(isPrintPreviewPreparedAction, {
      modules: {
        presenter,
      },
      state: {
        pdfPreviewUrl: 'http://www.example.com:9001/some/pdf.pdf',
      },
    });
    expect(presenter.providers.path.yes).toHaveBeenCalled();
    expect(presenter.providers.path.no).not.toHaveBeenCalled();
  });
});
