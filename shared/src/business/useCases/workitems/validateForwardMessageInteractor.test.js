const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  validateForwardMessageInteractor,
} = require('./validateForwardMessageInteractor');
const { ForwardMessage } = require('../../entities/ForwardMessage');

const { VALIDATION_ERROR_MESSAGES } = ForwardMessage;

describe('validateForwardMessageInteractor', () => {
  it('returns the expected errors object on an empty message', () => {
    const errors = validateForwardMessageInteractor({
      applicationContext,
      message: {},
    });

    expect(errors).toEqual({
      assigneeId: VALIDATION_ERROR_MESSAGES.assigneeId,
      forwardMessage: VALIDATION_ERROR_MESSAGES.forwardMessage,
      section: VALIDATION_ERROR_MESSAGES.section,
    });
  });

  it('returns the expected errors object when only forwardMessage is defined', () => {
    const errors = validateForwardMessageInteractor({
      applicationContext,
      message: { forwardMessage: 'test message' },
    });

    expect(errors).toEqual({
      assigneeId: VALIDATION_ERROR_MESSAGES.assigneeId,
      section: VALIDATION_ERROR_MESSAGES.section,
    });
  });

  it('returns the expected errors object when only section is defined', () => {
    const errors = validateForwardMessageInteractor({
      applicationContext,
      message: { section: 'docket' },
    });

    expect(errors).toEqual({
      assigneeId: VALIDATION_ERROR_MESSAGES.assigneeId,
      forwardMessage: VALIDATION_ERROR_MESSAGES.forwardMessage,
    });
  });

  it('returns the expected errors object when only assigneeId is defined', () => {
    const errors = validateForwardMessageInteractor({
      applicationContext,
      message: {
        assigneeId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
    });

    expect(errors).toEqual({
      forwardMessage: VALIDATION_ERROR_MESSAGES.forwardMessage,
      section: VALIDATION_ERROR_MESSAGES.section,
    });
  });

  it('returns no errors when all fields are defined', () => {
    const errors = validateForwardMessageInteractor({
      applicationContext,
      message: {
        assigneeId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        forwardMessage: 'test message',
        section: 'docket',
      },
    });

    expect(errors).toEqual(null);
  });
});
