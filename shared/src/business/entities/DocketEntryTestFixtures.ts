import { ROLES } from '@shared/business/entities/EntityConstants';

const mockPrimaryId = '7111b30b-ad38-42c8-9db0-d938cb2cb16b';
const mockSecondaryId = '55e5129c-ab54-4a9d-a8cf-5a4479ec08b6';

export const A_VALID_DOCKET_ENTRY = {
  createdAt: '2020-07-17T19:28:29.675Z',
  docketEntryId: '0f5e035c-efa8-49e4-ba69-daf8a166a98f',
  docketNumber: '101-21',
  documentType: 'Petition',
  eventCode: 'A',
  filedBy: 'Test Petitioner',
  filedByRole: ROLES.petitioner,
  filers: [mockPrimaryId],
  receivedAt: '2020-07-17T19:28:29.675Z',
  userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
};

export const MOCK_PETITIONERS = [
  { contactId: mockPrimaryId, name: 'Bob' },
  { contactId: mockSecondaryId, name: 'Bill' },
];
