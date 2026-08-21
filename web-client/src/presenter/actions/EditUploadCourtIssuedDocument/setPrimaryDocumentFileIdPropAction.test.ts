import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setPrimaryDocumentFileIdPropAction } from './setPrimaryDocumentFileIdPropAction';

describe('setPrimaryDocumentFileIdPropAction', () => {
  it('should update the props from state', async () => {
    const result = await runAction(setPrimaryDocumentFileIdPropAction, {
      modules: { presenter },
      state: { form: { documentStorageId: '123' } },
    });

    expect(result.output.primaryDocumentFileId).toEqual('123');
  });
});
