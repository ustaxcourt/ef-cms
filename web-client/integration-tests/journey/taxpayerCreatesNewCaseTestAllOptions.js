import { Case } from '../../../shared/src/business/entities/cases/Case';
import { ContactFactory } from '../../../shared/src/business/entities/contacts/ContactFactory';
import { runCompute } from 'cerebral/test';
import { startCaseHelper as startCaseHelperComputed } from '../../src/presenter/computeds/startCaseHelper';
import { withAppContextDecorator } from '../../src/withAppContext';

const startCaseHelper = withAppContextDecorator(startCaseHelperComputed);

const { VALIDATION_ERROR_MESSAGES } = Case;

export default (test, fakeFile, overrides = {}) => {
  return it('Taxpayer creates a new case, testing all form options', async () => {
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
      value: 'Partnership (as the Tax Matters Partner)',
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
      value: ContactFactory.PARTY_TYPES.partnershipOtherThanTaxMatters,
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
      value: ContactFactory.PARTY_TYPES.partnershipBBA,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();

    // Estate with executor party type primary contact
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
    expect(result.showSecondaryContact).toBeFalsy();

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

    // trust and trustee party type primary contact
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
    expect(result.showSecondaryContact).toBeFalsy();

    // conservator party type primary contact
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
    expect(result.showSecondaryContact).toBeFalsy();

    // guardian party type primary contact
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
    expect(result.showSecondaryContact).toBeFalsy();

    // custodian party type primary contact
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
    expect(result.showSecondaryContact).toBeFalsy();

    // minor party type primary contact
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
    expect(result.showSecondaryContact).toBeFalsy();

    // legally incompetent person party type primary contact
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
    expect(result.showSecondaryContact).toBeFalsy();

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
    expect(test.getState('form.partyType')).toEqual('Transferee');

    // surviving spouse party type primary contact
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
    expect(result.showSecondaryContact).toBeFalsy();
    expect(test.getState('form.partyType')).toEqual('Surviving Spouse');

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
      value: 'Test Person',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.secondaryName',
      value: 'Test Person 2',
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
      secondaryName: 'Test Person 2',
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
      value: overrides.caseType || 'Whistleblower',
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
      secondaryName: 'Test Person 2',
      state: 'CA',
    });

    await test.runSequence('submitFilePetitionSequence');

    expect(test.getState('validationErrors')).toEqual({});
    expect(test.getState('alertError')).toBeUndefined();

    expect(test.getState('alertSuccess')).toEqual({
      message: 'You can access your case at any time from the case list below.',
      title: 'Your petition has been successfully submitted.',
    });
  });
};
