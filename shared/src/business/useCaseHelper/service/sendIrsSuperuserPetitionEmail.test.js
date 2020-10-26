const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CASE_TYPES_MAP,
  DOCKET_NUMBER_SUFFIXES,
  PARTY_TYPES,
} = require('../../entities/EntityConstants');
const {
  reactTemplateGenerator,
} = require('../../utilities/generateHTMLTemplateForPDF/reactTemplateGenerator');
const {
  sendIrsSuperuserPetitionEmail,
} = require('./sendIrsSuperuserPetitionEmail');
const { Case } = require('../../entities/cases/Case');
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
    const caseEntity = new Case(
      {
        caseCaption: 'A Caption',
        contactPrimary: {},
        contactSecondary: {},
        docketEntries: [
          {
            docketEntryId: '2ac7bb95-2136-47dd-842f-242220ed427b',
            documentType: 'The Document',
            eventCode: 'P',
            index: 0,
            servedAt: '2019-03-01T21:40:46.415Z',
          },
        ],
        docketNumber: '123-20',
        docketNumberWithSuffix: '123-20L',
        preferredTrialCity: 'Somecity, ST',
        privatePractitioners: [],
      },
      { applicationContext },
    );

    await sendIrsSuperuserPetitionEmail({
      applicationContext,
      caseEntity,
      docketEntryId: '2ac7bb95-2136-47dd-842f-242220ed427b',
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

  it('should use docketNumberSuffix if a docketNumberSuffix is present', async () => {
    const caseEntity = new Case(
      {
        caseCaption: 'A Caption',
        caseType: CASE_TYPES_MAP.cdp,
        contactPrimary: {
          name: 'Joe Exotic',
        },
        contactSecondary: {
          name: 'Carol Baskin',
        },
        docketEntries: [
          {
            docketEntryId: '2ac7bb95-2136-47dd-842f-242220ed427b',
            documentType: 'The Document',
            eventCode: 'P',
            index: 1,
            servedAt: '2019-03-01T21:40:46.415Z',
          },
        ],
        docketNumber: '123-20',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
        docketNumberWithSuffix: '123-20S',
        preferredTrialCity: 'Somecity, ST',
        privatePractitioners: [
          {
            representingPrimary: true,
          },
          {
            representingSecondary: true,
          },
        ],
        procedureType: 'Regular',
      },
      { applicationContext },
    );

    await sendIrsSuperuserPetitionEmail({
      applicationContext,
      caseEntity,
      docketEntryId: '2ac7bb95-2136-47dd-842f-242220ed427b',
    });

    const { caseDetail } = reactTemplateGenerator.mock.calls[0][0].data;
    expect(caseDetail.docketNumber).toEqual('123-20');
    expect(caseDetail.docketNumberWithSuffix).toEqual('123-20L');
  });

  it('should add a `representing` field to practitioners with the names of parties they represent', async () => {
    const caseEntity = new Case(
      {
        caseCaption: 'A Caption',
        contactPrimary: {
          name: 'Joe Exotic',
        },
        contactSecondary: {
          name: 'Carol Baskin',
        },
        docketEntries: [
          {
            docketEntryId: '2ac7bb95-2136-47dd-842f-242220ed427b',
            documentType: 'The Document',
            eventCode: 'P',
            index: 1,
            servedAt: '2019-03-01T21:40:46.415Z',
          },
        ],
        docketNumber: '123-20',
        docketNumberWithSuffix: '123-20L',
        partyType: PARTY_TYPES.petitionerSpouse,
        preferredTrialCity: 'Somecity, ST',
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
      { applicationContext },
    );

    await sendIrsSuperuserPetitionEmail({
      applicationContext,
      caseEntity,
      docketEntryId: '2ac7bb95-2136-47dd-842f-242220ed427b',
    });

    const { practitioners } = reactTemplateGenerator.mock.calls[0][0].data;

    expect(practitioners).toMatchObject([
      {
        representingFormatted: 'Joe Exotic',
        representingPrimary: true,
      },
      {
        representingFormatted: 'Joe Exotic, Carol Baskin',
        representingPrimary: true,
      },
    ]);
  });

  it('should include a formatted document filingDate', async () => {
    const caseEntity = new Case(
      {
        caseCaption: 'A Caption',
        contactPrimary: {
          name: 'Joe Exotic',
        },
        docketEntries: [
          {
            docketEntryId: '2ac7bb95-2136-47dd-842f-242220ed427b',
            filingDate: '2019-03-05T21:40:46.415Z',
            index: 1,
          },
        ],
        docketNumber: '123-20',
        docketNumberWithSuffix: '123-20L',
        privatePractitioners: [],
      },
      { applicationContext },
    );

    await sendIrsSuperuserPetitionEmail({
      applicationContext,
      caseEntity,
      docketEntryId: '2ac7bb95-2136-47dd-842f-242220ed427b',
    });

    const { documentDetail } = reactTemplateGenerator.mock.calls[0][0].data;

    expect(documentDetail).toMatchObject({
      filingDate: '03/05/19',
    });
  });

  it('should include the trial location from the case', async () => {
    const caseEntity = new Case(
      {
        caseCaption: 'A Caption',
        contactPrimary: {
          name: 'Joe Exotic',
        },
        docketEntries: [
          {
            docketEntryId: '2ac7bb95-2136-47dd-842f-242220ed427b',
            filingDate: '2019-03-05T21:40:46.415Z',
            index: 1,
          },
        ],
        docketNumber: '123-20',
        docketNumberWithSuffix: '123-20L',
        preferredTrialCity: 'Fake Trial Location, ST',
        privatePractitioners: [],
      },
      { applicationContext },
    );

    await sendIrsSuperuserPetitionEmail({
      applicationContext,
      caseEntity,
      docketEntryId: '2ac7bb95-2136-47dd-842f-242220ed427b',
    });

    const { caseDetail } = reactTemplateGenerator.mock.calls[0][0].data;

    expect(caseDetail).toMatchObject({
      trialLocation: 'Fake Trial Location, ST',
    });
  });

  it('should default the trial location if not set on the case', async () => {
    const caseEntity = new Case(
      {
        caseCaption: 'A Caption',
        contactPrimary: {
          name: 'Joe Exotic',
        },
        docketEntries: [
          {
            docketEntryId: '2ac7bb95-2136-47dd-842f-242220ed427b',
            filingDate: '2019-03-05T21:40:46.415Z',
            index: 1,
          },
        ],
        docketNumber: '123-20',
        docketNumberWithSuffix: '123-20L',
        preferredTrialCity: '',
        privatePractitioners: [],
      },
      { applicationContext },
    );

    await sendIrsSuperuserPetitionEmail({
      applicationContext,
      caseEntity,
      docketEntryId: '2ac7bb95-2136-47dd-842f-242220ed427b',
    });

    const { caseDetail } = reactTemplateGenerator.mock.calls[0][0].data;

    expect(caseDetail).toMatchObject({
      trialLocation: 'No requested place of trial',
    });
  });

  it('should throw an error if the docket entry does not have an index', async () => {
    const caseEntity = new Case(
      {
        caseCaption: 'A Caption',
        contactPrimary: {
          name: 'Joe Exotic',
        },
        docketEntries: [
          {
            docketEntryId: '2ac7bb95-2136-47dd-842f-242220ed427b',
            filingDate: '2019-03-05T21:40:46.415Z',
          },
        ],
        docketNumber: '123-20',
        docketNumberWithSuffix: '123-20L',
        preferredTrialCity: '',
        privatePractitioners: [],
      },
      { applicationContext },
    );

    await expect(
      sendIrsSuperuserPetitionEmail({
        applicationContext,
        caseEntity,
        docketEntryId: '2ac7bb95-2136-47dd-842f-242220ed427b',
      }),
    ).rejects.toThrow('Cannot serve a docket entry without an index.');
  });
});
