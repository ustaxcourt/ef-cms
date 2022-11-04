import { MOTION_DISPOSITIONS } from '../../entities/EntityConstants';
import { Stamp } from '../../entities/Stamp';
import { applicationContext } from '../../test/createTestApplicationContext';
import { validateStampInteractor } from '../stampMotion/validateStampInteractor';

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
