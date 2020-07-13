const { ForwardMessage } = require('./ForwardMessage');

const { VALIDATION_ERROR_MESSAGES } = ForwardMessage;

describe('ForwardMessage', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const entity = new ForwardMessage({});
      expect(entity.getFormattedValidationErrors()).toEqual({
        assigneeId: VALIDATION_ERROR_MESSAGES.assigneeId,
        forwardMessage: VALIDATION_ERROR_MESSAGES.forwardMessage,
        section: VALIDATION_ERROR_MESSAGES.section,
      });
    });

    it('should be valid when all fields are present', () => {
      const entity = new ForwardMessage({
        assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        forwardMessage:
          'If everyone is moving forward together, then success takes care of itself.',
        section: 'petitions',
      });
      expect(entity.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
