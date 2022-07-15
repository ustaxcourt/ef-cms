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
      status: Stamp.VALIDATION_ERROR_MESSAGES.status,
    });
  });

  it('returns null when there are no errors', () => {
    const mockStatus = MOTION_DISPOSITIONS.DENIED;

    const errors = validateStampInteractor(applicationContext, {
      stampMotionForm: { status: mockStatus },
    });

    expect(errors).toEqual(null);
  });
});
