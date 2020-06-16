import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setAttachmentDocumentToDisplayAction } from './setAttachmentDocumentToDisplayAction';

describe('setAttachmentDocumentToDisplayAction', () => {
  beforeAll(() => {
    applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor.mockReturnValue({
        url: 'www.example.com',
      });
    presenter.providers.applicationContext = applicationContext;
  });

  it('sets the attachmentDocumentToDisplay from props on state and sets the iframeSrc url from the return from the use case', async () => {
    const result = await runAction(setAttachmentDocumentToDisplayAction, {
      modules: {
        presenter,
      },
      props: {
        attachmentDocumentToDisplay: { documentId: '1234' },
      },
      state: {
        attachmentDocumentToDisplay: null,
        caseDetail: {
          caseId: '48849291-d329-465d-a421-eecf06a671de',
        },
      },
    });
    expect(result.state.attachmentDocumentToDisplay).toEqual({
      documentId: '1234',
    });
    expect(result.state.iframeSrc).toEqual('www.example.com');
  });

  it('does not set iframeSrc if props.attachmentDocumentToDisplay is null', async () => {
    const result = await runAction(setAttachmentDocumentToDisplayAction, {
      modules: {
        presenter,
      },
      props: {
        attachmentDocumentToDisplay: null,
      },
      state: {
        attachmentDocumentToDisplay: null,
        caseDetail: {
          caseId: '48849291-d329-465d-a421-eecf06a671de',
        },
      },
    });
    expect(result.state.iframeSrc).toBeUndefined();
  });
});
