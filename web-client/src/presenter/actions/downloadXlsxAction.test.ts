import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { downloadXlsxAction } from './downloadXlsxAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('downloadXlsxAction', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext.getUseCases();
  });

  it('should call the download xlsx interactor', async () => {
    await runAction(downloadXlsxAction, {
      modules: {
        presenter,
      },
      props: {
        bufferArray: Buffer.from([65, 66, 67]),
        termName: 'Test Term',
      },
    });

    expect(applicationContext.getUtilities().downloadXlsx).toHaveBeenCalled();
  });
});
