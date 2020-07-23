import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';

const { CASE_TYPES_MAP } = applicationContext.getConstants();

export const petitionerChoosesCaseType = test => {
  it('petitioner chooses the case type', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'hasIrsNotice',
      value: true,
    });
    expect(test.getState('form.hasIrsNotice')).toEqual(true);

    await test.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: CASE_TYPES_MAP.cdp,
    });
    expect(test.getState('form.caseType')).toEqual(CASE_TYPES_MAP.cdp);

    await test.runSequence('updateFormValueSequence', {
      key: 'filingType',
      value: 'Myself',
    });
    expect(test.getState('form.filingType')).toEqual('Myself');
  });
};
