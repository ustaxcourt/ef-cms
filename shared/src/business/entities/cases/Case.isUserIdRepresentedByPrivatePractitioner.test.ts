import { Case, isUserIdRepresentedByPrivatePractitioner } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('isUserIdRepresentedByPrivatePractitioner', () => {
  let caseEntity;

  beforeAll(() => {
    caseEntity = new Case(
      {
        ...MOCK_CASE,
        privatePractitioners: [
          {
            barNumber: 'PP123',
            representing: ['123'],
          },
          {
            barNumber: 'PP234',
            representing: ['234', '456'],
          },
        ],
      },
      {
        applicationContext,
      },
    );
  });

  it('returns true if there is a privatePractitioner representing the given userId', () => {
    expect(caseEntity.isUserIdRepresentedByPrivatePractitioner('456')).toEqual(
      true,
    );
  });

  it('returns false if there is NO privatePractitioner representing the given userId', () => {
    expect(caseEntity.isUserIdRepresentedByPrivatePractitioner('678')).toEqual(
      false,
    );
  });

  it('returns true if there is a privatePractitioner representing the given userId', () => {
    expect(
      isUserIdRepresentedByPrivatePractitioner(caseEntity.toRawObject(), '456'),
    ).toEqual(true);
  });

  it('returns false if there is NO privatePractitioner representing the given userId', () => {
    expect(
      isUserIdRepresentedByPrivatePractitioner(caseEntity.toRawObject(), '789'),
    ).toEqual(false);
  });

  it('returns false if there are no private practitioners defined on a case', () => {
    const newCaseEntityWithoutPractitioners = new Case(
      {
        ...MOCK_CASE,
        privatePractitioners: undefined,
      },
      {
        applicationContext,
      },
    );

    expect(
      isUserIdRepresentedByPrivatePractitioner(
        newCaseEntityWithoutPractitioners.toRawObject(),
        '789',
      ),
    ).toEqual(false);
  });
});
