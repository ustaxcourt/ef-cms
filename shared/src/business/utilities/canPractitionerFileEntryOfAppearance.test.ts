import { canPractitionerFileEntryOfAppearance } from '@shared/business/utilities/canPractitionerFileEntryOfAppearance';
import { MOCK_CASE } from '@shared/test/mockCase';
import {
  dojPractitionerUser,
  irsPractitionerUser,
  privatePractitionerUser,
} from '@shared/test/mockUsers';

describe('canPractitionerFileEntryOfAppearance', () => {
  it('should allow private practitioner to file on unsealed case with no pending association', () => {
    expect(
      canPractitionerFileEntryOfAppearance({
        user: privatePractitionerUser,
        caseDetail: MOCK_CASE,
        hasPendingAssociation: false,
      }),
    ).toEqual(true);
  });

  it('should not allow private practitioner to file on sealed case', () => {
    expect(
      canPractitionerFileEntryOfAppearance({
        user: privatePractitionerUser,
        caseDetail: { ...MOCK_CASE, isSealed: true },
        hasPendingAssociation: false,
      }),
    ).toEqual(false);
  });

  it('should not allow private practitioner to file on case with a pending association', () => {
    expect(
      canPractitionerFileEntryOfAppearance({
        user: privatePractitionerUser,
        caseDetail: MOCK_CASE,
        hasPendingAssociation: true,
      }),
    ).toEqual(false);
  });

  it('should allow IRS practitioner to file on unsealed case with a respondent', () => {
    expect(
      canPractitionerFileEntryOfAppearance({
        user: irsPractitionerUser,
        caseDetail: {
          ...MOCK_CASE,
          irsPractitioners: [irsPractitionerUser],
        },
      }),
    ).toEqual(true);
  });

  it('should not allow IRS practitioner to file on sealed case', () => {
    expect(
      canPractitionerFileEntryOfAppearance({
        user: irsPractitionerUser,
        caseDetail: {
          ...MOCK_CASE,
          isSealed: true,
          irsPractitioners: [irsPractitionerUser],
        },
      }),
    ).toEqual(false);
  });

  it('should not allow IRS practitioner to file on case with no respondent', () => {
    expect(
      canPractitionerFileEntryOfAppearance({
        user: irsPractitionerUser,
        caseDetail: MOCK_CASE,
      }),
    ).toEqual(false);
  });

  it('should allow DOJ practitioner to file on case on appeal', () => {
    expect(
      canPractitionerFileEntryOfAppearance({
        user: dojPractitionerUser,
        caseDetail: {
          ...MOCK_CASE,
          irsPractitioners: [irsPractitionerUser],
        },
        canDojPractitionersRepresentParty: true,
      }),
    ).toEqual(true);
  });

  it('should not allow DOJ practitioner to file on case not on appeal', () => {
    expect(
      canPractitionerFileEntryOfAppearance({
        user: dojPractitionerUser,
        caseDetail: {
          ...MOCK_CASE,
          irsPractitioners: [irsPractitionerUser],
        },
        canDojPractitionersRepresentParty: false,
      }),
    ).toEqual(false);
  });

  it('should not allow DOJ practitioner to file on case with no respondent', () => {
    expect(
      canPractitionerFileEntryOfAppearance({
        user: dojPractitionerUser,
        caseDetail: MOCK_CASE,
        canDojPractitionersRepresentParty: true,
      }),
    ).toEqual(false);
  });

  it('should not allow DOJ practitioner to file on sealed case', () => {
    expect(
      canPractitionerFileEntryOfAppearance({
        user: dojPractitionerUser,
        caseDetail: {
          ...MOCK_CASE,
          irsPractitioners: [irsPractitionerUser],
          isSealed: true,
        },
        canDojPractitionersRepresentParty: true,
      }),
    ).toEqual(false);
  });
});
