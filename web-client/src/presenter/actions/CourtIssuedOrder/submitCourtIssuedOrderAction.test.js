import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { submitCourtIssuedOrderAction } from './submitCourtIssuedOrderAction';

describe('submitCourtIssuedOrderAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContextForClient;
  });

  it('should call fileCourtIssuedOrder', async () => {
    applicationContextForClient
      .getUseCases()
      .fileCourtIssuedOrderInteractor.mockReturnValue({ documents: [] });

    await runAction(submitCourtIssuedOrderAction, {
      modules: {
        presenter,
      },
      props: {
        primaryDocumentFileId: 'abc',
      },
      state: {
        caseDetail: {},
        form: {
          documentType: 'Notice of Intervention',
          primaryDocumentFile: {},
        },
      },
    });

    expect(
      applicationContextForClient.getUseCases().fileCourtIssuedOrderInteractor,
    ).toBeCalled();
    expect(
      applicationContextForClient.getUseCases().validatePdfInteractor,
    ).toBeCalled();
    expect(
      applicationContextForClient.getUseCases().virusScanPdfInteractor,
    ).toBeCalled();
  });
});
