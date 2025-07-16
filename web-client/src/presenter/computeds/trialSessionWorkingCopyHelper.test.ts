import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { MOCK_DOCUMENTS } from '@shared/test/mockDocketEntry';
import { PARTIES_CODES } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { cloneDeep } from 'lodash';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { trialSessionWorkingCopyHelper as trialSessionWorkingCopyHelperComputed } from './trialSessionWorkingCopyHelper';
import { withAppContextDecorator } from '../../withAppContext';

describe('trial session working copy computed', () => {
  const trialSessionWorkingCopyHelper = withAppContextDecorator(
    trialSessionWorkingCopyHelperComputed,
    applicationContext,
  );

  const MOCK_TRIAL_SESSION = {
    city: 'Hartford',
    courtReporter: 'Test Court Reporter',
    irsCalendarAdministrator: 'Test Calendar Admin',
    judge: { name: 'Test Judge' },
    postalCode: '12345',
    startDate: '2019-11-25T15:00:00.000Z',
    startTime: '10:00',
    state: 'CT',
    term: 'Fall',
    termYear: '2019',
    trialClerk: { name: 'Test Trial Clerk' },
    trialLocation: 'Hartford, Connecticut',
  };

  describe('filingPartiesCode', () => {
    it('should add Filing parties code onto cases that have a preTrialMemorandum', () => {
      const petitionerId = '3e85260e-9d45-481d-8092-7d732df6ee78';
      const ptmCase = cloneDeep(MOCK_CASE);
      ptmCase.docketEntries = [MOCK_DOCUMENTS];
      ptmCase.docketEntries[0].eventCode = 'PMT';
      ptmCase.docketEntries[0].filers = [petitionerId];
      ptmCase.petitioners[0].contactId = petitionerId;

      const { formattedCases } = runCompute(trialSessionWorkingCopyHelper, {
        state: {
          trialSession: {
            ...MOCK_TRIAL_SESSION,
            calendaredCases: [ptmCase],
            caseOrder: [],
          },
          trialSessionWorkingCopy: {
            caseMetadata: {},
            filters: { statusUnassigned: true },
            sort: 'docket',
            sortOrder: 'asc',
            userNotes: {},
          },
        },
      });

      expect(formattedCases[0]).toMatchObject({
        filingPartiesCode: PARTIES_CODES.PETITIONER,
      });
    });
  });

  describe('sorting', () => {
    it('should sort cases by docket number ascending when sort is set to "docket" and sortOrder is "asc"', () => {
      const { formattedCases } = runCompute(trialSessionWorkingCopyHelper, {
        state: {
          trialSession: {
            ...MOCK_TRIAL_SESSION,
            calendaredCases: [
              MOCK_CASE,
              { ...MOCK_CASE, docketNumber: '102-19' },
              { ...MOCK_CASE, docketNumber: '5000-17' },
              { ...MOCK_CASE, docketNumber: '500-17' },
              { ...MOCK_CASE, docketNumber: '90-07' },
            ],
            caseOrder: [],
          },
          trialSessionWorkingCopy: {
            caseMetadata: {},
            filters: { statusUnassigned: true },
            sort: 'docket',
            sortOrder: 'asc',
            userNotes: {},
          },
        },
      });

      expect(formattedCases).toMatchObject([
        { docketNumber: '90-07' },
        { docketNumber: '500-17' },
        { docketNumber: '5000-17' },
        { docketNumber: '101-18' },
        { docketNumber: '102-19' },
      ]);
    });

    it('should sort cases by docket number descending when sort is set to "docket" and sortOrder is "desc"', () => {
      const { formattedCases } = runCompute(trialSessionWorkingCopyHelper, {
        state: {
          trialSession: {
            ...MOCK_TRIAL_SESSION,
            calendaredCases: [
              MOCK_CASE,
              { ...MOCK_CASE, docketNumber: '102-19' },
              { ...MOCK_CASE, docketNumber: '5000-17' },
              { ...MOCK_CASE, docketNumber: '500-17' },
              { ...MOCK_CASE, docketNumber: '90-07' },
            ],
            caseOrder: [],
          },
          trialSessionWorkingCopy: {
            caseMetadata: {},
            filters: { statusUnassigned: true },
            sort: 'docket',
            sortOrder: 'desc',
            userNotes: {},
          },
        },
      });

      expect(formattedCases).toMatchObject([
        { docketNumber: '102-19' },
        { docketNumber: '101-18' },
        { docketNumber: '5000-17' },
        { docketNumber: '500-17' },
        { docketNumber: '90-07' },
      ]);
    });

    it('should sort cases by private practitioner count ascending when sort is set to "practitioner" and sortOrder is "asc"', () => {
      const { casesShownCount, formattedCases } = runCompute(
        trialSessionWorkingCopyHelper,
        {
          state: {
            trialSession: {
              ...MOCK_TRIAL_SESSION,
              calendaredCases: [
                MOCK_CASE,
                {
                  ...MOCK_CASE,
                  docketNumber: '102-19',
                  privatePractitioners: [],
                },
                {
                  ...MOCK_CASE,
                  docketNumber: '5000-17',
                  privatePractitioners: [{}, {}],
                },
                {
                  ...MOCK_CASE,
                  docketNumber: '500-17',
                  privatePractitioners: [{}, {}],
                },
                {
                  ...MOCK_CASE,
                  docketNumber: '90-07',
                },
              ],
              caseOrder: [],
            },
            trialSessionWorkingCopy: {
              caseMetadata: {},
              filters: { statusUnassigned: true },
              sort: 'practitioner',
              sortOrder: 'asc',
              userNotes: {},
            },
          },
        },
      );

      expect(formattedCases).toMatchObject([
        { docketNumber: '90-07' },
        { docketNumber: '101-18' },
        { docketNumber: '102-19' },
        { docketNumber: '500-17' },
        { docketNumber: '5000-17' },
      ]);
      expect(casesShownCount).toEqual(5);
    });

    it('should sort only lead and unconsolidated cases, but return the total number of cases as casesShownCount', () => {
      const { casesShownCount, formattedCases } = runCompute(
        trialSessionWorkingCopyHelper,
        {
          state: {
            trialSession: {
              ...MOCK_TRIAL_SESSION,
              calendaredCases: [
                MOCK_CASE,
                {
                  ...MOCK_CASE,
                  docketNumber: '102-19',
                  leadDocketNumber: '500-17',
                  privatePractitioners: [],
                },
                {
                  ...MOCK_CASE,
                  docketNumber: '5000-17',
                  leadDocketNumber: '500-17',
                  privatePractitioners: [{}, {}],
                },
                {
                  ...MOCK_CASE,
                  docketNumber: '500-17',
                  leadDocketNumber: '500-17',
                  privatePractitioners: [{}, {}],
                },
                {
                  ...MOCK_CASE,
                  docketNumber: '90-07',
                },
              ],
              caseOrder: [],
            },
            trialSessionWorkingCopy: {
              caseMetadata: {},
              filters: { statusUnassigned: true },
              sort: 'practitioner',
              sortOrder: 'asc',
              userNotes: {},
            },
          },
        },
      );

      expect(formattedCases).toMatchObject([
        { docketNumber: '90-07' },
        { docketNumber: '101-18' },
        { docketNumber: '500-17' },
      ]);
      expect(casesShownCount).toEqual(5);
    });

    it('should return lead and unconsolidated cases, and sort consolidated cases within a lead case in ascending order', () => {
      const { casesShownCount, formattedCases } = runCompute(
        trialSessionWorkingCopyHelper,
        {
          state: {
            trialSession: {
              ...MOCK_TRIAL_SESSION,
              calendaredCases: [
                MOCK_CASE,
                {
                  ...MOCK_CASE,
                  docketNumber: '102-19',
                  leadDocketNumber: '500-17',
                  privatePractitioners: [],
                },
                {
                  ...MOCK_CASE,
                  docketNumber: '5000-17',
                  leadDocketNumber: '500-17',
                  privatePractitioners: [{}, {}],
                },
                {
                  ...MOCK_CASE,
                  docketNumber: '500-17',
                  leadDocketNumber: '500-17',
                  privatePractitioners: [{}, {}],
                },
                {
                  ...MOCK_CASE,
                  docketNumber: '90-18',
                  leadDocketNumber: '500-17',
                },
                {
                  ...MOCK_CASE,
                  docketNumber: '101-21',
                  leadDocketNumber: '500-17',
                  privatePractitioners: [],
                },
                {
                  ...MOCK_CASE,
                  docketNumber: '115-20',
                  privatePractitioners: [],
                },
              ],
              caseOrder: [],
            },
            trialSessionWorkingCopy: {
              caseMetadata: {},
              filters: { statusUnassigned: true },
              sort: 'docket',
              sortOrder: 'asc',
              userNotes: {},
            },
          },
        },
      );

      expect(formattedCases).toMatchObject([
        { docketNumber: '500-17' },
        { docketNumber: '101-18' },
        { docketNumber: '115-20' },
      ]);
      expect(formattedCases[0].nestedConsolidatedCases).toMatchObject([
        { docketNumber: '5000-17' },
        { docketNumber: '90-18' },
        { docketNumber: '102-19' },
        { docketNumber: '101-21' },
      ]);
      expect(casesShownCount).toEqual(7);
    });

    it('should return a member case (without a lead case on the trial session) and unconsolidated cases', () => {
      const { formattedCases } = runCompute(trialSessionWorkingCopyHelper, {
        state: {
          trialSession: {
            ...MOCK_TRIAL_SESSION,
            calendaredCases: [
              {
                ...MOCK_CASE,
                docketNumber: '102-19',
                leadDocketNumber: '500-17',
                privatePractitioners: [],
              },
              {
                ...MOCK_CASE,
                docketNumber: '115-20',
                privatePractitioners: [],
              },
            ],
            caseOrder: [],
          },
          trialSessionWorkingCopy: {
            caseMetadata: {},
            filters: { statusUnassigned: true },
            sort: 'docket',
            sortOrder: 'asc',
            userNotes: {},
          },
        },
      });

      expect(formattedCases).toMatchObject([
        { docketNumber: '102-19' },
        { docketNumber: '115-20' },
      ]);
    });

    it('should return a member case (without a lead case on the trial session), a lead case, and unconsolidated cases sorted in ascending order', () => {
      const { formattedCases } = runCompute(trialSessionWorkingCopyHelper, {
        state: {
          trialSession: {
            ...MOCK_TRIAL_SESSION,
            calendaredCases: [
              {
                ...MOCK_CASE,
                docketNumber: '102-19',
                leadDocketNumber: '500-17',
                privatePractitioners: [],
              },
              {
                ...MOCK_CASE,
                docketNumber: '111-17',
                leadDocketNumber: '111-17',
                privatePractitioners: [],
              },
              {
                ...MOCK_CASE,
                docketNumber: '122-17',
                leadDocketNumber: '111-17',
                privatePractitioners: [],
              },
              {
                ...MOCK_CASE,
                docketNumber: '115-20',
                privatePractitioners: [],
              },
            ],
            caseOrder: [],
          },
          trialSessionWorkingCopy: {
            caseMetadata: {},
            filters: { statusUnassigned: true },
            sort: 'docket',
            sortOrder: 'asc',
            userNotes: {},
          },
        },
      });

      expect(formattedCases).toMatchObject([
        { docketNumber: '111-17' },
        { docketNumber: '102-19' },
        { docketNumber: '115-20' },
      ]);

      expect(formattedCases[0].nestedConsolidatedCases).toMatchObject([
        { docketNumber: '122-17' },
      ]);
    });

    it('should assign consolidated member cases to the correct lead case and sort them correctly', () => {
      const { casesShownCount, formattedCases } = runCompute(
        trialSessionWorkingCopyHelper,
        {
          state: {
            trialSession: {
              ...MOCK_TRIAL_SESSION,
              calendaredCases: [
                {
                  ...MOCK_CASE,
                  docketNumber: '102-19',
                  leadDocketNumber: '90-18',
                  privatePractitioners: [],
                },
                {
                  ...MOCK_CASE,
                  docketNumber: '5000-17',
                  leadDocketNumber: '500-17',
                  privatePractitioners: [{}, {}],
                },
                {
                  ...MOCK_CASE,
                  docketNumber: '500-17',
                  leadDocketNumber: '500-17',
                  privatePractitioners: [{}, {}],
                },
                {
                  ...MOCK_CASE,
                  docketNumber: '90-18',
                  leadDocketNumber: '90-18',
                },
                {
                  ...MOCK_CASE,
                  docketNumber: '101-21',
                  leadDocketNumber: '116-20',
                  privatePractitioners: [],
                },
                {
                  ...MOCK_CASE,
                  docketNumber: '116-20',
                  leadDocketNumber: '116-20',
                  privatePractitioners: [],
                },
                {
                  ...MOCK_CASE,
                  docketNumber: '111-22',
                  leadDocketNumber: '500-17',
                  privatePractitioners: [],
                },
              ],
              caseOrder: [],
            },
            trialSessionWorkingCopy: {
              caseMetadata: {},
              filters: { statusUnassigned: true },
              sort: 'docket',
              sortOrder: 'desc',
              userNotes: {},
            },
          },
        },
      );

      expect(formattedCases).toMatchObject([
        { docketNumber: '116-20' },
        { docketNumber: '90-18' },
        { docketNumber: '500-17' },
      ]);
      expect(formattedCases[0].nestedConsolidatedCases).toMatchObject([
        { docketNumber: '101-21' },
      ]);
      expect(formattedCases[1].nestedConsolidatedCases).toMatchObject([
        { docketNumber: '102-19' },
      ]);
      expect(formattedCases[2].nestedConsolidatedCases).toMatchObject([
        { docketNumber: '5000-17' },
        { docketNumber: '111-22' },
      ]);
      expect(casesShownCount).toEqual(7);
    });
  });
});
