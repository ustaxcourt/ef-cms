import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { setDefaultDocumentDetailTabAction } from './setDefaultDocumentDetailTabAction';

presenter.providers.applicationContext = applicationContext;

describe('setDefaultDocumentDetailTab', () => {
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
    expect(state.currentTab).toEqual('Document Info');
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
    expect(state.currentTab).toEqual('Messages');
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
    expect(state.currentTab).toEqual('Messages');
  });
});
