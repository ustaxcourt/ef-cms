import { getPDFForPreviewAction } from './getPDFForPreviewAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { applicationContextForClient } from '../../../../shared/src/business/test/createTestApplicationContext';

describe('getPDFForPreviewAction', () => {
  let loadPDFForPreviewInteractor;
  beforeEach(() => {
    const applicationContext = applicationContextForClient;
    presenter.providers.applicationContext = applicationContext;
    loadPDFForPreviewInteractor = applicationContext.getUseCases()
      .loadPDFForPreviewInteractor;
    loadPDFForPreviewInteractor.mockResolvedValue('fake file data');
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
    expect(loadPDFForPreviewInteractor).not.toHaveBeenCalled();
  });

  it('returns results from loadPDFForPreviewInteractor if provided a caseId and documentId', async () => {
    const props = { file: { caseId: '123', documentId: '456' } };
    await runAction(getPDFForPreviewAction, {
      modules: {
        presenter,
      },
      props,
      state: {},
    });
    expect(loadPDFForPreviewInteractor).toHaveBeenCalledWith({
      applicationContext: expect.anything(),
      caseId: '123',
      documentId: '456',
    });
  });
});
