import { addConsolidatedProperties } from './addConsolidatedProperties';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';

describe('addConsolidatedProperties', () => {
  const mockLeadDocketNumber = '101-20';
  const mockMemberDocketNumber = '101-21';

  it('should add the Lead case tooltip text and set both inConsolidatedGroup and isLeadCase to true when docket number and leadDocketNumber are the same', () => {
    const result = addConsolidatedProperties({
      applicationContext,
      consolidatedObject: {
        docketNumber: mockLeadDocketNumber,
        leadDocketNumber: mockLeadDocketNumber,
      },
    });

    expect(result).toMatchObject({
      consolidatedIconTooltipText: 'Lead case',
      inConsolidatedGroup: true,
      inLeadCase: true,
    });
  });

  it('should add the Consolidated case tooltip text and set inConsolidatedGroup to true and isLeadCase to false when docket number and leadDocketNumber are not the same but in the same consolidated group', () => {
    const result = addConsolidatedProperties({
      applicationContext,
      consolidatedObject: {
        docketNumber: mockMemberDocketNumber,
        leadDocketNumber: mockLeadDocketNumber,
      },
    });

    expect(result).toMatchObject({
      consolidatedIconTooltipText: 'Consolidated case',
      inConsolidatedGroup: true,
      inLeadCase: false,
    });
  });

  it('should not add a tooltip and set both inConsolidatedGroup and inLeadCase to false when the docket number is not part of a consolidated group', () => {
    const result = addConsolidatedProperties({
      applicationContext,
      consolidatedObject: {
        docketNumber: mockMemberDocketNumber,
        leadDocketNumber: undefined,
      },
    });

    expect(result).toMatchObject({
      consolidatedIconTooltipText: null,
      inConsolidatedGroup: false,
      inLeadCase: false,
    });
  });
});
