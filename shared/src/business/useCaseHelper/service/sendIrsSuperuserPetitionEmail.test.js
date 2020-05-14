const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  sendIrsSuperuserPetitionEmail,
} = require('./sendIrsSuperuserPetitionEmail');

describe('sendIrsSuperuserPetitionEmail', () => {
  beforeAll(() => {
    applicationContext.getIrsSuperuserEmail.mockReturnValue('irs@example.com');
  });

  it('should call sendBulkTemplatedEmail for the IRS superuser party', async () => {
    await sendIrsSuperuserPetitionEmail({
      applicationContext,
      caseEntity: { caseCaption: 'A Caption', docketNumber: '123-20' },
      documentEntity: {
        documentTitle: 'The Document',
        servedAt: '2019-03-01T21:40:46.415Z',
      },
    });

    expect(
      applicationContext.getDispatchers().sendBulkTemplatedEmail,
    ).toBeCalled();
    expect(
      applicationContext.getDispatchers().sendBulkTemplatedEmail.mock
        .calls[0][0].destinations,
    ).toMatchObject([{ email: 'irs@example.com' }]);
  });
});
