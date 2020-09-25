import { getEditedDocumentDetailParamsAction } from './getEditedDocumentDetailParamsAction';
import { runAction } from 'cerebral/test';

describe('getEditedDocumentDetailParamsAction', () => {
  it('gets the docketNumber and docketEntryId for the recently edited document', async () => {
    const result = await runAction(getEditedDocumentDetailParamsAction, {
      state: {
        caseDetail: {
          docketNumber: '123-19',
        },
        documentToEdit: {
          docketEntryId: '321',
        },
      },
    });

    expect(result.output).toMatchObject({
      docketEntryId: '321',
      docketNumber: '123-19',
    });
  });
});
