import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { completeDocketEntryQCAction } from './completeDocketEntryQCAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('completeDocketEntryQCAction', () => {
  const caseDetail = {
    docketEntries: [
      { docketEntryId: '123-456-789-abc', documentTitle: "bob's burgers" },
    ],
    docketNumber: '123-45',
  };

  beforeAll(() => {
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
        docketEntryId: '123-456-789-abc',
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
      docketNumber: caseDetail.docketNumber,
      updatedDocument: {
        docketEntryId: '123-456-789-abc',
        documentTitle: "bob's burgers",
      },
    });
  });
});
