import { isWorkItemAlreadyCompletedAction } from './isWorkItemAlreadyCompletedAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('isWorkItemAlreadyCompletedAction', () => {
  let mockYesPath;
  let mockNoPath;

  beforeAll(() => {
    mockYesPath = jest.fn();
    mockNoPath = jest.fn();

    presenter.providers.path = { no: mockNoPath, yes: mockYesPath };
  });

  it('should return the yes path when the docket entry has been qced', async () => {
    const mockDocketEntryId: string = '2f951ec9-d9db-46a0-b468-ca53e301fd02';

    await runAction(isWorkItemAlreadyCompletedAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: mockDocketEntryId,
              qcComplete: true,
            },
          ],
        },
        docketEntryId: mockDocketEntryId,
      },
    });

    expect(mockYesPath).toHaveBeenCalled();
  });

  it('should return the no path when the docket entry`s work item does NOT have a completed at timestamp', async () => {
    const mockDocketEntryId: string = '2f951ec9-d9db-46a0-b468-ca53e301fd02';

    await runAction(isWorkItemAlreadyCompletedAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: mockDocketEntryId,
            },
          ],
        },
        docketEntryId: mockDocketEntryId,
      },
    });

    expect(mockNoPath).toHaveBeenCalled();
  });
});
