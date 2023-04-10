import { refreshElasticsearchIndex } from '../helpers';

export const privatePractitionerViewsOpenConsolidatedCases = cerebralTest => {
  return it('private practitioner views open consolidated cases', async () => {
    await refreshElasticsearchIndex();
    await cerebralTest.runSequence('gotoDashboardSequence');

    expect(cerebralTest.getState('currentPage')).toEqual(
      'DashboardPractitioner',
    );
    const openCases = cerebralTest.getState('openCases');
    expect(openCases.length).toBeGreaterThan(0);

    const leadCase = openCases.find(
      c => c.docketNumber === cerebralTest.leadDocketNumber,
    );
    expect(leadCase).toBeDefined();
    expect(leadCase).toHaveProperty('consolidatedCases');
    expect(leadCase.consolidatedCases.length).toEqual(1);
  });
};
