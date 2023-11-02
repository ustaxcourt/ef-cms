import { PETITIONS_SECTION } from '../../entities/EntityConstants';
import { validateCreateMessageInteractor } from './validateCreateMessageInteractor';

describe('validateCreateMessageInteractor', () => {
  it('returns null when no errors exist in the Message', () => {
    const errors = validateCreateMessageInteractor({
      message: {
        message: 'yup',
        subject: 'hi',
        toSection: PETITIONS_SECTION,
        toUserId: 'fa1179bd-04f5-4934-a716-964d8d7babc6',
      },
    });

    expect(errors).toBeNull();
  });

  it('returns an error when a subject is missing', () => {
    const errors = validateCreateMessageInteractor({
      message: {
        message: 'yup',
        toSection: PETITIONS_SECTION,
        toUserId: 'fa1179bd-04f5-4934-a716-964d8d7babc6',
      },
    });

    expect(errors).toMatchObject({
      subject: 'Enter a subject line',
    });
  });
});
