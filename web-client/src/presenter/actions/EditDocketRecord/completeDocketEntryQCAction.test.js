import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { completeDocketEntryQCAction } from './completeDocketEntryQCAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('completeDocketEntryQCAction', () => {
  const mockDocketEntryId = '123-456-789-abc';

  const caseDetail = {
    docketEntries: [
      { docketEntryId: mockDocketEntryId, documentTitle: "bob's burgers" },
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
        docketEntryId: mockDocketEntryId,
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
        docketEntryId: mockDocketEntryId,
        documentTitle: "bob's burgers",
      },
    });
  });

  it('should return the full document title with additional info as a part of props.alertSuccess.message', async () => {
    caseDetail.docketEntries[0] = {
      ...caseDetail.docketEntries[0],
      addToCoversheet: true,
      additionalInfo: 'More title information',
    };

    const { output } = await runAction(completeDocketEntryQCAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail,
        docketEntryId: mockDocketEntryId,
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(output.alertSuccess.message).toEqual(
      "bob's burgers More title information has been completed.",
    );
  });
});
