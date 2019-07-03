import { runCompute } from 'cerebral/test';
const {
  ContactFactory,
} = require('../../../shared/src/business/entities/contacts/ContactFactory');

import { startCaseHelper } from '../../src/presenter/computeds/startCaseHelper';

export default (test, fakeFile, overrides = {}) => {
  return it('Taxpayer creates a new case', async () => {
    await test.runSequence('updatePetitionValueSequence', {
      key: 'petitionFile',
      value: fakeFile,
    });

    await test.runSequence('updatePetitionValueSequence', {
      key: 'petitionFileSize',
      value: 1,
    });

    await test.runSequence('updatePetitionValueSequence', {
      key: 'stinFile',
      value: fakeFile,
    });

    await test.runSequence('updatePetitionValueSequence', {
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
      value: 'international',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.country',
      value: 'Switzerland',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.name',
      value: 'Test Person',
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
      countryType: 'international',
      email: 'test@example.com',
      name: 'Test Person',
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
      value: 'domestic',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.name',
      value: 'Test Person',
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
      countryType: 'domestic',
      email: 'test@example.com',
      name: 'Test Person',
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
      value: 'Corporation',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showOwnershipDisclosure).toBeTruthy();

    // Partnership tax matters party type primary/secondary contact
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
      value: 'Partnership (as the tax matters partner)',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();
    expect(result.showOwnershipDisclosure).toBeTruthy();

    await test.runSequence('submitFilePetitionSequence');

    expect(test.getState('alertError').messages).toContain(
      'Ownership Disclosure Statement is required.',
    );

    await test.runSequence('updatePetitionValueSequence', {
      key: 'ownershipDisclosureFile',
      value: fakeFile,
    });

    await test.runSequence('submitFilePetitionSequence');
    expect(test.getState('alertError').messages[0]).not.toContain(
      'Ownership Disclosure Statement is required.',
    );

    // Partnership other than tax matters party type primary/secondary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'A business',
    });

    await test.runSequence('updateHasIrsNoticeFormValueSequence', {
      key: 'hasIrsNotice',
      value: false,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showBusinessFilingTypeOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'businessType',
      value: ContactFactory.PARTY_TYPES.partnershipOtherThanTaxMatters,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();

    // Partnership BBA party type primary/secondary contact
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
      value: ContactFactory.PARTY_TYPES.partnershipBBA,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();

    // Estate with executor party type primary/secondary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Other',
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
      value: 'Estate with an Executor/Personal Representative/Fiduciary/etc.',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();

    // Estate without executor party type primary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Other',
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
      value:
        'Estate without an Executor/Personal Representative/Fiduciary/etc.',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();

    // trust and trustee party type primary/secondary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Other',
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
      value: 'Trust',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();

    // conservator party type primary/secondary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Other',
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
      value: 'Conservator',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();

    // guardian party type primary/secondary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Other',
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
      value: 'Guardian',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();

    // custodian party type primary/secondary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Other',
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
      value: 'Custodian',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();

    // minor party type primary/secondary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Other',
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
      value:
        'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();

    // legally incompetent person party type primary/secondary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Other',
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
      value:
        'Next Friend for a Legally Incompetent Person (Without a Guardian, Conservator, or other like Fiduciary)',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();

    // donor party type primary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Other',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showOtherFilingTypeOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: 'Donor',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();

    // transferee party type primary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Other',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showOtherFilingTypeOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: 'Transferee',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();

    // surviving spouse party type primary/secondary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Other',
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
    expect(result.showSecondaryContact).toBeTruthy();

    await test.runSequence('submitFilePetitionSequence');

    expect(test.getState('alertError.title')).toEqual(
      'Please correct the following errors on the page:',
    );

    await test.runSequence('updateFormValueSequence', {
      key: 'day',
      value: '01',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.name',
      value: 'Test Person',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.address1',
      value: '123 Abc Ln',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.address2',
      value: 'Apt 2',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.city',
      value: 'Cityville',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.state',
      value: 'CA',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.postalCode',
      value: '12345',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.email',
      value: 'test@example.com',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.phone',
      value: '1234567890',
    });

    expect(test.getState('form.contactSecondary')).toEqual({
      address1: '123 Abc Ln',
      address2: 'Apt 2',
      city: 'Cityville',
      countryType: 'domestic',
      email: 'test@example.com',
      name: 'Test Person',
      phone: '1234567890',
      postalCode: '12345',
      state: 'CA',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.name',
      value: 'Test Person',
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
      countryType: 'domestic',
      email: 'test@example.com',
      name: 'Test Person',
      phone: '1234567890',
      postalCode: '12345',
      state: 'CA',
    });

    await test.runSequence('updateHasIrsNoticeFormValueSequence', {
      key: 'hasIrsNotice',
      value: false,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showHasIrsNoticeOptions).toBeFalsy();
    expect(result.showNotHasIrsNoticeOptions).toBeTruthy();

    await test.runSequence('updateHasIrsNoticeFormValueSequence', {
      key: 'hasIrsNotice',
      value: true,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showHasIrsNoticeOptions).toBeTruthy();
    expect(result.showNotHasIrsNoticeOptions).toBeFalsy();

    await test.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: overrides.caseType || 'Whistleblower',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'month',
      value: '01',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'day',
      value: '01',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'year',
      value: '2001',
    });

    // try without checking the signature
    await test.runSequence('submitFilePetitionSequence');
    expect(test.getState('alertError.title')).toEqual(
      'Please correct the following errors on the page:',
    );

    // click the signature and try again
    await test.runSequence('updateFormValueSequence', {
      key: 'signature',
      value: true,
    });

    await test.runSequence('submitFilePetitionSequence');

    expect(test.getState('alertError')).toEqual(null);

    expect(test.getState('alertSuccess')).toEqual({
      message: 'You can access your case at any time from the case list below.',
      title: 'Your petition has been successfully submitted.',
    });
  });
};
