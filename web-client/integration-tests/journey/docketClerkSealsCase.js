import { refreshElasticsearchIndex } from '../helpers';

export const docketClerkSealsCase = cerebralTest => {
  return it('Docketclerk seals a case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('caseDetail.sealedDate')).toBeUndefined();

    await cerebralTest.runSequence('sealCaseSequence');

    expect(cerebralTest.getState('caseDetail.sealedDate')).toBeDefined();
    expect(cerebralTest.getState('caseDetail.isSealed')).toBeTruthy();

    await refreshElasticsearchIndex();
  });
};
