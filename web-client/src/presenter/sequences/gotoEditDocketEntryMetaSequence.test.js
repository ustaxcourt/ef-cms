import { CerebralTest } from 'cerebral/test';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { gotoEditDocketEntryMetaSequence } from './gotoEditDocketEntryMetaSequence';
import { presenter } from '../presenter-mock';

describe('gotoEditDocketEntryMetaSequence', () => {
  const mockDocketEntryId = '4e544995-92a9-45e4-af0a-149dd9c24458';
  const mockDocketNumber = '999-99';
  const mockDocketEntry = {
    attachments: false,
    certificateOfService: false,
    createdAt: '2019-06-19T17:29:13.120Z',
    docketEntryId: mockDocketEntryId,
    documentTitle: 'Order to do something',
    documentType: 'Order',
    eventCode: 'O',
    filers: [],
    filingDate: '2019-06-22T17:29:13.120Z',
    freeText: 'to do something',
    index: 1,
    isOnDocketRecord: true,
    lodged: false,
  };

  let test;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    presenter.sequences = {
      gotoEditDocketEntryMetaSequence,
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

    applicationContext
      .getUseCases()
      .getUsersInSectionInteractor.mockReturnValue([
        { name: 'Bob Barker', role: ROLES.judge },
        { name: 'Bob Ross', role: ROLES.petitionsClerk },
      ]);
  });

  it('should set up state for editing court issued docket entry', async () => {
    await test.runSequence('gotoEditDocketEntryMetaSequence', {
      docketNumber: mockDocketNumber,
      docketRecordIndex: 1,
    });

    expect(test.getState()).toMatchObject({
      docketEntryId: mockDocketEntryId,
      docketRecordIndex: 1,
      form: {
        ...mockDocketEntry,
        documentTitle: '[Anything]',
        generatedDocumentTitle: 'Order to do something',
      },
      judges: [{ name: 'Bob Barker', role: ROLES.judge }],
      screenMetadata: { editType: 'CourtIssued' },
    });
  });
});
