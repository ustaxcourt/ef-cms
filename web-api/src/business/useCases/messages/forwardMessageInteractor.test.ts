jest.mock('./replyToMessageInteractor');
import { forwardMessageInteractor } from './forwardMessageInteractor';
import { replyToMessage } from './replyToMessageInteractor';

describe('forwardMessageInteractor', () => {
  it('should call the replyToMessageInteractor with the given params', async () => {
    await forwardMessageInteractor({} as any, {} as any);

    expect(replyToMessage).toHaveBeenCalled();
  });
});
