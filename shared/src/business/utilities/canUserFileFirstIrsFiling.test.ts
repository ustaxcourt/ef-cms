import { canUserFileFirstIrsFiling } from '@shared/business/utilities/canUserFileFirstIrsFiling';
import { MOCK_CASE } from '@shared/test/mockCase';
import {
  dojPractitionerUser,
  irsPractitionerUser,
  privatePractitionerUser,
} from '@shared/test/mockUsers';

describe('canUserFileFirstIrsFiling', () => {
  it('should allow IRS practitioner to file on unsealed case with no respondent', () => {
    expect(canUserFileFirstIrsFiling(irsPractitionerUser, MOCK_CASE)).toEqual(
      true,
    );
  });

  it('should not allow IRS practitioner to file on sealed case with no respondent', () => {
    expect(
      canUserFileFirstIrsFiling(
        irsPractitionerUser,

        {
          ...MOCK_CASE,
          isSealed: true,
        },
      ),
    ).toEqual(false);
  });

  it('should not allow IRS practitioner to file on unsealed case with a respondent', () => {
    expect(
      canUserFileFirstIrsFiling(
        irsPractitionerUser,

        {
          ...MOCK_CASE,
          irsPractitioners: [irsPractitionerUser],
        },
      ),
    ).toEqual(false);
  });

  it('should not allow DOJ practitioner to file on unsealed case with no respondent', () => {
    expect(canUserFileFirstIrsFiling(dojPractitionerUser, MOCK_CASE)).toEqual(
      false,
    );
  });

  it('should not allow a non-IRS practitioner to file on unsealed case with no respondent', () => {
    expect(
      canUserFileFirstIrsFiling(privatePractitionerUser, MOCK_CASE),
    ).toEqual(false);
  });
});
