import { getFormValueDocumentAction } from './getFormValueDocumentAction';
import { runAction } from '@web-client/presenter/test.cerebral';

const fakeFile = {
  name: 'petition',
  size: 100,
};

describe('getFormValueDocumentAction', () => {
  it('should return the document type and file as a key/value pair', async () => {
    const result = await runAction(getFormValueDocumentAction, {
      props: {
        documentType: 'petition',
        file: fakeFile,
      },
    });

    expect(result.output).toMatchObject({
      key: 'petition',
      value: fakeFile,
    });
  });
});
