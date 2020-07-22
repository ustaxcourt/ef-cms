import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setViewerCorrespondenceToDisplayAction } from './setViewerCorrespondenceToDisplayAction';

describe('setViewerCorrespondenceToDisplayAction', () => {
  beforeAll(() => {
    applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor.mockReturnValue({
        url: 'www.example.com',
      });
    presenter.providers.applicationContext = applicationContext;
  });

  it('sets the viewerCorrespondenceToDisplay from props on state and sets the iframeSrc url from the return from the use case', async () => {
    const result = await runAction(setViewerCorrespondenceToDisplayAction, {
      modules: {
        presenter,
      },
      props: {
        viewerCorrespondenceToDisplay: { documentId: '1234' },
      },
      state: {
        caseDetail: {
          caseId: '48849291-d329-465d-a421-eecf06a671de',
        },
        viewerCorrespondenceToDisplay: null,
      },
    });
    expect(result.state.viewerCorrespondenceToDisplay).toEqual({
      documentId: '1234',
    });
    expect(result.state.iframeSrc).toEqual('www.example.com');
  });

  it('does not set iframeSrc if props.viewerCorrespondenceToDisplay is null', async () => {
    const result = await runAction(setViewerCorrespondenceToDisplayAction, {
      modules: {
        presenter,
      },
      props: {
        viewerCorrespondenceToDisplay: null,
      },
      state: {
        caseDetail: {
          caseId: '48849291-d329-465d-a421-eecf06a671de',
        },
        viewerCorrespondenceToDisplay: null,
      },
    });
    expect(result.state.iframeSrc).toBeUndefined();
  });
});
