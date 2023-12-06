import { refreshElasticsearchIndex } from '../helpers';

export const docketClerkUnsealsCase = cerebralTest => {
  return it('Docketclerk unseals a case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('caseDetail.sealedDate')).toBeDefined();
    expect(cerebralTest.getState('caseDetail.isSealed')).toEqual(true);

    await cerebralTest.runSequence('unsealCaseSequence');

    expect(cerebralTest.getState('caseDetail.sealedDate')).not.toBeDefined();
    expect(cerebralTest.getState('caseDetail.isSealed')).toEqual(false);

    await refreshElasticsearchIndex();
  });
};
