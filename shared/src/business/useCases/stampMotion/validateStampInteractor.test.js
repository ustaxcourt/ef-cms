const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  validateStampInteractor,
} = require('../stampMotion/validateStampInteractor');
const { MOTION_DISPOSITIONS } = require('../../entities/EntityConstants');
const { Stamp } = require('../../entities/Stamp');

describe('validateStampInteractor', () => {
  it('returns the errors for required fields on an empty stamp form', () => {
    const errors = validateStampInteractor(applicationContext, {
      stampMotionForm: {},
    });

    expect(errors).toEqual({
      disposition: Stamp.VALIDATION_ERROR_MESSAGES.disposition,
    });
  });

  it('returns null when there are no errors', () => {
    const mockDisposition = MOTION_DISPOSITIONS.DENIED;

    const errors = validateStampInteractor(applicationContext, {
      stampMotionForm: { disposition: mockDisposition },
    });

    expect(errors).toEqual(null);
  });
});
