import { getFileExternalDocumentAlertSuccessAction } from './getFileExternalDocumentAlertSuccessAction';
import { runAction } from 'cerebral/test';

describe('getFileExternalDocumentAlertSuccessAction', () => {
  it('should call uploadExternalDocument', async () => {
    const result = runAction(getFileExternalDocumentAlertSuccessAction, {
      props: {},
      state: {},
    });

    expect(result).toBeTruthy();
  });
});
