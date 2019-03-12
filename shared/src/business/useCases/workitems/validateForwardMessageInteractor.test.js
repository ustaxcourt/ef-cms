const {
  validateForwardMessage,
} = require('./validateForwardMessageInteractor');
const ForwardMessage = require('../../entities/ForwardMessage');

describe('validateForwardMessage', () => {
  it('returns the expected errors object on an empty message', () => {
    const errors = validateForwardMessage({
      applicationContext: {
        getEntityConstructors: () => ({
          ForwardMessage,
        }),
      },
      message: {},
    });

    expect(errors).toEqual({
      forwardMessage: 'Message is a required field.',
      forwardRecipientId: 'Send To is a required field.',
    });
  });

  it('returns the expected errors object when only forwardMessage is defined', () => {
    const errors = validateForwardMessage({
      applicationContext: {
        getEntityConstructors: () => ({
          ForwardMessage,
        }),
      },
      message: { forwardMessage: 'test message' },
    });

    expect(errors).toEqual({
      forwardRecipientId: 'Send To is a required field.',
    });
  });

  it('returns the expected errors object when only forwardRecipientId is defined', () => {
    const errors = validateForwardMessage({
      applicationContext: {
        getEntityConstructors: () => ({
          ForwardMessage,
        }),
      },
      message: { forwardRecipientId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb' },
    });

    expect(errors).toEqual({
      forwardMessage: 'Message is a required field.',
    });
  });

  it('returns no errors when forwardMessage and forwardRecipientId are defined', () => {
    const errors = validateForwardMessage({
      applicationContext: {
        getEntityConstructors: () => ({
          ForwardMessage,
        }),
      },
      message: {
        forwardMessage: 'test message',
        forwardRecipientId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
    });

    expect(errors).toEqual(null);
  });
});
