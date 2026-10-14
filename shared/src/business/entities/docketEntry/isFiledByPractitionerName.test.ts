import { isFiledByPractitionerName } from './isFiledByPractitionerName';
import {
  mockDocketClerkUser,
  mockIrsPractitionerUser,
  mockPetitionerUser,
  mockPrivatePractitionerUser,
} from '@shared/test/mockAuthUsers';

describe('isFiledByPractitionerName', () => {
  type DocketEntryFields = Parameters<
    typeof isFiledByPractitionerName
  >[0]['docketEntry'];

  const practitionerNamedFilings: [string, DocketEntryFields][] = [
    ['an M112', { eventCode: 'M112' }],
    [
      'a Nonstandard H filing targeting an M112',
      { eventCode: 'M115', secondaryDocument: { eventCode: 'M112' } },
    ],
    [
      'a supporting document for an M112',
      {
        eventCode: 'EXS',
        previousDocument: { documentType: 'Motion to Withdraw as Counsel' },
      },
    ],
    ['a NOTW', { eventCode: 'NOTW' }],
    [
      'a filing on a previous NOTW',
      {
        eventCode: 'SUPM',
        previousDocument: { documentType: 'Notice of Withdrawal as Counsel' },
      },
    ],
  ];

  it.each(practitionerNamedFilings)(
    'should return true when a practitioner files %s',
    (_, docketEntry) => {
      [mockPrivatePractitionerUser, mockIrsPractitionerUser].forEach(user => {
        expect(isFiledByPractitionerName({ docketEntry, user })).toBe(true);
      });
    },
  );

  it.each(practitionerNamedFilings)(
    'should return false when a non-practitioner files %s',
    (_, docketEntry) => {
      [mockDocketClerkUser, mockPetitionerUser, undefined].forEach(user => {
        expect(isFiledByPractitionerName({ docketEntry, user })).toBe(false);
      });
    },
  );

  it.each<[string, DocketEntryFields]>([
    ['another event code', { eventCode: 'ABC' }],
    [
      'a Nonstandard H filing not targeting an M112',
      { eventCode: 'M115', secondaryDocument: { eventCode: 'M000' } },
    ],
    [
      'a supporting document for another document',
      {
        eventCode: 'EXS',
        previousDocument: { documentType: 'Motion for Leave to File' },
      },
    ],
  ])('should return false when a practitioner files %s', (_, docketEntry) => {
    expect(
      isFiledByPractitionerName({
        docketEntry,
        user: mockPrivatePractitionerUser,
      }),
    ).toBe(false);
  });
});
