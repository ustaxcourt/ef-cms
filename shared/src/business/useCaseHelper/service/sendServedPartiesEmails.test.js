const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { sendServedPartiesEmails } = require('./sendServedPartiesEmails');

describe('sendServedPartiesEmails', () => {
  beforeAll(() => {
    applicationContext.getIrsSuperuserEmail.mockReturnValue(
      'irsSuperuser@example.com',
    );
  });
  it('should call sendBulkTemplatedEmail if there are electronic service parties on the case', async () => {
    await sendServedPartiesEmails({
      applicationContext,
      caseEntity: {
        caseCaption: 'A Caption',
        docketNumber: '123-20',
        docketRecord: [{ documentId: '0c745ceb-364a-4a1e-83b0-061f6f96a360' }],
      },
      documentEntity: {
        documentId: '0c745ceb-364a-4a1e-83b0-061f6f96a360',
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
      { email: '1@example.com' },
      { email: '2@example.com' },
      { email: 'irsSuperuser@example.com' },
    ]);
  });

  it('should call sendBulkTemplatedEmail only for the irs superuser if there are no electronic service parties on the case', async () => {
    await sendServedPartiesEmails({
      applicationContext,
      caseEntity: {
        caseCaption: 'A Caption',
        docketNumber: '123-20',
        docketRecord: [{ documentId: '0c745ceb-364a-4a1e-83b0-061f6f96a360' }],
      },
      documentEntity: {
        documentId: '0c745ceb-364a-4a1e-83b0-061f6f96a360',
        documentTitle: 'The Document',
        servedAt: '2019-03-01T21:40:46.415Z',
      },
      servedParties: {
        electronic: [],
      },
    });

    expect(
      applicationContext.getDispatchers().sendBulkTemplatedEmail,
    ).toBeCalled();
    expect(
      applicationContext.getDispatchers().sendBulkTemplatedEmail.mock
        .calls[0][0].destinations,
    ).toMatchObject([{ email: 'irsSuperuser@example.com' }]);
  });
});
