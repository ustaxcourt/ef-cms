import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { deleteDraftDocumentAction } from './deleteDraftDocumentAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

describe('deleteDraftDocumentAction', () => {
  const documentId = applicationContext.getUniqueId();
  const docketNumber = '999-99';

  beforeAll(() => {
    applicationContext
      .getUseCases()
      .deleteDocumentInteractor.mockResolvedValue(MOCK_CASE);
  });

  it('should delete the draft document and return an updated case and docketNumber if state.redirectToCaseDetail is true', async () => {
    const result = await runAction(deleteDraftDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        archiveDraftDocument: { documentId, redirectToCaseDetail: true },
        caseDetail: {
          docketNumber,
        },
        saveAlertsForNavigation: false,
      },
    });

    expect(
      applicationContext.getUseCases().deleteDocumentInteractor.mock
        .calls[0][0],
    ).toMatchObject({ docketNumber, documentId });
    expect(result.state.alertSuccess).toEqual({
      message: 'Document deleted.',
    });
    expect(result.state.saveAlertsForNavigation).toBeTruthy();
    expect(result.output).toMatchObject({
      caseDetail: MOCK_CASE,
      docketNumber,
    });
  });

  it('should delete the draft document and return an updated case if state.redirectToCaseDetail is false', async () => {
    const result = await runAction(deleteDraftDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        archiveDraftDocument: { documentId, redirectToCaseDetail: false },
        caseDetail: {
          docketNumber,
        },
        saveAlertsForNavigation: false,
      },
    });

    expect(
      applicationContext.getUseCases().deleteDocumentInteractor.mock
        .calls[0][0],
    ).toMatchObject({ docketNumber, documentId });
    expect(result.state.alertSuccess).toEqual({
      message: 'Document deleted.',
    });
    expect(result.state.saveAlertsForNavigation).toBeFalsy();
    expect(result.output).toMatchObject({ caseDetail: MOCK_CASE });
  });
});
