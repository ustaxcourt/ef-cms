import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setIsFiledAcrossAllCasesAction } from './setIsFiledAcrossAllCasesAction';

jest.mock('@shared/proxies/getIsFiledAcrossAllCasesProxy');

const { getIsFiledAcrossAllCasesInteractor } = jest.requireMock(
  '@shared/proxies/getIsFiledAcrossAllCasesProxy',
);

describe('setIsFiledAcrossAllCasesAction', () => {
  const mockDocketEntryId = 'test-docket-entry-id-123';
  const mockDocketRecordIndex = 1;

  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;

    getIsFiledAcrossAllCasesInteractor.mockResolvedValue(false);
  });

  it('should set isFiledAcrossAllCases to true when the docket entry is filed across all cases', async () => {
    getIsFiledAcrossAllCasesInteractor.mockResolvedValue(true);

    const result = await runAction(setIsFiledAcrossAllCasesAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: mockDocketEntryId,
              index: mockDocketRecordIndex,
            },
          ],
        },
        docketRecordIndex: mockDocketRecordIndex,
      },
    });

    expect(getIsFiledAcrossAllCasesInteractor).toHaveBeenCalledWith({
      docketEntryId: mockDocketEntryId,
    });
    expect(result.state.isFiledAcrossAllCases).toBe(true);
  });

  it('should set isFiledAcrossAllCases to false when the docket entry is not filed across all cases', async () => {
    getIsFiledAcrossAllCasesInteractor.mockResolvedValue(false);

    const result = await runAction(setIsFiledAcrossAllCasesAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: mockDocketEntryId,
              index: mockDocketRecordIndex,
            },
          ],
        },
        docketRecordIndex: mockDocketRecordIndex,
      },
    });

    expect(result.state.isFiledAcrossAllCases).toBe(false);
  });

  it('should set isFiledAcrossAllCases to false when document detail is not found', async () => {
    const result = await runAction(setIsFiledAcrossAllCasesAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: mockDocketEntryId,
              index: 999,
            },
          ],
        },
        docketRecordIndex: mockDocketRecordIndex,
      },
    });

    expect(getIsFiledAcrossAllCasesInteractor).not.toHaveBeenCalled();
    expect(result.state.isFiledAcrossAllCases).toBe(false);
  });

  it('should set isFiledAcrossAllCases to false when docketEntryId is missing', async () => {
    const result = await runAction(setIsFiledAcrossAllCasesAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          docketEntries: [
            {
              index: mockDocketRecordIndex,
            },
          ],
        },
        docketRecordIndex: mockDocketRecordIndex,
      },
    });

    expect(getIsFiledAcrossAllCasesInteractor).not.toHaveBeenCalled();
    expect(result.state.isFiledAcrossAllCases).toBe(false);
  });

  it('should set isFiledAcrossAllCases to false when the interactor throws an error', async () => {
    getIsFiledAcrossAllCasesInteractor.mockRejectedValue(
      new Error('Test error'),
    );

    const result = await runAction(setIsFiledAcrossAllCasesAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: mockDocketEntryId,
              index: mockDocketRecordIndex,
            },
          ],
        },
        docketRecordIndex: mockDocketRecordIndex,
      },
    });

    expect(result.state.isFiledAcrossAllCases).toBe(false);
  });
});
