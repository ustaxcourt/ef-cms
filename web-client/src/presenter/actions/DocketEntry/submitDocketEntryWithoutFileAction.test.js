import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { submitDocketEntryWithoutFileAction } from './submitDocketEntryWithoutFileAction';

presenter.providers.applicationContext = applicationContext;

describe('submitDocketEntryWithoutFileAction', () => {
  let caseDetail;

  beforeAll(() => {
    caseDetail = {
      caseId: '123',
      docketNumber: '123-45',
    };
  });

  it('should call fileDocketEntryInteractor and return caseDetail', async () => {
    applicationContext
      .getUseCases()
      .fileDocketEntryInteractor.mockReturnValue(caseDetail);

    const result = await runAction(submitDocketEntryWithoutFileAction, {
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
      applicationContext.getUseCases().fileDocketEntryInteractor,
    ).toHaveBeenCalled();
    expect(result.output).toEqual({
      caseDetail,
      caseId: caseDetail.caseId,
      docketNumber: caseDetail.docketNumber,
    });
  });
});
