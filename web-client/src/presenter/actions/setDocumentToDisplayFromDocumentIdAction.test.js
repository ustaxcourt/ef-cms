import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setDocumentToDisplayFromDocumentIdAction } from './setDocumentToDisplayFromDocumentIdAction';

presenter.providers.applicationContext = applicationContext;

describe('setDocumentToDisplayFromDocumentIdAction', () => {
  let caseDetail;
  const caseId = '123';
  const documentId = '456';
  const url = 'www.example.com';

  beforeAll(() => {
    caseDetail = {
      caseId,
      docketNumber: '123-45',
      documents: [],
    };

    applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor.mockImplementation(async () => {
        return { url };
      });
  });

  it('sets state.iframeSrc to the document URL associated with the documentId in state', async () => {
    const { state } = await runAction(
      setDocumentToDisplayFromDocumentIdAction,
      {
        modules: {
          presenter,
        },
        state: { caseDetail, documentId, iframeSrc: undefined },
      },
    );

    expect(state.iframeSrc).toEqual(url);
  });
});
