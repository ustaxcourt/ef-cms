import { ContactFactoryUpdated } from '@shared/business/entities/contacts/ContactFactoryUpdated';
import { PARTY_TYPES } from '@shared/business/entities/EntityConstants';

describe('ContactFactoryUpdated', () => {
  const TEST_PETITION_TYPE = 'TEST_PETITION_TYPE';
  const EMPTY_VALUE = null as unknown as any;

  it('should should return "null" for both primary and secondary when primary contact is not passed in', () => {
    const { primary, secondary } = ContactFactoryUpdated({
      contactInfoPrimary: EMPTY_VALUE,
      contactInfoSecondary: EMPTY_VALUE,
      filingType: 'Myself',
      hasSpouseConsent: false,
      partyType: '',
      petitionType: '',
    });

    expect(primary).toEqual(null);
    expect(secondary).toEqual(null);
  });

  [
    PARTY_TYPES.corporation,
    PARTY_TYPES.partnershipBBA,
    PARTY_TYPES.partnershipOtherThanTaxMatters,
    PARTY_TYPES.partnershipAsTaxMattersPartner,
  ].forEach((partyType: string) => {
    it(`should return a "BusinessContact" for primary and null for secondary when partyType is "${partyType}"`, () => {
      const { primary, secondary } = ContactFactoryUpdated({
        contactInfoPrimary: {},
        contactInfoSecondary: EMPTY_VALUE,
        filingType: 'Myself',
        hasSpouseConsent: false,
        partyType,
        petitionType: TEST_PETITION_TYPE,
      });

      expect(primary).toMatchObject({
        entityName: 'BusinessContact',
        partyType,
        petitionType: TEST_PETITION_TYPE,
      });
      expect(secondary).toEqual(null);
    });
  });

  it('should return a "ContactUpdated" for primary and null for secondary when partyType is "petitionerDeceasedSpouse" and secondary is not passed in', () => {
    const { primary, secondary } = ContactFactoryUpdated({
      contactInfoPrimary: {},
      contactInfoSecondary: EMPTY_VALUE,
      filingType: 'Myself and my spouse',
      hasSpouseConsent: false,
      partyType: PARTY_TYPES.petitionerDeceasedSpouse,
      petitionType: TEST_PETITION_TYPE,
    });

    expect(primary).toMatchObject({
      entityName: 'PetitionerPrimaryContact',
      partyType: PARTY_TYPES.petitionerDeceasedSpouse,
      petitionType: TEST_PETITION_TYPE,
    });
    expect(secondary).toEqual(null);
  });

  it('should return a "ContactUpdated" for primary and "DeceasedSpouseContact" for secondary when partyType is "petitionerDeceasedSpouse"', () => {
    const { primary, secondary } = ContactFactoryUpdated({
      contactInfoPrimary: {},
      contactInfoSecondary: {},
      filingType: 'Myself and my spouse',
      hasSpouseConsent: false,
      partyType: PARTY_TYPES.petitionerDeceasedSpouse,
      petitionType: TEST_PETITION_TYPE,
    });
    expect(primary).toMatchObject({
      entityName: 'PetitionerPrimaryContact',
      partyType: PARTY_TYPES.petitionerDeceasedSpouse,
      petitionType: TEST_PETITION_TYPE,
    });
    expect(secondary).toMatchObject({
      entityName: 'DeceasedSpouseContact',
      partyType: PARTY_TYPES.petitionerDeceasedSpouse,
      petitionType: TEST_PETITION_TYPE,
    });
  });

  it('should return a "ContactUpdated" for primary and null for secondary when partyType is "petitionerSpouse" and secondary is not passed in', () => {
    const { primary, secondary } = ContactFactoryUpdated({
      contactInfoPrimary: {},
      contactInfoSecondary: EMPTY_VALUE,
      filingType: 'Myself and my spouse',
      hasSpouseConsent: false,
      partyType: PARTY_TYPES.petitionerSpouse,
      petitionType: TEST_PETITION_TYPE,
    });

    expect(primary).toMatchObject({
      entityName: 'PetitionerPrimaryContact',
      partyType: PARTY_TYPES.petitionerSpouse,
      petitionType: TEST_PETITION_TYPE,
    });
    expect(secondary).toEqual(null);
  });

  it('should return a "ContactUpdated" for primary and null for secondary when partyType is "petitionerSpouse" and secondary is passed in but hasSpouseConsent is false', () => {
    const { primary, secondary } = ContactFactoryUpdated({
      contactInfoPrimary: {},
      contactInfoSecondary: {},
      filingType: 'Myself and my spouse',
      hasSpouseConsent: false,
      partyType: PARTY_TYPES.petitionerSpouse,
      petitionType: TEST_PETITION_TYPE,
    });

    expect(primary).toMatchObject({
      entityName: 'PetitionerPrimaryContact',
      partyType: PARTY_TYPES.petitionerSpouse,
      petitionType: TEST_PETITION_TYPE,
    });
    expect(secondary).toBeFalsy();
  });

  it('should return a "ContactUpdated" for primary and "SpouseContact" for secondary when partyType is "petitionerSpouse" and "hasSpouseConsent" is true', () => {
    const { primary, secondary } = ContactFactoryUpdated({
      contactInfoPrimary: {},
      contactInfoSecondary: {},
      filingType: 'Myself and my spouse',
      hasSpouseConsent: true,
      partyType: PARTY_TYPES.petitionerSpouse,
      petitionType: TEST_PETITION_TYPE,
    });

    expect(primary).toMatchObject({
      entityName: 'PetitionerPrimaryContact',
      partyType: PARTY_TYPES.petitionerSpouse,
      petitionType: TEST_PETITION_TYPE,
    });
    expect(secondary).toMatchObject({
      entityName: 'SpouseContact',
      partyType: PARTY_TYPES.petitionerSpouse,
      petitionType: TEST_PETITION_TYPE,
    });
  });

  [
    PARTY_TYPES.estate,
    PARTY_TYPES.estateWithoutExecutor,
    PARTY_TYPES.trust,
    PARTY_TYPES.conservator,
    PARTY_TYPES.guardian,
    PARTY_TYPES.custodian,
    PARTY_TYPES.nextFriendForMinor,
    PARTY_TYPES.nextFriendForIncompetentPerson,
    PARTY_TYPES.survivingSpouse,
  ].forEach((partyType: string) => {
    it(`should return a "OtherContact" for primary and null for secondary when partyType is "${partyType}"`, () => {
      const { primary, secondary } = ContactFactoryUpdated({
        contactInfoPrimary: {},
        contactInfoSecondary: {},
        filingType: 'Other',
        hasSpouseConsent: false,
        partyType,
        petitionType: TEST_PETITION_TYPE,
      });

      expect(primary).toMatchObject({
        entityName: 'OtherContact',
        partyType,
        petitionType: TEST_PETITION_TYPE,
      });
      expect(secondary).toEqual(null);
    });
  });

  it('should return default primary and secondary when partyType is a random string', () => {
    const { primary, secondary } = ContactFactoryUpdated({
      contactInfoPrimary: {},
      contactInfoSecondary: {},
      filingType: 'Other',
      hasSpouseConsent: false,
      partyType: 'SOMETHING_RANDOM',
      petitionType: TEST_PETITION_TYPE,
    });

    expect(primary).toMatchObject({
      entityName: 'PetitionerPrimaryContact',
      partyType: 'SOMETHING_RANDOM',
      petitionType: TEST_PETITION_TYPE,
    });
    expect(secondary).toBe(null);
  });
});
