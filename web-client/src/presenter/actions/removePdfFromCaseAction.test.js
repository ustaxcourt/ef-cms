import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { removePdfFromCaseAction } from './removePdfFromCaseAction';
import { runAction } from 'cerebral/test';

describe('removePdfFromCaseAction', () => {
  const mockDocketEntryId = 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859';

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
