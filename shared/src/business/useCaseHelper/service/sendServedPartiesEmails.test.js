const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
} = require('../../entities/EntityConstants');
const {
  reactTemplateGenerator,
} = require('../../utilities/generateHTMLTemplateForPDF/reactTemplateGenerator');
const { Case } = require('../../entities/cases/Case');
const { MOCK_CASE } = require('../../../test/mockCase');
const { sendServedPartiesEmails } = require('./sendServedPartiesEmails');
jest.mock(
  '../../utilities/generateHTMLTemplateForPDF/reactTemplateGenerator',
  () => ({
    reactTemplateGenerator: jest.fn(),
  }),
);

describe('sendServedPartiesEmails', () => {
  beforeAll(() => {
    applicationContext.getIrsSuperuserEmail.mockReturnValue(
      'irsSuperuser@example.com',
    );
  });

  it('should call sendBulkTemplatedEmail if there are electronic service parties on the case and include the irs superuser if the case status is not new', async () => {
    const caseEntity = new Case(
      {
        caseCaption: 'A Caption',
        docketEntries: [
          {
            docketEntryId: '0c745ceb-364a-4a1e-83b0-061f6f96a360',
            documentType: 'The Document',
            index: 1,
            servedAt: '2019-03-01T21:40:46.415Z',
          },
        ],
        docketNumber: '123-20',
        docketNumberWithSuffix: '123-20L',
        petitioners: MOCK_CASE.petitioners,
        status: CASE_STATUS_TYPES.generalDocket,
      },
      { applicationContext },
    );

    await sendServedPartiesEmails({
      applicationContext,
      caseEntity,
      docketEntryId: '0c745ceb-364a-4a1e-83b0-061f6f96a360',
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

  it('should call sendBulkTemplatedEmail if there are electronic service parties on the case and not include the irs superuser if the case status is new', async () => {
    const caseEntity = new Case(
      {
        caseCaption: 'A Caption',
        docketEntries: [
          {
            docketEntryId: '0c745ceb-364a-4a1e-83b0-061f6f96a360',
            documentTitle: 'The Document',
            index: 1,
            servedAt: '2019-03-01T21:40:46.415Z',
          },
        ],
        docketNumber: '123-20',
        docketNumberWithSuffix: '123-20L',
        status: CASE_STATUS_TYPES.new,
      },
      { applicationContext },
    );

    await sendServedPartiesEmails({
      applicationContext,
      caseEntity,
      docketEntryId: '0c745ceb-364a-4a1e-83b0-061f6f96a360',
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
    ).toMatchObject([{ email: '1@example.com' }, { email: '2@example.com' }]);
  });

  it('should call sendBulkTemplatedEmail only for the irs superuser if there are no electronic service parties on the case and the case status is not new', async () => {
    const caseEntity = new Case(
      {
        caseCaption: 'A Caption',
        docketEntries: [
          {
            docketEntryId: '0c745ceb-364a-4a1e-83b0-061f6f96a360',
            documentTitle: 'The Document',
            index: 1,
            servedAt: '2019-03-01T21:40:46.415Z',
          },
        ],
        docketNumber: '123-20',
        docketNumberWithSuffix: '123-20L',
        status: CASE_STATUS_TYPES.generalDocket,
      },
      { applicationContext },
    );

    await sendServedPartiesEmails({
      applicationContext,
      caseEntity,
      docketEntryId: '0c745ceb-364a-4a1e-83b0-061f6f96a360',
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

  it('should use docketNumberSuffix if a docketNumberSuffix is present', async () => {
    const caseEntity = new Case(
      {
        caseCaption: 'A Caption',
        caseType: CASE_TYPES_MAP.cdp,
        docketEntries: [
          {
            docketEntryId: '0c745ceb-364a-4a1e-83b0-061f6f96a360',
            documentTitle: 'The Document',
            index: 1,
            servedAt: '2019-03-01T21:40:46.415Z',
          },
        ],
        docketNumber: '123-20',
        procedureType: 'Regular',
        status: CASE_STATUS_TYPES.generalDocket,
      },
      { applicationContext },
    );

    await sendServedPartiesEmails({
      applicationContext,
      caseEntity,
      docketEntryId: '0c745ceb-364a-4a1e-83b0-061f6f96a360',
      servedParties: {
        electronic: [],
      },
    });

    const { caseDetail } = reactTemplateGenerator.mock.calls[0][0].data;
    expect(caseDetail.docketNumber).toEqual('123-20');
    expect(caseDetail.docketNumberWithSuffix).toEqual('123-20L');
  });

  it('should throw an error if the docket entry does not have an index', async () => {
    const caseEntity = new Case(
      {
        caseCaption: 'A Caption',
        docketEntries: [
          {
            docketEntryId: '0c745ceb-364a-4a1e-83b0-061f6f96a360',
            documentTitle: 'The Document',
            servedAt: '2019-03-01T21:40:46.415Z',
          },
        ],
        docketNumber: '123-20',
        docketNumberWithSuffix: '123-20L',
        status: CASE_STATUS_TYPES.generalDocket,
      },
      { applicationContext },
    );

    await expect(
      sendServedPartiesEmails({
        applicationContext,
        caseEntity,
        docketEntryId: '0c745ceb-364a-4a1e-83b0-061f6f96a360',
        servedParties: {
          electronic: [],
        },
      }),
    ).rejects.toThrow('Cannot serve a docket entry without an index.');
  });

  it('should not include IRS superuser twice in served parties if function is called twice with a servedParties object passed in by reference', async () => {
    const caseEntity = new Case(
      {
        caseCaption: 'A Caption',
        caseType: CASE_TYPES_MAP.cdp,
        docketEntries: [
          {
            docketEntryId: '0c745ceb-364a-4a1e-83b0-061f6f96a360',
            documentTitle: 'The Document',
            index: 1,
            servedAt: '2019-03-01T21:40:46.415Z',
          },
          {
            docketEntryId: '52020dd3-1d6b-4eb3-8cc9-6635b0bf5656',
            documentTitle: 'Another Document',
            index: 2,
            servedAt: '2019-03-01T21:40:46.415Z',
          },
        ],
        docketNumber: '123-20',
        procedureType: 'Regular',
        status: CASE_STATUS_TYPES.generalDocket,
      },
      { applicationContext },
    );

    const servedParties = {
      electronic: [],
    };

    await sendServedPartiesEmails({
      applicationContext,
      caseEntity,
      docketEntryId: '0c745ceb-364a-4a1e-83b0-061f6f96a360',
      servedParties,
    });
    await sendServedPartiesEmails({
      applicationContext,
      caseEntity,
      docketEntryId: '52020dd3-1d6b-4eb3-8cc9-6635b0bf5656',
      servedParties,
    });

    expect(
      applicationContext.getDispatchers().sendBulkTemplatedEmail.mock
        .calls[0][0].destinations,
    ).toMatchObject([
      {
        email: applicationContext.getIrsSuperuserEmail(),
      },
    ]);
    expect(
      applicationContext.getDispatchers().sendBulkTemplatedEmail.mock
        .calls[1][0].destinations,
    ).toMatchObject([
      {
        email: applicationContext.getIrsSuperuserEmail(),
      },
    ]);
  });
});
