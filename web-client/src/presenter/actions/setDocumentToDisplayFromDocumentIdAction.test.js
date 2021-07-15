import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setDocumentToDisplayFromDocumentIdAction } from './setDocumentToDisplayFromDocumentIdAction';

presenter.providers.applicationContext = applicationContext;

describe('setDocumentToDisplayFromDocumentIdAction', () => {
  let caseDetail;
  const docketNumber = '123-45';
  const docketEntryId = '456';
  const url = 'www.example.com';

  beforeAll(() => {
    caseDetail = {
      docketEntries: [],
      docketNumber,
    };

    applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor.mockImplementation(() => {
        return { url };
      });
  });

  it('sets state.iframeSrc to the document URL associated with the docketEntryId in state', async () => {
    const { state } = await runAction(
      setDocumentToDisplayFromDocumentIdAction,
      {
        modules: {
          presenter,
        },
        state: { caseDetail, docketEntryId, iframeSrc: undefined },
      },
    );

    expect(state.iframeSrc).toEqual(url);
  });
});
