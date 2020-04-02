const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { sendServedPartiesEmails } = require('./sendServedPartiesEmails');

describe('sendServedPartiesEmails', () => {
  it('should call sendBulkTemplatedEmail if there are electronic service parties on the case', async () => {
    await sendServedPartiesEmails({
      applicationContext,
      caseEntity: { caseCaption: 'A Caption', docketNumber: '123-20' },
      documentEntity: {
        documentTitle: 'The Document',
        servedAt: '2019-03-01T21:40:46.415Z',
      },
      servedParties: {
        electronic: [
          { email: '1@example.com', name: '1' },
          { email: '2@example.com', name: '2' },
        ],
      },
    });

    expect(
      applicationContext.getDispatchers().sendBulkTemplatedEmail,
    ).toBeCalled();
    expect(
      applicationContext.getDispatchers().sendBulkTemplatedEmail.mock
        .calls[0][0].destinations,
    ).toMatchObject([
      {
        email: '1@example.com',
      },
      { email: '2@example.com' },
    ]);
  });

  it('should not call sendBulkTemplatedEmail if there are no electronic service parties on the case', async () => {
    await sendServedPartiesEmails({
      applicationContext,
      caseEntity: { caseCaption: 'A Caption', docketNumber: '123-20' },
      documentEntity: {
        documentTitle: 'The Document',
        servedAt: '2019-03-01T21:40:46.415Z',
      },
      servedParties: {
        electronic: [],
      },
    });

    expect(
      applicationContext.getDispatchers().sendBulkTemplatedEmail,
    ).not.toBeCalled();
  });
});
