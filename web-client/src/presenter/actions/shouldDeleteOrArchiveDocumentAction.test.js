import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { shouldDeleteOrArchiveDocumentAction } from './shouldDeleteOrArchiveDocumentAction';

presenter.providers.applicationContext = applicationContext;

const {
  STIPULATED_DECISION_EVENT_CODE,
  TRANSCRIPT_EVENT_CODE,
} = applicationContext.getConstants();

describe('shouldDeleteOrArchiveDocumentAction', () => {
  const documentId = applicationContext.getUniqueId();
  let deleteStub, archiveStub;

  beforeAll(() => {
    deleteStub = jest.fn();
    archiveStub = jest.fn();

    presenter.providers.path = {
      archive: archiveStub,
      delete: deleteStub,
    };
  });

  it('should return path.delete if the document is a Stipulated Decision', async () => {
    await runAction(shouldDeleteOrArchiveDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        archiveDraftDocument: { documentId },
        caseDetail: {
          documents: [
            { documentId, eventCode: STIPULATED_DECISION_EVENT_CODE },
          ],
        },
      },
    });

    expect(deleteStub.mock.calls.length).toEqual(1);
    expect(archiveStub).not.toBeCalled();
  });

  it('should return path.archive if the document type is not a Stipulated Decision', async () => {
    await runAction(shouldDeleteOrArchiveDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        archiveDraftDocument: { documentId },
        caseDetail: {
          documents: [{ documentId, eventCode: TRANSCRIPT_EVENT_CODE }],
        },
      },
    });

    expect(archiveStub.mock.calls.length).toEqual(1);
    expect(deleteStub).not.toBeCalled();
  });
});
