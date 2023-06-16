import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setPrimaryCorrespondenceFileIdPropAction } from './setPrimaryCorrespondenceFileIdPropAction';

describe('setPrimaryCorrespondenceFileIdPropAction', () => {
  it('should update the props from state', async () => {
    const result = await runAction(setPrimaryCorrespondenceFileIdPropAction, {
      modules: { presenter },
      state: { form: { correspondenceId: '123' } },
    });

    expect(result.output.primaryDocumentFileId).toEqual('123');
  });
});
