const {
  validateForwardMessageInteractor,
} = require('./validateForwardMessageInteractor');
const { ForwardMessage } = require('../../entities/ForwardMessage');

describe('validateForwardMessageInteractor', () => {
  it('returns the expected errors object on an empty message', () => {
    const errors = validateForwardMessageInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          ForwardMessage,
        }),
      },
      message: {},
    });

    expect(errors).toEqual({
      assigneeId: 'Select a recipient',
      forwardMessage: 'Enter a message',
      section: 'Select a section',
    });
  });

  it('returns the expected errors object when only forwardMessage is defined', () => {
    const errors = validateForwardMessageInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          ForwardMessage,
        }),
      },
      message: { forwardMessage: 'test message' },
    });

    expect(errors).toEqual({
      assigneeId: 'Select a recipient',
      section: 'Select a section',
    });
  });

  it('returns the expected errors object when only section is defined', () => {
    const errors = validateForwardMessageInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          ForwardMessage,
        }),
      },
      message: { section: 'docket' },
    });

    expect(errors).toEqual({
      assigneeId: 'Select a recipient',
      forwardMessage: 'Enter a message',
    });
  });

  it('returns the expected errors object when only assigneeId is defined', () => {
    const errors = validateForwardMessageInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          ForwardMessage,
        }),
      },
      message: {
        assigneeId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        section: 'Select a section',
      },
    });

    expect(errors).toEqual({
      forwardMessage: 'Enter a message',
    });
  });

  it('returns no errors when all fields are defined', () => {
    const errors = validateForwardMessageInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          ForwardMessage,
        }),
      },
      message: {
        assigneeId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        forwardMessage: 'test message',
        section: 'docket',
      },
    });

    expect(errors).toEqual(null);
  });
});
