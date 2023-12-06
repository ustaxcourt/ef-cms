import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setPreviousDocumentDocketEntryAction } from './setPreviousDocumentDocketEntryAction';

describe('setPreviousDocumentDocketEntryAction', () => {
  it('should not set previousDocument if it does not already exist', async () => {
    const result = await runAction(setPreviousDocumentDocketEntryAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          docketEntries: [
            { docketEntryId: 'some-id', documentTitle: 'a title' },
          ],
          docketNumber: '101-19',
        },
        form: {},
      },
    });

    expect(result.state.form.previousDocument).toBeUndefined();
  });

  it('should not unset previousDocument if the DocketEntry is not found', async () => {
    const result = await runAction(setPreviousDocumentDocketEntryAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          docketEntries: [],
          docketNumber: '102-19',
        },
        form: { previousDocument: { docketEntryId: 'some-id' } },
      },
    });

    expect(result.state.form.previousDocument).toEqual({
      docketEntryId: 'some-id',
    });
  });

  it('should set previousDocument to the DocketEntry when it does exist', async () => {
    const result = await runAction(setPreviousDocumentDocketEntryAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          docketEntries: [
            { docketEntryId: 'some-id', documentTitle: 'a title' },
          ],
          docketNumber: '102-19',
        },
        form: { previousDocument: { docketEntryId: 'some-id' } },
      },
    });

    expect(result.state.form.previousDocument).toEqual({
      docketEntryId: 'some-id',
      documentTitle: 'a title',
    });
  });
});
