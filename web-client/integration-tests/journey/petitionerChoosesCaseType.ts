import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';

const { CASE_TYPES_MAP } = applicationContext.getConstants();

export const petitionerChoosesCaseType = cerebralTest => {
  it('petitioner chooses the case type', async () => {
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'hasIrsNotice',
      value: true,
    });
    expect(cerebralTest.getState('form.hasIrsNotice')).toEqual(true);

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: CASE_TYPES_MAP.cdp,
    });
    expect(cerebralTest.getState('form.caseType')).toEqual(CASE_TYPES_MAP.cdp);

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'filingType',
      value: 'Myself',
    });
    expect(cerebralTest.getState('form.filingType')).toEqual('Myself');
  });
};
