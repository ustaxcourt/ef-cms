import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { removePdfFromCaseAction } from './removePdfFromCaseAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('removePdfFromCaseAction', () => {
  const mockDocketEntryId = '9de27a7d-7c6b-434b-803b-7655f82d5e07';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should delete the pdf associated with state.docketEntryId when state.docketEntryId is defined', async () => {
    const { output } = await runAction(removePdfFromCaseAction, {
      modules: {
        presenter,
      },
      state: {
        docketEntryId: mockDocketEntryId,
        form: {
          docketEntries: [
            {
              docketEntryId: mockDocketEntryId,
            },
            {
              docketEntryId: '123',
            },
          ],
          docketNumber: '101-19',
        },
      },
    });

    expect(output.caseDetail.docketEntries).toEqual([
      {
        docketEntryId: '123',
      },
    ]);
  });

  it('should return case detail docket entries unchanged if requested docketEntryId is not found within', async () => {
    const docketEntries = [
      {
        docketEntryId: mockDocketEntryId,
      },
      {
        docketEntryId: '123',
      },
    ];
    const { output } = await runAction(removePdfFromCaseAction, {
      modules: {
        presenter,
      },
      state: {
        docketEntryId: 'some-other-id',
        form: {
          docketEntries,
          docketNumber: '101-19',
        },
      },
    });

    expect(output.caseDetail.docketEntries).toEqual(docketEntries);
  });

  it('should delete the pdf from the form when state.currentViewMetadata.documentSelectedForPreview is defined', async () => {
    const { state } = await runAction(removePdfFromCaseAction, {
      modules: {
        presenter,
      },
      state: {
        currentViewMetadata: {
          documentSelectedForPreview: 'applicationForWaiverOfFilingFeeFile',
        },
        form: {
          applicationForWaiverOfFilingFeeFile: {},
          applicationForWaiverOfFilingFeeFileSize: 2,
          docketEntries: [
            {
              docketEntryId: mockDocketEntryId,
            },
            {
              docketEntryId: '123',
            },
          ],
          docketNumber: '101-19',
        },
      },
    });

    expect(state.form.applicationForWaiverOfFilingFeeFile).toBeUndefined();
  });

  it('should return caseDetail from form unchanged if form contains no docket entries', async () => {
    const { output } = await runAction(removePdfFromCaseAction, {
      modules: {
        presenter,
      },
      state: {
        docketEntryId: mockDocketEntryId,
        form: {
          something: 'else',
        },
      },
    });

    expect(output.caseDetail).toEqual({ something: 'else' });
  });

  it('return the updated case detail', async () => {
    const { output } = await runAction(removePdfFromCaseAction, {
      modules: {
        presenter,
      },
      state: {
        docketEntryId: mockDocketEntryId,
        form: {
          docketEntries: [
            {
              docketEntryId: mockDocketEntryId,
            },
            {
              docketEntryId: '123',
            },
          ],
          docketNumber: '101-19',
        },
      },
    });

    expect(output.caseDetail).toEqual({
      docketEntries: [
        {
          docketEntryId: '123',
        },
      ],
      docketNumber: '101-19',
    });
  });

  it('return the document upload mode', async () => {
    const { output } = await runAction(removePdfFromCaseAction, {
      modules: {
        presenter,
      },
      state: {
        docketEntryId: mockDocketEntryId,
        form: {
          docketEntries: [
            {
              docketEntryId: mockDocketEntryId,
            },
            {
              docketEntryId: '123',
            },
          ],
          docketNumber: '101-19',
        },
      },
    });

    expect(output.documentUploadMode).toBe('scan');
  });
});
