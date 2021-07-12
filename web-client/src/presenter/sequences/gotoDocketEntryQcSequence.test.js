import { CerebralTest } from 'cerebral/test';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { gotoDocketEntryQcSequence } from './gotoDocketEntryQcSequence';
import { presenter } from '../presenter-mock';

describe('gotoDocketEntryQcSequence', () => {
  const mockDocketEntryId = '4e544995-92a9-45e4-af0a-149dd9c24458';
  const mockDocketNumber = '999-99';

  const mockDocketEntry = {
    createdAt: '2019-04-19T17:29:13.120Z',
    docketEntryId: mockDocketEntryId,
    documentTitle: 'Partial Administrative Record',
    documentType: 'Partial Administrative Record',
    eventCode: 'PARD',
    filers: [],
    filingDate: '2019-04-19T17:29:13.120Z',
    isFileAttached: true,
    isOnDocketRecord: true,
    partyPrimary: true,
    scenario: 'Standard',
    servedAt: '2019-06-19T17:29:13.120Z',
  };

  let cerebralTest;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    presenter.sequences = {
      gotoDocketEntryQcSequence,
    };
    cerebralTest = CerebralTest(presenter);

    applicationContext.getUseCases().getCaseInteractor.mockReturnValue({
      ...MOCK_CASE,
      docketEntries: [mockDocketEntry],
      docketNumber: mockDocketNumber,
    });
  });

  it('should set up state for qcing docket entry', async () => {
    await cerebralTest.runSequence('gotoDocketEntryQcSequence', {
      docketEntryId: mockDocketEntryId,
      docketNumber: mockDocketNumber,
    });

    expect(cerebralTest.getState()).toMatchObject({
      docketEntryId: mockDocketEntryId,
      form: {
        ...mockDocketEntry,
      },
    });
  });
});
