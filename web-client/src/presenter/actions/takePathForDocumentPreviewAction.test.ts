import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { takePathForDocumentPreviewAction } from './takePathForDocumentPreviewAction';

describe('takePathForDocumentPreviewAction', () => {
  presenter.providers.applicationContext = applicationContext;
  presenter.providers.path = {
    documentInS3: jest.fn(),
    no: jest.fn(),
    pdfInMemory: jest.fn(),
  };

  it('should return path.pdfInMemory when props.fileFromBrowserMemory is defined', async () => {
    await runAction(takePathForDocumentPreviewAction, {
      modules: {
        presenter,
      },
      props: {
        fileFromBrowserMemory: {},
      },
    });

    expect(presenter.providers.path.pdfInMemory).toHaveBeenCalled();
  });

  it('should return path.documentInS3 when props.documentInS3 is defined', async () => {
    await runAction(takePathForDocumentPreviewAction, {
      modules: {
        presenter,
      },
      props: {
        documentInS3: {},
      },
    });

    expect(presenter.providers.path.documentInS3).toHaveBeenCalled();
  });

  it('should return path.no when both props.fileFromBrowserMemory and props.documentInS3 are undefined', async () => {
    await runAction(takePathForDocumentPreviewAction, {
      modules: {
        presenter,
      },
      props: {},
    });

    expect(presenter.providers.path.no).toHaveBeenCalled();
  });
});
