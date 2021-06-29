import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getPDFForPreviewAction } from './getPDFForPreviewAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getPDFForPreviewAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext
      .getUseCases()
      .loadPDFForPreviewInteractor.mockResolvedValue('fake file data');
  });

  it('returns original props if we already have what appears to be an actual file', async () => {
    const props = { file: { name: 'name of a file on a real file object' } };
    const result = await runAction(getPDFForPreviewAction, {
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
    const props = { file: { docketEntryId: '456' } };
    await runAction(getPDFForPreviewAction, {
      modules: {
        presenter,
      },
      props,
      state: {
        caseDetail: {
          docketNumber: '123-20',
        },
      },
    });
    expect(
      applicationContext.getUseCases().loadPDFForPreviewInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      docketEntryId: '456',
      docketNumber: '123-20',
    });
  });
});
