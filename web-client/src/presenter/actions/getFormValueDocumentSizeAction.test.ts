import { getFormValueDocumentSizeAction } from './getFormValueDocumentSizeAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getFormValueDocumentSizeAction', () => {
  it('should return the document size key and file size as a key/value pair', async () => {
    const result = await runAction(getFormValueDocumentSizeAction, {
      props: {
        documentType: 'petition',
        file: {
          size: 100,
        },
      },
    });

    expect(result.output).toMatchObject({
      key: 'petitionSize',
      value: 100,
    });
  });
});
