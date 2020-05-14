const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  reactTemplateGenerator,
} = require('../../utilities/generateHTMLTemplateForPDF/reactTemplateGenerator');
const {
  sendIrsSuperuserPetitionEmail,
} = require('./sendIrsSuperuserPetitionEmail');
jest.mock(
  '../../utilities/generateHTMLTemplateForPDF/reactTemplateGenerator',
  () => ({
    reactTemplateGenerator: jest.fn(),
  }),
);

describe('sendIrsSuperuserPetitionEmail', () => {
  beforeAll(() => {
    applicationContext.getIrsSuperuserEmail.mockReturnValue('irs@example.com');
  });

  it('should call sendBulkTemplatedEmail for the IRS superuser party', async () => {
    await sendIrsSuperuserPetitionEmail({
      applicationContext,
      caseEntity: {
        caseCaption: 'A Caption',
        contactPrimary: {},
        contactSecondary: {},
        docketNumber: '123-20',
        docketRecord: [],
        privatePractitioners: [],
      },
      documentEntity: {
        documentId: 'test-document-id',
        documentTitle: 'The Document',
        servedAt: '2019-03-01T21:40:46.415Z',
      },
    });

    expect(reactTemplateGenerator).toHaveBeenCalled();
    expect(
      applicationContext.getDispatchers().sendBulkTemplatedEmail,
    ).toBeCalled();
    expect(
      applicationContext.getDispatchers().sendBulkTemplatedEmail.mock
        .calls[0][0].destinations,
    ).toMatchObject([{ email: 'irs@example.com' }]);
  });

  it('should concatenate the docketNumber and docketNumberSuffix if a docketNumberSuffix is present', async () => {
    await sendIrsSuperuserPetitionEmail({
      applicationContext,
      caseEntity: {
        caseCaption: 'A Caption',
        contactPrimary: {
          name: 'Joe Exotic',
        },
        contactSecondary: {
          name: 'Carol Baskin',
        },
        docketNumber: '123-20',
        docketNumberSuffix: 'S',
        docketRecord: [],
        privatePractitioners: [
          {
            representingPrimary: true,
          },
          {
            representingPrimary: true,
            representingSecondary: true,
          },
        ],
      },
      documentEntity: {
        documentId: 'test-document-id',
        documentTitle: 'The Document',
        servedAt: '2019-03-01T21:40:46.415Z',
      },
    });

    const { caseDetail } = reactTemplateGenerator.mock.calls[0][0].data;
    expect(caseDetail.docketNumber).toEqual('123-20S');
  });

  it('should add a `representing` field to practitioners with the names of parties they represent', async () => {
    await sendIrsSuperuserPetitionEmail({
      applicationContext,
      caseEntity: {
        caseCaption: 'A Caption',
        contactPrimary: {
          name: 'Joe Exotic',
        },
        contactSecondary: {
          name: 'Carol Baskin',
        },
        docketNumber: '123-20',
        docketRecord: [],
        privatePractitioners: [
          {
            representingPrimary: true,
          },
          {
            representingPrimary: true,
            representingSecondary: true,
          },
        ],
      },
      documentEntity: {
        documentId: 'test-document-id',
        documentTitle: 'The Document',
        servedAt: '2019-03-01T21:40:46.415Z',
      },
    });

    const { practitioners } = reactTemplateGenerator.mock.calls[0][0].data;

    expect(practitioners).toMatchObject([
      {
        representing: 'Joe Exotic',
        representingPrimary: true,
      },
      {
        representing: 'Joe Exotic, Carol Baskin',
        representingPrimary: true,
      },
    ]);
  });
});
