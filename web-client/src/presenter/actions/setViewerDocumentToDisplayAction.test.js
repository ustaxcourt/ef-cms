import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setViewerDocumentToDisplayAction } from './setViewerDocumentToDisplayAction';

describe('setViewerDocumentToDisplayAction', () => {
  beforeAll(() => {
    applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor.mockReturnValue({
        url: 'www.example.com',
      });
    presenter.providers.applicationContext = applicationContext;
  });

  it('sets the viewerDocumentToDisplay from props on state and sets the iframeSrc url from the return from the use case', async () => {
    const result = await runAction(setViewerDocumentToDisplayAction, {
      modules: {
        presenter,
      },
      props: {
        viewerDocumentToDisplay: { documentId: '1234' },
      },
      state: {
        caseDetail: {
          caseId: '48849291-d329-465d-a421-eecf06a671de',
        },
        viewerDocumentToDisplay: null,
      },
    });
    expect(result.state.viewerDocumentToDisplay).toEqual({
      documentId: '1234',
    });
    expect(result.state.iframeSrc).toEqual('www.example.com');
  });

  it('does not set iframeSrc if props.viewerDocumentToDisplay is null', async () => {
    const result = await runAction(setViewerDocumentToDisplayAction, {
      modules: {
        presenter,
      },
      props: {
        viewerDocumentToDisplay: null,
      },
      state: {
        caseDetail: {
          caseId: '48849291-d329-465d-a421-eecf06a671de',
        },
        viewerDocumentToDisplay: null,
      },
    });
    expect(result.state.iframeSrc).toBeUndefined();
  });
});
