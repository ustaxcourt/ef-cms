import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getFilerParties } from './getFilerParties';

describe('getFilerParties', () => {
  const docketEntryId = applicationContext.getUniqueId();
  const mockContactId = 'af8db7fa-9b1b-4a9a-ace0-6788d3e15943';

  it('should return petitioners name with title when checked in the filersMap', () => {
    const filerParties = getFilerParties({
      caseDetail: {
        docketEntries: [
          {
            docketEntryId,
            documentTitle: 'Some Stuff',
            documentType: 'Order',
            eventCode: 'O',
          },
        ],
        petitioners: [
          {
            ...MOCK_CASE.petitioners[0],
            contactId: mockContactId,
          },
        ],
      },
      filersMap: {
        ['c51150193c634a07bdbd2388fbf06aef']: false,
        [mockContactId]: true,
      },
    });

    expect(filerParties).toEqual([
      `${MOCK_CASE.petitioners[0].name}, Petitioner`,
    ]);
  });

  it('should NOT return petitioners name with title when they are unchecked in the filersMap', () => {
    const filerParties = getFilerParties({
      caseDetail: {
        docketEntries: [
          {
            docketEntryId,
            documentTitle: 'Some Stuff',
            documentType: 'Order',
            eventCode: 'O',
          },
        ],
        petitioners: [
          {
            ...MOCK_CASE.petitioners[0],
            contactId: mockContactId,
          },
          {
            ...MOCK_CASE.petitioners[0],
          },
        ],
      },
      filersMap: {
        [mockContactId]: false,
        [MOCK_CASE.petitioners[0].contactId]: false,
      },
    });

    expect(filerParties).toEqual([]);
  });

  it('should NOT return petitioners name with title when they are not in the filersMap', () => {
    const filerParties = getFilerParties({
      caseDetail: {
        docketEntries: [
          {
            docketEntryId,
            documentTitle: 'Some Stuff',
            documentType: 'Order',
            eventCode: 'O',
          },
        ],
        petitioners: MOCK_CASE.petitioners,
      },
      filersMap: { [mockContactId]: true },
    });

    expect(filerParties).toEqual([]);
  });

  it('should default filersMap t an empty object when it is not passed in', () => {
    const filerParties = getFilerParties({
      caseDetail: {
        docketEntries: [
          {
            docketEntryId,
            documentTitle: 'Some Stuff',
            documentType: 'Order',
            eventCode: 'O',
          },
        ],
        petitioners: MOCK_CASE.petitioners,
      },
    });

    expect(filerParties).toEqual([]);
  });
});
