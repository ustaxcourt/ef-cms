import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setDefaultDocumentDetailTabAction } from './setDefaultDocumentDetailTabAction';

describe('setDefaultDocumentDetailTab', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('returns "Document Info" when the case status is new and the document type is Petition', async () => {
    const { state } = await runAction(setDefaultDocumentDetailTabAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          documents: [{ documentId: 'abc', documentType: 'Petition' }],
          status: Case.STATUS_TYPES.new,
        },
        documentId: 'abc',
      },
    });
    expect(state.currentViewMetadata.tab).toEqual('Document Info');
  });

  it('returns "Document Info" when the case status is in progress and the document type is Petition', async () => {
    const { state } = await runAction(setDefaultDocumentDetailTabAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          documents: [{ documentId: 'abc', documentType: 'Petition' }],
          status: Case.STATUS_TYPES.inProgress,
        },
        documentId: 'abc',
      },
    });
    expect(state.currentViewMetadata.tab).toEqual('Document Info');
  });

  it('returns "Messages" when the case status is new and the document type is Answer', async () => {
    const { state } = await runAction(setDefaultDocumentDetailTabAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          documents: [{ documentId: 'abc', documentType: 'Answer' }],
          status: Case.STATUS_TYPES.new,
        },
        documentId: 'abc',
      },
    });
    expect(state.currentViewMetadata.tab).toEqual('Messages');
  });

  it('returns "Messages" when the case status is general docket', async () => {
    const { state } = await runAction(setDefaultDocumentDetailTabAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          documents: [{ documentId: 'abc', documentType: 'Petition' }],
          status: Case.STATUS_TYPES.generalDocket,
        },
        documentId: 'abc',
      },
    });
    expect(state.currentViewMetadata.tab).toEqual('Messages');
  });
});
