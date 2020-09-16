jest.mock('./replyToMessageInteractor');
const { replyToMessage } = require('./replyToMessageInteractor');

const { forwardMessageInteractor } = require('./forwardMessageInteractor');

describe('forwardMessageInteractor', () => {
  it('should call the replyToMessageInteractor with the given params', async () => {
    await forwardMessageInteractor({});

    expect(replyToMessage).toHaveBeenCalled();
  });
});
