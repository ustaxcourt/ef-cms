const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  validateStampInteractor,
} = require('../stampMotion/validateStampInteractor');
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
    const mockStatus = 'Denied';

    const errors = validateStampInteractor(applicationContext, {
      stampMotionForm: { status: mockStatus },
    });

    expect(errors).toEqual(null);
  });
});
