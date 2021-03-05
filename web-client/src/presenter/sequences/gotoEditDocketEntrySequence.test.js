import { CerebralTest } from 'cerebral/test';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { gotoEditDocketEntrySequence } from './gotoEditDocketEntrySequence';
import { presenter } from '../presenter-mock';

describe('gotoEditDocketEntrySequence', () => {
  const mockDocketEntryId = '4e544995-92a9-45e4-af0a-149dd9c24458';
  const mockDocketNumber = '999-99';

  const mockDocketEntry = {
    createdAt: '2019-04-19T17:29:13.120Z',
    docketEntryId: mockDocketEntryId,
    documentTitle: 'Partial Administrative Record',
    documentType: 'Partial Administrative Record',
    eventCode: 'PARD',
    filingDate: '2019-04-19T17:29:13.120Z',
    isFileAttached: true,
    isOnDocketRecord: true,
    partyPrimary: true,
    scenario: 'Standard',
    servedAt: '2019-06-19T17:29:13.120Z',
  };

  let test;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    presenter.sequences = {
      gotoEditDocketEntrySequence,
    };
    test = CerebralTest(presenter);

    applicationContext.getUseCases().getCaseInteractor.mockReturnValue({
      ...MOCK_CASE,
      docketEntries: [mockDocketEntry],
      docketNumber: mockDocketNumber,
    });

    applicationContext
      .getUseCases()
      .generateCourtIssuedDocumentTitleInteractor.mockReturnValue(
        'Order to do something',
      );
  });

  it('should set up state for editing court issued docket entry', async () => {
    await test.runSequence('gotoEditDocketEntrySequence', {
      docketEntryId: mockDocketEntryId,
      docketNumber: mockDocketNumber,
    });

    expect(test.getState()).toMatchObject({
      docketEntryId: mockDocketEntryId,
      form: {
        ...mockDocketEntry,
      },
    });
  });
});
