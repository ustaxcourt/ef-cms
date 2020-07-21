import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { updateDocketEntryWithFileAction } from './updateDocketEntryWithFileAction';

describe('updateDocketEntryWithFileAction', () => {
  const mockCaseDetail = {
    caseId: '123',
    docketNumber: '123-45',
  };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .updateDocketEntryInteractor.mockReturnValue(mockCaseDetail);
  });

  it('should call updateDocketEntryInteractor and return caseDetail', async () => {
    const result = await runAction(updateDocketEntryWithFileAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: mockCaseDetail,
        document: '123-456-789-abc',
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(
      applicationContext.getUseCases().updateDocketEntryInteractor,
    ).toHaveBeenCalled();
    expect(result.output).toEqual({
      caseDetail: mockCaseDetail,
      caseId: mockCaseDetail.caseId,
      docketNumber: mockCaseDetail.docketNumber,
    });
  });
});
