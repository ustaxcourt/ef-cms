jest.mock('react');
jest.mock('react-dom/server');
import {
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  PARTY_TYPES,
} from '../../entities/EntityConstants';
import { Case } from '../../entities/cases/Case';
import { applicationContext } from '../../test/createTestApplicationContext';
import { sendIrsSuperuserPetitionEmail } from './sendIrsSuperuserPetitionEmail';
import React from 'react';
import ReactDOM from 'react-dom/server';

describe('sendIrsSuperuserPetitionEmail', () => {
  const PRIMARY_CONTACT_ID = '679088cf-c125-444a-bfe4-936971050e5a';
  const SECONDARY_CONTACT_ID = 'a2b2be88-1270-40fd-8a67-f61d1bd0c8d7';

  beforeAll(() => {
    applicationContext.getIrsSuperuserEmail.mockReturnValue('irs@example.com');
  });

  beforeEach(() => {
    React.createElement = jest.fn();
    ReactDOM.renderToString = jest.fn();
  });

  it('should call sendBulkTemplatedEmail for the IRS superuser party', async () => {
    const caseEntity = new Case(
      {
        caseCaption: 'A Caption',
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
        petitioners: [],
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

    expect(
      applicationContext.getDispatchers().sendBulkTemplatedEmail,
    ).toHaveBeenCalled();
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
        partyType: PARTY_TYPES.petitioner,
        petitioners: [
          {
            contactId: PRIMARY_CONTACT_ID,
            contactType: CONTACT_TYPES.primary,
            name: 'Joe Exotic',
          },
          {
            contactId: SECONDARY_CONTACT_ID,
            contactType: CONTACT_TYPES.secondary,
            name: 'Carol Baskin',
          },
        ],
        preferredTrialCity: 'Somecity, ST',
        privatePractitioners: [
          {
            representing: [PRIMARY_CONTACT_ID],
          },
          {
            representing: [SECONDARY_CONTACT_ID],
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

    const { caseDetail } = (React.createElement as any).mock.calls[0][1];
    expect(caseDetail.docketNumber).toEqual('123-20');
    expect(caseDetail.docketNumberWithSuffix).toEqual('123-20L');
  });

  it('should add a `representing` field to practitioners with the names of parties they represent', async () => {
    const caseEntity = new Case(
      {
        caseCaption: 'A Caption',
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
        petitioners: [
          {
            contactId: PRIMARY_CONTACT_ID,
            contactType: CONTACT_TYPES.primary,
            name: 'Joe Exotic',
          },
          {
            contactId: SECONDARY_CONTACT_ID,
            contactType: CONTACT_TYPES.secondary,
            name: 'Carol Baskin',
          },
        ],
        preferredTrialCity: 'Somecity, ST',
        privatePractitioners: [
          {
            representing: [PRIMARY_CONTACT_ID],
          },
          {
            representing: [PRIMARY_CONTACT_ID, SECONDARY_CONTACT_ID],
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

    const { practitioners } = (React.createElement as any).mock.calls[0][1];

    expect(practitioners).toMatchObject([
      {
        representingFormatted: 'Joe Exotic',
      },
      {
        representingFormatted: 'Joe Exotic, Carol Baskin',
      },
    ]);
  });

  it('should include a formatted document filingDate', async () => {
    const caseEntity = new Case(
      {
        caseCaption: 'A Caption',
        docketEntries: [
          {
            docketEntryId: '2ac7bb95-2136-47dd-842f-242220ed427b',
            filingDate: '2019-03-05T21:40:46.415Z',
            index: 1,
          },
        ],
        docketNumber: '123-20',
        docketNumberWithSuffix: '123-20L',
        petitioners: [
          {
            contactType: CONTACT_TYPES.primary,
            name: 'Joe Exotic',
          },
        ],
        privatePractitioners: [],
      },
      { applicationContext },
    );

    await sendIrsSuperuserPetitionEmail({
      applicationContext,
      caseEntity,
      docketEntryId: '2ac7bb95-2136-47dd-842f-242220ed427b',
    });

    const { documentDetail } = (React.createElement as any).mock.calls[0][1];

    expect(documentDetail).toMatchObject({
      filingDate: '03/05/19',
    });
  });

  it('should include the trial location from the case', async () => {
    const caseEntity = new Case(
      {
        caseCaption: 'A Caption',
        docketEntries: [
          {
            docketEntryId: '2ac7bb95-2136-47dd-842f-242220ed427b',
            filingDate: '2019-03-05T21:40:46.415Z',
            index: 1,
          },
        ],
        docketNumber: '123-20',
        docketNumberWithSuffix: '123-20L',
        petitioners: [
          {
            contactType: CONTACT_TYPES.primary,
            name: 'Joe Exotic',
          },
        ],
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

    const { caseDetail } = (React.createElement as any).mock.calls[0][1];

    expect(caseDetail).toMatchObject({
      trialLocation: 'Fake Trial Location, ST',
    });
  });

  it('should default the trial location if not set on the case', async () => {
    const caseEntity = new Case(
      {
        caseCaption: 'A Caption',
        docketEntries: [
          {
            docketEntryId: '2ac7bb95-2136-47dd-842f-242220ed427b',
            filingDate: '2019-03-05T21:40:46.415Z',
            index: 1,
          },
        ],
        docketNumber: '123-20',
        docketNumberWithSuffix: '123-20L',
        petitioners: [
          {
            contactType: CONTACT_TYPES.primary,
            name: 'Joe Exotic',
          },
        ],
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

    const { caseDetail } = (React.createElement as any).mock.calls[0][1];

    expect(caseDetail).toMatchObject({
      trialLocation: 'No requested place of trial',
    });
  });

  it('should throw an error if the docket entry does not have an index', async () => {
    const caseEntity = new Case(
      {
        caseCaption: 'A Caption',
        docketEntries: [
          {
            docketEntryId: '2ac7bb95-2136-47dd-842f-242220ed427b',
            filingDate: '2019-03-05T21:40:46.415Z',
          },
        ],
        docketNumber: '123-20',
        docketNumberWithSuffix: '123-20L',
        petitioners: [
          {
            contactType: CONTACT_TYPES.primary,
            name: 'Joe Exotic',
          },
        ],
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
