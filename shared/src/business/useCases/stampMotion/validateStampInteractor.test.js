const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  validateStampInteractor,
} = require('../stampMotion/validateStampInteractor');
const { Stamp } = require('../../entities/Stamp');

describe('validateStampInteractor', () => {
  it('returns the expected errors object on an empty stamp form', () => {
    const errors = validateStampInteractor(applicationContext, {
      stampMotionForm: {},
    });

    expect(Object.keys(errors)).toEqual(
      Object.keys(Stamp.VALIDATION_ERROR_MESSAGES),
    );
  });

  it('returns null when there are no errors', () => {
    const mockStatus = 'Denied';

    const errors = validateStampInteractor(applicationContext, {
      stampMotionForm: { status: mockStatus },
    });

    expect(errors).toEqual(null);
  });
});
