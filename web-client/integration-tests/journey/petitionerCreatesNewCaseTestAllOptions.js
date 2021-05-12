import { Case } from '../../../shared/src/business/entities/cases/Case';
import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { runCompute } from 'cerebral/test';
import { startCaseHelper as startCaseHelperComputed } from '../../src/presenter/computeds/startCaseHelper';
import { withAppContextDecorator } from '../../src/withAppContext';

const startCaseHelper = withAppContextDecorator(startCaseHelperComputed);

const { VALIDATION_ERROR_MESSAGES } = Case;
const { CASE_TYPES_MAP, COUNTRY_TYPES, PARTY_TYPES } =
  applicationContext.getConstants();

export const petitionerCreatesNewCaseTestAllOptions = (
  test,
  fakeFile,
  overrides = {},
) => {
  return it('petitioner creates a new case, testing all form options', async () => {
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'petitionFile',
      value: fakeFile,
    });

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'petitionFileSize',
      value: 1,
    });

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'stinFile',
      value: fakeFile,
    });

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'stinFileSize',
      value: 1,
    });

    let result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeFalsy();
    expect(result.showSecondaryContact).toBeFalsy();

    // Petitioner party type primary contact with international address
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Myself',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.countryType',
      value: COUNTRY_TYPES.INTERNATIONAL,
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.country',
      value: 'Switzerland',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.name',
      value: 'Daenerys Stormborn',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.address1',
      value: '123 Abc Ln',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.city',
      value: 'Cityville',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.postalCode',
      value: '23-skidoo',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.email',
      value: 'test@example.com',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.phone',
      value: '1234567890',
    });

    expect(test.getState('form.contactPrimary')).toEqual({
      address1: '123 Abc Ln',
      city: 'Cityville',
      country: 'Switzerland',
      countryType: COUNTRY_TYPES.INTERNATIONAL,
      email: 'test@example.com',
      name: 'Daenerys Stormborn',
      phone: '1234567890',
      postalCode: '23-skidoo',
    });

    // Petitioner party type primary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Myself',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.countryType',
      value: COUNTRY_TYPES.DOMESTIC,
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.name',
      value: 'Daenerys Stormborn',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.address1',
      value: '123 Abc Ln',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.address2',
      value: 'Apt 2',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.city',
      value: 'Cityville',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.state',
      value: 'CA',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.postalCode',
      value: '12345',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.email',
      value: 'test@example.com',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.phone',
      value: '1234567890',
    });

    expect(test.getState('form.contactPrimary')).toEqual({
      address1: '123 Abc Ln',
      address2: 'Apt 2',
      city: 'Cityville',
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'test@example.com',
      name: 'Daenerys Stormborn',
      phone: '1234567890',
      postalCode: '12345',
      state: 'CA',
    });

    // Petitioner & Spouse party type primary/secondary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Myself and my spouse',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPetitionerDeceasedSpouseForm).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'isSpouseDeceased',
      value: 'No',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();

    // Petitioner & Deceased Spouse party type primary/secondary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Myself and my spouse',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPetitionerDeceasedSpouseForm).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'isSpouseDeceased',
      value: 'Yes',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();
    expect(result.showOwnershipDisclosure).toBeFalsy();

    // Corporation party type primary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'A business',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showBusinessFilingTypeOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'businessType',
      value: PARTY_TYPES.corporation,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showOwnershipDisclosure).toBeTruthy();

    // Partnership tax matters party type primary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'A business',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showBusinessFilingTypeOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'businessType',
      value: PARTY_TYPES.partnershipAsTaxMattersPartner,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();
    expect(result.showOwnershipDisclosure).toBeTruthy();

    await test.runSequence('submitFilePetitionSequence');

    expect(test.getState('alertError').messages).toContain(
      VALIDATION_ERROR_MESSAGES.ownershipDisclosureFile,
    );

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'ownershipDisclosureFile',
      value: fakeFile,
    });

    await test.runSequence('submitFilePetitionSequence');
    expect(test.getState('alertError').messages[0]).not.toContain(
      VALIDATION_ERROR_MESSAGES.ownershipDisclosureFile,
    );

    // Partnership other than tax matters party type primary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'A business',
    });

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'hasIrsNotice',
      value: false,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showBusinessFilingTypeOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'businessType',
      value: PARTY_TYPES.partnershipOtherThanTaxMatters,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();

    // Partnership BBA party type primary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'A business',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showBusinessFilingTypeOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'businessType',
      value: PARTY_TYPES.partnershipBBA,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();

    // Estate with executor party type primary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: CASE_TYPES_MAP.other,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showOtherFilingTypeOptions).toBeTruthy();
    expect(result.showOwnershipDisclosure).toBeFalsy();
    expect(test.getState('petition.ownershipDisclosureFile')).toBeUndefined();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: 'An estate or trust',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showEstateFilingOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'estateType',
      value: PARTY_TYPES.estate,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();

    // Estate without executor party type primary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: CASE_TYPES_MAP.other,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showOtherFilingTypeOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: 'An estate or trust',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showEstateFilingOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'estateType',
      value: PARTY_TYPES.estateWithoutExecutor,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();

    // trust and trustee party type primary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: CASE_TYPES_MAP.other,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showOtherFilingTypeOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: 'An estate or trust',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showEstateFilingOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'estateType',
      value: PARTY_TYPES.trust,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();

    // conservator party type primary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: CASE_TYPES_MAP.other,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showOtherFilingTypeOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: 'A minor or legally incompetent person',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showMinorIncompetentFilingOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'minorIncompetentType',
      value: PARTY_TYPES.conservator,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();

    // guardian party type primary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: CASE_TYPES_MAP.other,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showOtherFilingTypeOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: 'A minor or legally incompetent person',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showMinorIncompetentFilingOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'minorIncompetentType',
      value: PARTY_TYPES.guardian,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();

    // custodian party type primary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: CASE_TYPES_MAP.other,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showOtherFilingTypeOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: 'A minor or legally incompetent person',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showMinorIncompetentFilingOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'minorIncompetentType',
      value: PARTY_TYPES.custodian,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();

    // minor party type primary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: CASE_TYPES_MAP.other,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showOtherFilingTypeOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: 'A minor or legally incompetent person',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showMinorIncompetentFilingOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'minorIncompetentType',
      value: PARTY_TYPES.nextFriendForMinor,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();

    // legally incompetent person party type primary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: CASE_TYPES_MAP.other,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showOtherFilingTypeOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: 'A minor or legally incompetent person',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showMinorIncompetentFilingOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'minorIncompetentType',
      value: PARTY_TYPES.nextFriendForIncompetentPerson,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();

    // donor party type primary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: CASE_TYPES_MAP.other,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showOtherFilingTypeOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: PARTY_TYPES.donor,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();

    // transferee party type primary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: CASE_TYPES_MAP.other,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showOtherFilingTypeOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: PARTY_TYPES.transferee,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(test.getState('form.partyType')).toEqual(PARTY_TYPES.transferee);

    // surviving spouse party type primary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: CASE_TYPES_MAP.other,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showOtherFilingTypeOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: 'Deceased Spouse',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();
    expect(test.getState('form.partyType')).toEqual(
      PARTY_TYPES.survivingSpouse,
    );

    await test.runSequence('submitFilePetitionSequence');

    expect(test.getState('alertError.title')).toEqual(
      'Please correct the following errors on the page:',
    );

    await test.runSequence('updateFormValueSequence', {
      key: 'day',
      value: '01',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.name',
      value: 'Daenerys Stormborn',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.secondaryName',
      value: 'Daenerys Stormborn 2',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.address1',
      value: '123 Abc Ln',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.address2',
      value: 'Apt 2',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.city',
      value: 'Cityville',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.state',
      value: 'CA',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.postalCode',
      value: '12345',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.email',
      value: 'test@example.com',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.phone',
      value: '1234567890',
    });
    expect(test.getState('form.contactPrimary')).toEqual({
      address1: '123 Abc Ln',
      address2: 'Apt 2',
      city: 'Cityville',
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'test@example.com',
      name: 'Daenerys Stormborn',
      phone: '1234567890',
      postalCode: '12345',
      secondaryName: 'Daenerys Stormborn 2',
      state: 'CA',
    });

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'hasIrsNotice',
      value: false,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showHasIrsNoticeOptions).toBeFalsy();
    expect(result.showNotHasIrsNoticeOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'hasIrsNotice',
      value: true,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showHasIrsNoticeOptions).toBeTruthy();
    expect(result.showNotHasIrsNoticeOptions).toBeFalsy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'caseType',
      value: overrides.caseType || CASE_TYPES_MAP.whistleblower,
    });

    expect(test.getState('form.contactPrimary')).toEqual({
      address1: '123 Abc Ln',
      address2: 'Apt 2',
      city: 'Cityville',
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'test@example.com',
      name: 'Daenerys Stormborn',
      phone: '1234567890',
      postalCode: '12345',
      secondaryName: 'Daenerys Stormborn 2',
      state: 'CA',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'wizardStep',
      value: '5',
    });

    await test.runSequence('submitFilePetitionSequence');

    expect(test.getState('validationErrors')).toEqual({});
    expect(test.getState('alertError')).toBeUndefined();

    expect(test.getState('currentPage')).toBe('FilePetitionSuccess');

    await test.runSequence('gotoDashboardSequence');

    expect(test.getState('currentPage')).toBe('DashboardPetitioner');
  });
};
