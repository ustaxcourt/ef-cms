import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { completeDocketEntryQCAction } from './completeDocketEntryQCAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('completeDocketEntryQCAction', () => {
  let applicationContext;
  let caseDetail;

  beforeEach(() => {
    applicationContext = applicationContextForClient;

    caseDetail = {
      caseId: '123',
      docketNumber: '123-45',
      documents: [
        { documentId: '123-456-789-abc', documentTitle: "bob's burgers" },
      ],
    };

    applicationContext
      .getUseCases()
      .completeDocketEntryQCInteractor.mockReturnValue({ caseDetail });

    presenter.providers.applicationContext = applicationContext;
  });

  it('should call completeDocketEntryQCInteractor and return caseDetail', async () => {
    const result = await runAction(completeDocketEntryQCAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail,
        documentId: '123-456-789-abc',
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(
      applicationContext.getUseCases().completeDocketEntryQCInteractor.mock
        .calls.length,
    ).toEqual(1);

    expect(result.output).toEqual({
      alertSuccess: {
        message: "bob's burgers has been completed.",
        title: 'QC Completed',
      },
      caseDetail,
      caseId: caseDetail.docketNumber,
      updatedDocument: {
        documentId: '123-456-789-abc',
        documentTitle: "bob's burgers",
      },
    });
  });
});
