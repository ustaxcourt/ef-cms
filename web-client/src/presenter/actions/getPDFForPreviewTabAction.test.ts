import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getPDFForPreviewTabAction } from './getPDFForPreviewTabAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getPDFForPreviewTabAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext
      .getUseCases()
      .loadPDFForPreviewInteractor.mockResolvedValue('fake file data');
  });

  it('returns original props if we already have what appears to be an actual file', async () => {
    const props = { file: { name: 'name of a file on a real file object' } };
    const result = await runAction(getPDFForPreviewTabAction, {
      modules: {
        presenter,
      },
      props,
      state: {},
    });
    expect(result.props).toEqual(props);
    expect(
      applicationContext.getUseCases().loadPDFForPreviewInteractor,
    ).not.toHaveBeenCalled();
  });

  it('returns results from loadPDFForPreviewInteractor if provided a docketNumber and docketEntryId', async () => {
    await runAction(getPDFForPreviewTabAction, {
      modules: {
        presenter,
      },
      props: {
        file: {
          docketEntryId: '789',
        },
      },
      state: {
        caseDetail: {
          docketEntries: [{ docketEntryId: '789', documentStorageId: '456' }],
          docketNumber: '123-20',
        },
      },
    });
    expect(
      applicationContext.getUseCases().loadPDFForPreviewInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      documentStorageId: '456',
      docketNumber: '123-20',
    });
  });
});
