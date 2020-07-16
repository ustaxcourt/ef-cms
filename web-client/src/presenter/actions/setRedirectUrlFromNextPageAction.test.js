import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setRedirectUrlFromNextPageAction } from './setRedirectUrlFromNextPageAction';

describe('setRedirectUrlFromNextPageAction', () => {
  const mockDocketNumber = '123';

  it('should set state.redirectUrl to route to message detail when props.nextPage is MessageDetail', async () => {
    const mockParentMessageId = '456';

    const result = await runAction(setRedirectUrlFromNextPageAction, {
      modules: {
        presenter,
      },
      props: {
        nextPage: 'MessageDetail',
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
        parentMessageId: mockParentMessageId,
      },
    });

    expect(result.state.redirectUrl).toBe(
      `/case-messages/${mockDocketNumber}/message-detail/${mockParentMessageId}`,
    );
  });

  it('should set state.redirectUrl to route to case detail when props.nextPage is CaseDetailInternal', async () => {
    const mockDocumentId = '456';

    const result = await runAction(setRedirectUrlFromNextPageAction, {
      modules: {
        presenter,
      },
      props: {
        nextPage: 'CaseDetailInternal',
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
        documentId: mockDocumentId,
      },
    });

    expect(result.state.redirectUrl).toBe(
      `/case-detail/${mockDocketNumber}/document-view?documentId=${mockDocumentId}`,
    );
  });

  it('should set state.redirectUrl to route to document qc when props.nextPage is DocumentQC', async () => {
    const result = await runAction(setRedirectUrlFromNextPageAction, {
      modules: {
        presenter,
      },
      props: {
        nextPage: 'DocumentQC',
      },
      state: {},
    });

    expect(result.state.redirectUrl).toBe('/document-qc/my/inbox');
  });

  it('should set state.redirectUrl to route to document qc by default', async () => {
    const result = await runAction(setRedirectUrlFromNextPageAction, {
      modules: {
        presenter,
      },
      props: {
        nextPage: 'does not match',
      },
      state: {},
    });

    expect(result.state.redirectUrl).toBe('/document-qc/my/inbox');
  });

  it('should not set state.redirectUrl when props.nextPage is undefined', async () => {
    const result = await runAction(setRedirectUrlFromNextPageAction, {
      modules: {
        presenter,
      },
      state: {},
    });

    expect(result.state.redirectUrl).toBeUndefined();
  });
});
