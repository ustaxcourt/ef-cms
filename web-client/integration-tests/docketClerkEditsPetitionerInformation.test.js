import { loginAs, setupTest, uploadPetition } from './helpers';

const test = setupTest();

describe('docket clerk edits the petitioner information', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });

  let caseDetail;

  it('login as a tax payer and create a case', async () => {
    await loginAs(test, 'petitioner');
    caseDetail = await uploadPetition(test);
    test.docketNumber = caseDetail.docketNumber;
  });

  it('login as the docketclerk and edit the case contact information', async () => {
    await loginAs(test, 'docketclerk');

    await test.runSequence('gotoEditPetitionerInformationSequence', {
      docketNumber: caseDetail.docketNumber,
    });

    expect(test.getState('caseDetail.contactPrimary.address1')).toEqual(
      '734 Cowley Parkway',
    );

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.address1',
      value: '',
    });

    expect(test.getState('form.contactPrimary.address1')).toEqual('');

    await test.runSequence('updatePetitionerInformationFormSequence');

    expect(test.getState('validationErrors')).toEqual({
      contactPrimary: { address1: 'Enter mailing address' },
      contactSecondary: {},
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.address1',
      value: '123 Some Street',
    });

    await test.runSequence('updatePetitionerInformationFormSequence');

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(test.getState('caseDetail.contactPrimary.address1')).toEqual(
      '123 Some Street',
    );
  });
});
