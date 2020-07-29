import { getEditedDocumentDetailParamsAction } from './getEditedDocumentDetailParamsAction';
import { runAction } from 'cerebral/test';

describe('getEditedDocumentDetailParamsAction', () => {
  it('gets the docketNumber and documentId for the recently edited document', async () => {
    const result = await runAction(getEditedDocumentDetailParamsAction, {
      state: {
        caseDetail: {
          docketNumber: '123-19',
        },
        documentToEdit: {
          documentId: '321',
        },
      },
    });

    expect(result.output).toMatchObject({
      docketNumber: '123-19',
      documentId: '321',
    });
  });
});
