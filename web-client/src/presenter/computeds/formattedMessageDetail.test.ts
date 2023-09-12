import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { formattedMessageDetail as formattedMessageDetailComputed } from './formattedMessageDetail';
import {
  generalUser,
  petitionsClerkUser,
} from '../../../../shared/src/test/mockUsers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('formattedMessageDetail', () => {
  const formattedMessageDetail = withAppContextDecorator(
    formattedMessageDetailComputed,
    {
      ...applicationContext,
    },
  );

  const { PETITIONS_SECTION } = applicationContext.getConstants();

  const mockCaseDetail = {
    archivedCorrespondences: [],
    archivedDocketEntries: [],
    correspondence: [],
    docketEntries: [
      {
        docketEntryId: '98065bac-b35c-423c-b649-122a09bb65b9',
        documentTitle: 'Test Document One',
      },
      {
        docketEntryId: 'fee3958e-c738-4794-b0a1-bad711506685',
        documentTitle: 'Test Document Two',
      },
    ],
  };

  it('formats the messages with createdAtFormatted and sorts by createdAt', () => {
    const result = runCompute(formattedMessageDetail, {
      state: {
        caseDetail: mockCaseDetail,
        messageDetail: [
          {
            attachments: [
              { documentId: '98065bac-b35c-423c-b649-122a09bb65b9' },
            ],
            createdAt: '2019-03-01T21:40:46.415Z',
            docketNumber: '101-20',
            messageId: '60e129bf-b8ec-4e0c-93c7-9633ab69f5df',
          },
          {
            attachments: [
              { documentId: '98065bac-b35c-423c-b649-122a09bb65b9' },
              { documentId: 'fee3958e-c738-4794-b0a1-bad711506685' },
            ],
            createdAt: '2019-04-01T21:40:46.415Z',
            docketNumber: '101-20',
            messageId: '98a9dbc4-a8d1-459b-98b2-30235b596d70',
          },
        ],
      },
    });

    expect(result).toMatchObject({
      attachments: [
        { documentId: '98065bac-b35c-423c-b649-122a09bb65b9' },
        { documentId: 'fee3958e-c738-4794-b0a1-bad711506685' },
      ],
      currentMessage: {
        createdAtFormatted: '04/01/19',
        messageId: '98a9dbc4-a8d1-459b-98b2-30235b596d70',
      },
      olderMessages: [
        {
          createdAtFormatted: '03/01/19',
          messageId: '60e129bf-b8ec-4e0c-93c7-9633ab69f5df',
        },
      ],
    });
  });

  it('formats completed message thread', () => {
    const result = runCompute(formattedMessageDetail, {
      state: {
        caseDetail: mockCaseDetail,
        messageDetail: [
          {
            attachments: [
              { documentId: '98065bac-b35c-423c-b649-122a09bb65b9' },
            ],
            createdAt: '2019-03-01T21:40:46.415Z',
            docketNumber: '101-20',
            messageId: '60e129bf-b8ec-4e0c-93c7-9633ab69f5df',
          },
          {
            attachments: [
              { documentId: '98065bac-b35c-423c-b649-122a09bb65b9' },
              { documentId: 'fee3958e-c738-4794-b0a1-bad711506685' },
            ],
            completedAt: '2019-05-01T21:40:46.415Z',
            completedBy: 'Test Petitioner',
            completedBySection: PETITIONS_SECTION,
            completedByUserId: '23869007-384d-464f-b079-cb1fcfb21e03',
            createdAt: '2019-04-01T21:40:46.415Z',
            docketNumber: '101-20',
            isCompleted: true,
            messageId: '98a9dbc4-a8d1-459b-98b2-30235b596d70',
          },
        ],
      },
    });

    expect(result).toMatchObject({
      attachments: [
        { documentId: '98065bac-b35c-423c-b649-122a09bb65b9' },
        { documentId: 'fee3958e-c738-4794-b0a1-bad711506685' },
      ],
      currentMessage: {
        completedAtFormatted: '05/01/19',
        messageId: '98a9dbc4-a8d1-459b-98b2-30235b596d70',
      },
      olderMessages: [
        {
          createdAtFormatted: '04/01/19',
          messageId: '98a9dbc4-a8d1-459b-98b2-30235b596d70',
        },
        {
          createdAtFormatted: '03/01/19',
          messageId: '60e129bf-b8ec-4e0c-93c7-9633ab69f5df',
        },
      ],
    });
  });

  describe('hasOlderMessages', () => {
    it('returns hasOlderMessages true if there is more than one message', () => {
      const result = runCompute(formattedMessageDetail, {
        state: {
          caseDetail: mockCaseDetail,
          messageDetail: [
            { attachments: [], createdAt: '2019-03-01T21:40:46.415Z' },
            { attachments: [], createdAt: '2019-04-01T21:40:46.415Z' },
          ],
        },
      });

      expect(result.hasOlderMessages).toEqual(true);
    });

    it('returns hasOlderMessages false and showOlderMessages false if there is only one message', () => {
      const result = runCompute(formattedMessageDetail, {
        state: {
          caseDetail: mockCaseDetail,
          messageDetail: [
            { attachments: [], createdAt: '2019-03-01T21:40:46.415Z' },
          ],
        },
      });

      expect(result.hasOlderMessages).toEqual(false);
      expect(result.showOlderMessages).toEqual(false);
    });

    it('returns showOlderMessages true if there is more than one message and isExpanded is true', () => {
      const result = runCompute(formattedMessageDetail, {
        state: {
          caseDetail: mockCaseDetail,
          isExpanded: true,
          messageDetail: [
            { attachments: [], createdAt: '2019-03-01T21:40:46.415Z' },
            { attachments: [], createdAt: '2019-04-01T21:40:46.415Z' },
          ],
        },
      });

      expect(result.showOlderMessages).toEqual(true);
    });

    it('returns showOlderMessages false if there is more than one message and isExpanded is false', () => {
      const result = runCompute(formattedMessageDetail, {
        state: {
          caseDetail: mockCaseDetail,
          isExpanded: false,
          messageDetail: [
            { attachments: [], createdAt: '2019-03-01T21:40:46.415Z' },
            { attachments: [], createdAt: '2019-04-01T21:40:46.415Z' },
          ],
        },
      });

      expect(result.showOlderMessages).toEqual(false);
    });
  });

  it('formats the attachments on the message with meta from the aggregated documents arrays', () => {
    const result = runCompute(formattedMessageDetail, {
      state: {
        caseDetail: mockCaseDetail,
        messageDetail: [
          {
            attachments: [
              { documentId: '98065bac-b35c-423c-b649-122a09bb65b9' },
            ],
            createdAt: '2019-03-01T21:40:46.415Z',
            docketNumber: '101-20',
            messageId: '60e129bf-b8ec-4e0c-93c7-9633ab69f5df',
          },
          {
            attachments: [
              { documentId: '98065bac-b35c-423c-b649-122a09bb65b9' },
              { documentId: 'fee3958e-c738-4794-b0a1-bad711506685' },
            ],
            createdAt: '2019-04-01T21:40:46.415Z',
            docketNumber: '101-20',
            messageId: '98a9dbc4-a8d1-459b-98b2-30235b596d70',
          },
        ],
      },
    });

    expect(
      applicationContext.getUtilities().formatAttachments,
    ).toHaveBeenCalled();

    expect(result).toMatchObject({
      attachments: [
        {
          archived: false,
          documentId: '98065bac-b35c-423c-b649-122a09bb65b9',
          documentTitle: 'Test Document One',
        },
        {
          archived: false,
          documentId: 'fee3958e-c738-4794-b0a1-bad711506685',
          documentTitle: 'Test Document Two',
        },
      ],
      currentMessage: {
        createdAtFormatted: '04/01/19',
        messageId: '98a9dbc4-a8d1-459b-98b2-30235b596d70',
      },
      olderMessages: [
        {
          createdAtFormatted: '03/01/19',
          messageId: '60e129bf-b8ec-4e0c-93c7-9633ab69f5df',
        },
      ],
    });
  });

  it('should return showNotServed as true if the document type is servable and does not have a servedAt', () => {
    const documentId = applicationContext.getUniqueId();

    const result = runCompute(formattedMessageDetail, {
      state: {
        caseDetail: {
          ...mockCaseDetail,
          docketEntries: [
            {
              docketEntryId: documentId,
              documentTitle: 'Some Stuff',
              documentType: 'Order',
              eventCode: 'O',
            },
          ],
        },
        messageDetail: [
          {
            attachments: [
              {
                documentId,
                documentTitle: 'Some Stuff',
              },
            ],
            createdAt: '2019-03-01T21:40:46.415Z',
          },
        ],
      },
    });

    expect(result.attachments[0].showNotServed).toEqual(true);
  });

  describe('archived', () => {
    const documentId = applicationContext.getUniqueId();

    it('should be true if the document has been archived', () => {
      const result = runCompute(formattedMessageDetail, {
        state: {
          caseDetail: {
            ...mockCaseDetail,
            docketEntries: [
              {
                archived: true,
                docketEntryId: documentId,
                documentTitle: 'Some Stuff',
                documentType: 'Order',
                eventCode: 'O',
              },
            ],
          },
          messageDetail: [
            {
              attachments: [
                {
                  documentId,
                  documentTitle: 'Some Stuff',
                },
              ],
              createdAt: '2019-03-01T21:40:46.415Z',
            },
          ],
        },
      });

      expect(result.attachments[0].archived).toBeTruthy();
    });

    it('should be false if the document has not been archived', () => {
      const result = runCompute(formattedMessageDetail, {
        state: {
          caseDetail: {
            ...mockCaseDetail,
            docketEntries: [
              {
                docketEntryId: documentId,
                documentTitle: 'Some Stuff',
                documentType: 'Corrected Transcript',
                eventCode: 'CTRA',
              },
            ],
          },
          messageDetail: [
            {
              attachments: [
                {
                  documentId,
                  documentTitle: 'Some Stuff',
                },
              ],
              createdAt: '2019-03-01T21:40:46.415Z',
            },
          ],
        },
      });

      expect(result.attachments[0].archived).toBeFalsy();
    });
  });

  describe('showActionButtons', () => {
    it('should be true when message is NOT completed and user role is NOT general', () => {
      applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);

      const result = runCompute(formattedMessageDetail, {
        state: {
          caseDetail: {
            ...mockCaseDetail,
            docketEntries: [],
          },
          messageDetail: [
            {
              attachments: [
                { documentId: 'fee3958e-c738-4794-b0a1-bad711506685' },
              ],
              completedAt: '2019-05-01T21:40:46.415Z',
              completedBy: 'Test Petitioner',
              completedBySection: PETITIONS_SECTION,
              completedByUserId: '23869007-384d-464f-b079-cb1fcfb21e03',
              createdAt: '2019-04-01T21:40:46.415Z',
              docketNumber: '101-20',
              isCompleted: false,
              messageId: '98a9dbc4-a8d1-459b-98b2-30235b596d70',
            },
          ],
        },
      });

      expect(result.showActionButtons).toBeTruthy();
    });

    it('should be false when message is NOT completed and user role is general', () => {
      applicationContext.getCurrentUser.mockReturnValue(generalUser);

      const result = runCompute(formattedMessageDetail, {
        state: {
          caseDetail: {
            ...mockCaseDetail,
            docketEntries: [],
          },
          messageDetail: [
            {
              attachments: [
                { documentId: 'fee3958e-c738-4794-b0a1-bad711506685' },
              ],
              completedAt: '2019-05-01T21:40:46.415Z',
              completedBy: 'Test Petitioner',
              completedBySection: PETITIONS_SECTION,
              completedByUserId: '23869007-384d-464f-b079-cb1fcfb21e03',
              createdAt: '2019-04-01T21:40:46.415Z',
              docketNumber: '101-20',
              isCompleted: false,
              messageId: '98a9dbc4-a8d1-459b-98b2-30235b596d70',
            },
          ],
        },
      });

      expect(result.showActionButtons).toBeFalsy();
    });

    it('should be false when message is completed and user role is NOT general', () => {
      applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);

      const result = runCompute(formattedMessageDetail, {
        state: {
          caseDetail: {
            ...mockCaseDetail,
            docketEntries: [],
          },
          messageDetail: [
            {
              attachments: [
                { documentId: 'fee3958e-c738-4794-b0a1-bad711506685' },
              ],
              completedAt: '2019-05-01T21:40:46.415Z',
              completedBy: 'Test Petitioner',
              completedBySection: PETITIONS_SECTION,
              completedByUserId: '23869007-384d-464f-b079-cb1fcfb21e03',
              createdAt: '2019-04-01T21:40:46.415Z',
              docketNumber: '101-20',
              isCompleted: true,
              messageId: '98a9dbc4-a8d1-459b-98b2-30235b596d70',
            },
          ],
        },
      });

      expect(result.showActionButtons).toBeFalsy();
    });

    it('should be false when message is completed and user role is general', () => {
      applicationContext.getCurrentUser.mockReturnValue(generalUser);

      const result = runCompute(formattedMessageDetail, {
        state: {
          caseDetail: {
            ...mockCaseDetail,
            docketEntries: [],
          },
          messageDetail: [
            {
              attachments: [
                { documentId: 'fee3958e-c738-4794-b0a1-bad711506685' },
              ],
              completedAt: '2019-05-01T21:40:46.415Z',
              completedBy: 'Test Petitioner',
              completedBySection: PETITIONS_SECTION,
              completedByUserId: '23869007-384d-464f-b079-cb1fcfb21e03',
              createdAt: '2019-04-01T21:40:46.415Z',
              docketNumber: '101-20',
              isCompleted: true,
              messageId: '98a9dbc4-a8d1-459b-98b2-30235b596d70',
            },
          ],
        },
      });

      expect(result.showActionButtons).toBeFalsy();
    });
  });
});
