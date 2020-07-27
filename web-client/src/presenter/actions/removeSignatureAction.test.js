import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { removeSignatureAction } from './removeSignatureAction';
import { runAction } from 'cerebral/test';

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
        documentIdToEdit: '476cadf8-63c3-472b-a477-c8f9ea8b7d1f',
      },
    });

    expect(
      applicationContext.getUseCases().removeSignatureFromDocumentInteractor,
    ).toBeCalled();
    expect(result.output).toMatchObject({
      caseDetail: { docketNumber: '123-19' },
      viewerDraftDocumentToDisplay: {
        documentId: '476cadf8-63c3-472b-a477-c8f9ea8b7d1f',
      },
    });
  });
});
