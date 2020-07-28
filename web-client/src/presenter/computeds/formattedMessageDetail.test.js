import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { formattedMessageDetail as formattedMessageDetailComputed } from './formattedMessageDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const formattedMessageDetail = withAppContextDecorator(
  formattedMessageDetailComputed,
  {
    ...applicationContext,
  },
);

describe('formattedMessageDetail', () => {
  it('formats the messages with createdAtFormatted and sorts by createdAt', () => {
    const result = runCompute(formattedMessageDetail, {
      state: {
        caseDetail: {
          documents: [],
        },
        messageDetail: [
          {
            attachments: [
              { documentId: '98065bac-b35c-423c-b649-122a09bb65b9' },
            ],
            caseId: '78fb798f-66c3-42fa-bb5a-c14fac735b61',
            createdAt: '2019-03-01T21:40:46.415Z',
            messageId: '60e129bf-b8ec-4e0c-93c7-9633ab69f5df',
          },
          {
            attachments: [
              { documentId: '98065bac-b35c-423c-b649-122a09bb65b9' },
              { documentId: 'fee3958e-c738-4794-b0a1-bad711506685' },
            ],
            caseId: '78fb798f-66c3-42fa-bb5a-c14fac735b61',
            createdAt: '2019-04-01T21:40:46.415Z',
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
        caseDetail: {
          documents: [],
        },
        messageDetail: [
          {
            attachments: [
              { documentId: '98065bac-b35c-423c-b649-122a09bb65b9' },
            ],
            caseId: '78fb798f-66c3-42fa-bb5a-c14fac735b61',
            createdAt: '2019-03-01T21:40:46.415Z',
            messageId: '60e129bf-b8ec-4e0c-93c7-9633ab69f5df',
          },
          {
            attachments: [
              { documentId: '98065bac-b35c-423c-b649-122a09bb65b9' },
              { documentId: 'fee3958e-c738-4794-b0a1-bad711506685' },
            ],
            caseId: '78fb798f-66c3-42fa-bb5a-c14fac735b61',
            completedAt: '2019-05-01T21:40:46.415Z',
            completedBy: 'Test Petitioner',
            completedBySection: 'petitions',
            completedByUserId: '23869007-384d-464f-b079-cb1fcfb21e03',
            createdAt: '2019-04-01T21:40:46.415Z',
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

  it('returns hasOlderMessages true if there is more than one message', () => {
    const result = runCompute(formattedMessageDetail, {
      state: {
        caseDetail: {
          documents: [],
        },
        messageDetail: [
          { createdAt: '2019-03-01T21:40:46.415Z' },
          { createdAt: '2019-04-01T21:40:46.415Z' },
        ],
      },
    });

    expect(result.hasOlderMessages).toEqual(true);
  });

  it('returns hasOlderMessages false and showOlderMessages false if there is only one message', () => {
    const result = runCompute(formattedMessageDetail, {
      state: {
        caseDetail: {
          documents: [],
        },
        messageDetail: [{ createdAt: '2019-03-01T21:40:46.415Z' }],
      },
    });

    expect(result.hasOlderMessages).toEqual(false);
    expect(result.showOlderMessages).toEqual(false);
  });

  it('returns showOlderMessages true if there is more than one message and isExpanded is true', () => {
    const result = runCompute(formattedMessageDetail, {
      state: {
        caseDetail: {
          documents: [],
        },
        isExpanded: true,
        messageDetail: [
          { createdAt: '2019-03-01T21:40:46.415Z' },
          { createdAt: '2019-04-01T21:40:46.415Z' },
        ],
      },
    });

    expect(result.showOlderMessages).toEqual(true);
  });

  it('returns showOlderMessages false if there is more than one message and isExpanded is false', () => {
    const result = runCompute(formattedMessageDetail, {
      state: {
        caseDetail: {
          documents: [],
        },
        isExpanded: false,
        messageDetail: [
          { createdAt: '2019-03-01T21:40:46.415Z' },
          { createdAt: '2019-04-01T21:40:46.415Z' },
        ],
      },
    });

    expect(result.showOlderMessages).toEqual(false);
  });

  describe('showNotServed', () => {
    const documentId = applicationContext.getUniqueId();

    it('should be true if the document type is servable and does not have a servedAt', () => {
      const result = runCompute(formattedMessageDetail, {
        state: {
          caseDetail: {
            docketRecord: [{ documentId }],
            documents: [
              {
                documentId,
                documentTitle: 'Some Stuff',
                documentType: 'Order',
                eventCode: 'O',
              },
            ],
          },
          isExpanded: false,
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

    it('should be false if the document type is unservable', () => {
      const result = runCompute(formattedMessageDetail, {
        state: {
          caseDetail: {
            docketRecord: [{ documentId }],
            documents: [
              {
                documentId,
                documentTitle: 'Some Stuff',
                documentType: 'Corrected Transcript',
                eventCode: 'CTRA',
              },
            ],
          },
          isExpanded: false,
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

      expect(result.attachments[0].showNotServed).toEqual(false);
    });

    it('should be false if the document type is servable and has servedAt', () => {
      const result = runCompute(formattedMessageDetail, {
        state: {
          caseDetail: {
            docketRecord: [{ documentId }],
            documents: [
              {
                documentId,
                documentTitle: 'Some Stuff',
                documentType: 'Order',
                eventCode: 'O',
                servedAt: '2019-03-01T21:40:46.415Z',
              },
            ],
          },
          isExpanded: false,
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

      expect(result.attachments[0].showNotServed).toEqual(false);
    });

    it('should be false if the document type is servable and not served and the document is a draft', () => {
      const result = runCompute(formattedMessageDetail, {
        state: {
          caseDetail: {
            docketRecord: [],
            documents: [
              {
                documentId,
                documentTitle: 'Some Stuff',
                documentType: 'Order',
                eventCode: 'O',
                isDraft: true,
              },
            ],
          },
          isExpanded: false,
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

      expect(result.attachments[0].showNotServed).toEqual(false);
    });
  });
});
