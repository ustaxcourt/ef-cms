jest.mock('./replyToMessageInteractor');
const { forwardMessageInteractor } = require('./forwardMessageInteractor');
const { replyToMessage } = require('./replyToMessageInteractor');

describe('forwardMessageInteractor', () => {
  it('should call the replyToMessageInteractor with the given params', async () => {
    await forwardMessageInteractor({}, {});

    expect(replyToMessage).toHaveBeenCalled();
  });
});
