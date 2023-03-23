import { migrateItems } from './0008-add-trial-location-field-to-work-item';
import { MOCK_CASE } from '../../../../../../shared/src/test/mockCase';
import { CASE_STATUS_TYPES } from '../../../../../../shared/src/business/entities/EntityConstants';

describe('migrateItems', () => {
  beforeEach(() => {
    applicationContext
      .getUseCases()
      .getCaseInteractor.mockResolvedValue({
        trialLocation: 'Pheonix, Arizona',
      });
  });

  it('should return and not modify records that are not Work Items', async () => {
    const mockItems = [
      {
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'case|83b77e98-4cf6-4fb4-b8c0-f5f90fd68f3c',
      },
    ];
    const results = await migrateItems(mockItems);

    expect(results).toEqual(mockItems);
  });

  it('should return and not modify WorkItems that do not have a caseStatus of Calendared', async () => {
    const mockItems = [
      {
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'work-item|6d74eadc-0181-4ff5-826c-123432e8733d',
        caseStatus: CASE_STATUS_TYPES.calendared,
      },
      {
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'case|83b77e98-4cf6-4fb4-b8c0-f5f90fd68f3c',
      },
      {
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'work-item|6d74eadc-0181-4ff5-826c-123432e8733d',
        caseStatus: CASE_STATUS_TYPES.generalDocketReadyForTrial,
      },
    ];
    const results = await migrateItems(mockItems);

    expect(results).toEqual(mockItems);
  });

  xit('should modify Work Items that have a caseStatus of Calendared, adding the property "trialLocation" to the Work Item', async () => {
    const mockItem = {
      pk: `case|${MOCK_CASE.docketNumber}`,
      sk: `case|${MOCK_CASE.docketNumber}`,
    };

    const results = await migrateItems([mockItem]);

    expect(results[0]).toEqual({
      ...mockItem,
      orderForCds: false,
    });
  });
});
