import { checkMultiDocketedOriginalCaseAction } from './checkMultiDocketedOriginalCaseAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('checkMultiDocketedOriginalCaseAction', () => {
  const mockDocketEntryId = 'test-docket-entry-id';
  const mockDocketNumber = '101-20';
  const originallyFiledDocketNumber = '100-20';

  it('should find the docket entry by docketEntryId when index does not match', async () => {
    const result = await runAction(checkMultiDocketedOriginalCaseAction, {
      modules: { presenter },
      props: {
        mockDocketEntryId,
        docketRecordIndex: 999,
      },
      state: {
        caseDetail: {
          docketEntries: [
            {
              mockDocketEntryId,
              mockDocketNumber,
              index: 1,
              multiDocketedOn: ['ABC', 'DEF'],
              originallyFiledDocketNumber,
            },
          ],
        },
      },
    });

    expect(result.output).toEqual({ originallyFiledDocketNumber });
  });

  it('should throw an error if the docket entry was not found', async () => {
    await expect(
      runAction(checkMultiDocketedOriginalCaseAction, {
        modules: { presenter },
        props: {
          mockDocketEntryId: 'non-existent-id',
          docketRecordIndex: 999,
        },
        state: {
          caseDetail: {
            docketEntries: [],
          },
        },
      }),
    ).rejects.toThrow('Could not find docket entry with index 999');
  });

  it('should return undefined if the docket entry is not multidocketed', async () => {
    const result = await runAction(checkMultiDocketedOriginalCaseAction, {
      modules: { presenter },
      props: {
        mockDocketEntryId,
        docketRecordIndex: 1,
      },
      state: {
        caseDetail: {
          docketEntries: [
            {
              mockDocketEntryId,
              mockDocketNumber,
              index: 1,
              multiDocketedOn: [],
              originallyFiledDocketNumber,
            },
          ],
        },
      },
    });

    expect(result.output).toBeUndefined();
  });

  it('should return the originallyFiledDocketNumber when the entry is multidocketed and not currently on the originally filed case', async () => {
    const result = await runAction(checkMultiDocketedOriginalCaseAction, {
      modules: { presenter },
      props: {
        mockDocketEntryId,
        docketRecordIndex: 1,
      },
      state: {
        caseDetail: {
          docketEntries: [
            {
              mockDocketEntryId,
              mockDocketNumber,
              index: 1,
              multiDocketedOn: ['ABC', 'DEF'],
              originallyFiledDocketNumber,
            },
          ],
        },
      },
    });

    expect(result.output).toEqual({ originallyFiledDocketNumber });
  });
});
