import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
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
        viewerCorrespondenceToDisplay: { correspondenceId: '1234' },
      },
      state: {
        caseDetail: {
          docketNumber: '123-45',
        },
        viewerCorrespondenceToDisplay: null,
      },
    });
    expect(result.state.viewerCorrespondenceToDisplay).toEqual({
      correspondenceId: '1234',
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
          docketNumber: '123-45',
        },
        viewerCorrespondenceToDisplay: null,
      },
    });
    expect(result.state.iframeSrc).toBeUndefined();
  });
});
