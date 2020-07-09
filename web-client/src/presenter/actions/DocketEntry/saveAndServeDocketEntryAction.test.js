import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { saveAndServeDocketEntryAction } from './saveAndServeDocketEntryAction';

presenter.providers.applicationContext = applicationContext;

describe('saveAndServeDocketEntryAction', () => {
  let caseDetail;

  beforeAll(() => {
    caseDetail = {
      caseId: '123',
      docketNumber: '123-45',
    };
  });

  it('should call saveAndServeDocketEntryAction and return caseDetail', async () => {
    applicationContext
      .getUseCases()
      .fileDocketEntryInteractor.mockReturnValue(caseDetail);

    const result = await runAction(saveAndServeDocketEntryAction, {
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
      applicationContext.getUseCases().addCoversheetInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().fileDocketEntryInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().validatePdfInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().virusScanPdfInteractor,
    ).toHaveBeenCalled();
    expect(result.output).toEqual({
      caseDetail,
      caseId: caseDetail.caseId,
      docketNumber: caseDetail.docketNumber,
    });
  });
});
