import { refreshElasticsearchIndex } from '../helpers';

export const privatePractitionerViewsOpenConsolidatedCases = test => {
  return it('private practitioner views open consolidated cases', async () => {
    await refreshElasticsearchIndex();
    await test.runSequence('gotoDashboardSequence');

    expect(test.getState('currentPage')).toEqual('DashboardPractitioner');
    const openCases = test.getState('openCases');
    expect(openCases.length).toBeGreaterThan(0);

    const leadCase = openCases.find(
      c => c.docketNumber === test.leadDocketNumber,
    );
    expect(leadCase).toBeDefined();
    expect(leadCase).toHaveProperty('consolidatedCases');
    expect(leadCase.consolidatedCases.length).toEqual(1);
  });
};
