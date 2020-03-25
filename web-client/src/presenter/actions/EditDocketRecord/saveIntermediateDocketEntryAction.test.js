import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { saveIntermediateDocketEntryAction } from './saveIntermediateDocketEntryAction';

describe('saveIntermediateDocketEntryAction', () => {
  let applicationContext;
  let caseDetail;

  beforeEach(() => {
    applicationContext = applicationContextForClient;

    caseDetail = {
      caseId: '123',
      docketNumber: '123-45',
    };

    applicationContext
      .getUseCases()
      .saveIntermediateDocketEntryInteractor.mockReturnValue(caseDetail);

    presenter.providers.applicationContext = applicationContext;
  });

  it('should call saveIntermediateDocketEntryInteractor and return caseDetail', async () => {
    const result = await runAction(saveIntermediateDocketEntryAction, {
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
      applicationContext.getUseCases().saveIntermediateDocketEntryInteractor
        .mock.calls.length,
    ).toEqual(1);

    expect(result.output).toEqual({
      caseDetail,
      caseId: caseDetail.docketNumber,
    });
  });
});
