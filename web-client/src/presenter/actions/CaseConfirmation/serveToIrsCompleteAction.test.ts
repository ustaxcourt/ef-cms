import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { serveToIrsCompleteAction } from './serveToIrsCompleteAction';

describe('serveToIrsCompleteAction', () => {
  const mockPaperPath = jest.fn();
  const mockElectronicPath = jest.fn();

  beforeAll(() => {
    presenter.providers.path = {
      electronic: mockElectronicPath,
      paper: mockPaperPath,
    };
  });

  it('should call the paper path if a pdfUrl is passed in', async () => {
    await runAction(serveToIrsCompleteAction, {
      modules: {
        presenter,
      },
      props: { pdfUrl: 'www.pdf.com' },
    });

    expect(mockPaperPath.mock.calls.length).toEqual(1);
    expect(mockElectronicPath).not.toHaveBeenCalled();
  });

  it('should call the electronic path if a pdfUrl is not passed in', async () => {
    await runAction(serveToIrsCompleteAction, {
      modules: {
        presenter,
      },
      props: {},
    });

    expect(mockElectronicPath.mock.calls.length).toEqual(1);
    expect(mockPaperPath).not.toHaveBeenCalled();
  });
});
