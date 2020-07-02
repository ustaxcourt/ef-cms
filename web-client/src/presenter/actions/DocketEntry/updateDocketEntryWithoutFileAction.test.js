import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { updateDocketEntryWithoutFileAction } from './updateDocketEntryWithoutFileAction';

presenter.providers.applicationContext = applicationContext;

describe('updateDocketEntryWithoutFileAction', () => {
  let caseDetail;

  beforeAll(() => {
    caseDetail = {
      caseId: '123',
      docketNumber: '123-45',
    };
  });

  it('should call updateDocketEntryInteractor and return caseDetail', async () => {
    applicationContext
      .getUseCases()
      .updateDocketEntryInteractor.mockReturnValue(caseDetail);

    const result = await runAction(updateDocketEntryWithoutFileAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail,
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
      caseDetail,
      caseId: caseDetail.caseId,
      docketNumber: caseDetail.docketNumber,
    });
  });
});
