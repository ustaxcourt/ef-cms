import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { removeSignatureAction } from './removeSignatureAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('removeSignatureAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .removeSignatureFromDocumentInteractor.mockReturnValue({
        docketNumber: '123-19',
      });
  });

  it('calls use case to remove signature', async () => {
    const result = await runAction(removeSignatureAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: { docketNumber: '123-45' },
        docketEntryIdToEdit: '476cadf8-63c3-472b-a477-c8f9ea8b7d1f',
      },
    });

    expect(
      applicationContext.getUseCases().removeSignatureFromDocumentInteractor,
    ).toHaveBeenCalled();
    expect(result.output).toMatchObject({
      caseDetail: { docketNumber: '123-19' },
      viewerDraftDocumentToDisplay: {
        docketEntryId: '476cadf8-63c3-472b-a477-c8f9ea8b7d1f',
      },
    });
  });
});
