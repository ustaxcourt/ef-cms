import { getEditedDocumentDetailParamsAction } from './getEditedDocumentDetailParamsAction';
import { runAction } from '@web-client/presenter/test.cerebral';

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

  it('gets the docketNumber and docketEntryId for the recently edited document', async () => {
    const result = await runAction(getEditedDocumentDetailParamsAction, {
      props: { primaryDocumentFileId: 'abc-123' },
      state: {
        caseDetail: {
          docketNumber: '123-19',
        },
      },
    });

    expect(result.output).toMatchObject({
      docketEntryId: 'abc-123',
      docketNumber: '123-19',
    });
  });
});
