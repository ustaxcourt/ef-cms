jest.mock('./replyToMessageInteractor');
import { forwardMessageInteractor } from './forwardMessageInteractor';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { replyToMessage } from './replyToMessageInteractor';

describe('forwardMessageInteractor', () => {
  it('should call the replyToMessageInteractor with the given params', async () => {
    await forwardMessageInteractor({} as any, {} as any, mockDocketClerkUser);

    expect(replyToMessage).toHaveBeenCalled();
  });
});
