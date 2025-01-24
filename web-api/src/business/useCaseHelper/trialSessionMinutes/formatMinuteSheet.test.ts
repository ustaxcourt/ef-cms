/* eslint-disable max-lines */
import {
  ACTION_DOCUMENT_TYPE_OPTIONS,
  ACTION_FILED_BY_OPTIONS,
  ACTION_STATUS_OPTIONS,
  BRIEF_TYPE_OPTIONS,
  EXHIBIT_STATUS_OPTIONS,
  MOTION_FILED_BY_OPTIONS,
  MOTION_OBJECTION_OPTIONS,
  MOTION_STATUS_OPTIONS,
  MOTION_TYPE_OPTIONS,
  MinuteSheetFormState,
  STATUS_REPORT_ORDERED_FOR_OPTIONS,
  TRIAL_HEARING_OPTIONS,
} from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import {
  MOCK_CASE,
  MOCK_CONSOLIDATED_CASE_SUMMARY,
} from '@shared/test/mockCase';
import {
  formatActionsAndFilings,
  formatCalledSection,
  formatExhibits,
  formatJurisdictionRetained,
  formatMotions,
  formatPetitionerAppearances,
  formatPetitioners,
  formatPretrialConference,
  formatRecalledRows,
  formatRemoteSession,
  formatRespondentAppearances,
  formatStatusReportOrdered,
  formatStipulatedDecision,
  formatTrialBrief,
  formatTrialHearing,
  formatWitnesses,
  getBriefDetails,
  getConsolidatedDocketNumbers,
} from './formatMinuteSheet';

describe('formatMinuteSheet', () => {
  describe('formatRecalledRows', () => {
    it('should return an empty array if passed only empty rows', () => {
      const recalledRows = {
        '1': {
          date: '',
          note: '',
          renderKey: '1',
          transcriptOrdered: false,
        },
      };
      const result = formatRecalledRows(recalledRows);
      expect(result).toHaveLength(0);
    });

    it('should properly format an array of differently shaped rows', () => {
      const mockRecalledRows = {
        '1': {
          date: '2022-03-01',
          note: 'This is a note',
          renderKey: '1',
          transcriptOrdered: true,
        },
        '2': {
          date: '2022-03-02',
          note: 'This is another note',
          renderKey: '2',
          transcriptOrdered: false,
        },
        '3': {
          date: '',
          note: 'This is another note',
          renderKey: '3',
          transcriptOrdered: true,
        },
        '4': {
          date: '2022-03-04',
          note: '',
          renderKey: '4',
          transcriptOrdered: false,
        },
        '5': {
          date: '',
          note: '',
          renderKey: '5',
          transcriptOrdered: true,
        },
        // empty row
        '6': {
          date: '',
          note: '',
          renderKey: '6',
          transcriptOrdered: false,
        },
      };

      const result = formatRecalledRows(mockRecalledRows);

      // Expecting 1 fewer since the last row is empty
      expect(result.length).toEqual(Object.values(mockRecalledRows).length - 1);

      expect(result[0]).toEqual({
        content: '2022-03-01; <em>This is a note</em>; Transcript ordered',
        renderKey: '1',
      });
      expect(result[1]).toEqual({
        content: '2022-03-02; <em>This is another note</em>',
        renderKey: '2',
      });
      expect(result[2]).toEqual({
        content: '<em>This is another note</em>; Transcript ordered',
        renderKey: '3',
      });
      expect(result[3]).toEqual({
        content: '2022-03-04',
        renderKey: '4',
      });
      expect(result[4]).toEqual({
        content: 'Transcript ordered',
        renderKey: '5',
      });
    });
  });

  describe('formatCalledSection', () => {
    it('should format note and transcript ordered when no date is provided', () => {
      const section = {
        date: '',
        note: 'some note',
        transcriptOrdered: true,
      };
      const result = formatCalledSection(section);
      expect(result).toBe('<em>some note</em>; Transcript ordered');
    });

    it('should format date only when only date is provided', () => {
      const section = {
        date: '2023-01-15',
        note: '',
        transcriptOrdered: false,
      };
      const result = formatCalledSection(section);
      expect(result).toBe('01/15/2023');
    });

    it('should format date and note when provided', () => {
      const section = {
        date: '2023-01-15',
        note: 'Test note',
        transcriptOrdered: false,
      };
      const result = formatCalledSection(section);
      expect(result).toBe('01/15/2023; <em>Test note</em>');
    });

    it('should format date and transcript ordered when transcript is ordered', () => {
      const section = {
        date: '2023-01-15',
        note: '',
        transcriptOrdered: true,
      };
      const result = formatCalledSection(section);
      expect(result).toBe('01/15/2023; Transcript ordered');
    });

    it('should format all fields when all are provided', () => {
      const section = {
        date: '2023-01-15',
        note: 'Test note',
        transcriptOrdered: true,
      };
      const result = formatCalledSection(section);
      expect(result).toBe('01/15/2023; <em>Test note</em>; Transcript ordered');
    });
  });

  describe('formatPetitionerAppearances', () => {
    it('should return "No appearance" when noAppearance is true', () => {
      const petitionersSection = {
        noAppearance: true,
        petitioners: {},
      };
      const result = formatPetitionerAppearances(petitionersSection);
      expect(result).toEqual(['No appearance']);
    });

    it('should format a single petitioner appearance correctly', () => {
      const petitionersSection = {
        noAppearance: false,
        petitioners: {
          '1': {
            datesOfAppearance: '01/15/2023',
            name: 'John Smith',
            renderKey: '1',
            role: 'Petitioner',
          },
        },
      };
      const result = formatPetitionerAppearances(petitionersSection);
      expect(result).toEqual(['John Smith (Petitioner) - 01/15/2023']);
    });

    it('should format multiple petitioner appearances correctly', () => {
      const petitionersSection = {
        noAppearance: false,
        petitioners: {
          '1': {
            datesOfAppearance: '01/15/2023',
            name: 'John Smith',
            renderKey: '1',
            role: 'Petitioner',
          },
          '2': {
            datesOfAppearance: '01/16/2023',
            name: 'Jane Doe',
            renderKey: '2',
            role: 'Counsel',
          },
        },
      };
      const result = formatPetitionerAppearances(petitionersSection);
      expect(result).toEqual([
        'John Smith (Petitioner) - 01/15/2023',
        'Jane Doe (Counsel) - 01/16/2023',
      ]);
    });

    it('should return an empty array when no petitioners and noAppearance is false', () => {
      const petitionersSection = {
        noAppearance: false,
        petitioners: {},
      };
      const result = formatPetitionerAppearances(petitionersSection);
      expect(result).toEqual([]);
    });
  });

  describe('formatRespondentAppearances', () => {
    it('should format a single respondent appearance correctly', () => {
      const respondentsSection = {
        respondents: {
          '1': {
            datesOfAppearance: '01/15/2023',
            name: 'John Smith',
            renderKey: '1',
          },
        },
      };
      const result = formatRespondentAppearances(respondentsSection);
      expect(result).toEqual(['John Smith - 01/15/2023']);
    });

    it('should format multiple respondent appearances correctly', () => {
      const respondentsSection = {
        respondents: {
          '1': {
            datesOfAppearance: '01/15/2023',
            name: 'John Smith',
            renderKey: '1',
          },
          '2': {
            datesOfAppearance: '01/16/2023',
            name: 'Jane Doe',
            renderKey: '2',
          },
        },
      };
      const result = formatRespondentAppearances(respondentsSection);
      expect(result).toEqual([
        'John Smith - 01/15/2023',
        'Jane Doe - 01/16/2023',
      ]);
    });

    it('should return an empty array when no respondents', () => {
      const respondentsSection = {
        respondents: {},
      };
      const result = formatRespondentAppearances(respondentsSection);
      expect(result).toEqual([]);
    });
  });

  describe('formatJurisdictionRetained', () => {
    it('should return undefined when no date is provided', () => {
      const section = {
        continued: false,
        date: '',
        note: 'test note',
      };
      const result = formatJurisdictionRetained(section);
      expect(result).toBeUndefined();
    });

    it('should format jurisdiction retained with continued status', () => {
      const section = {
        continued: true,
        date: '2023-01-15',
        note: 'test note',
      };
      const result = formatJurisdictionRetained(section);
      expect(result).toBe('Continued - 01/15/2023; <em>test note</em>');
    });

    it('should format jurisdiction retained without continued status', () => {
      const section = {
        continued: false,
        date: '2023-01-15',
        note: 'test note',
      };
      const result = formatJurisdictionRetained(section);
      expect(result).toBe('01/15/2023; <em>test note</em>');
    });

    it('should handle empty note', () => {
      const section = {
        continued: true,
        date: '2023-01-15',
        note: '',
      };
      const result = formatJurisdictionRetained(section);
      expect(result).toBe('Continued - 01/15/2023');
    });
  });

  describe('formatStatusReportOrdered', () => {
    it('should format with all fields present', () => {
      const section = {
        date: '2023-01-15',
        dueDate: '2023-02-15',
        note: 'test note',
        orderedFor: 'joint',
      } as MinuteSheetFormState['ordersSection']['statusReportOrdered'];
      const result = formatStatusReportOrdered(section);
      expect(result).toBe(
        '01/15/2023; Ordered for Joint; Due 02/15/2023; <em>test note</em>',
      );
    });

    it('should format without optional fields', () => {
      const section = {
        date: '2023-01-15',
        dueDate: '',
        note: '',
        orderedFor: '',
      } as MinuteSheetFormState['ordersSection']['statusReportOrdered'];
      const result = formatStatusReportOrdered(section);
      expect(result).toBe('01/15/2023');
    });

    it('should handle all status report ordered for options', () => {
      Object.entries(STATUS_REPORT_ORDERED_FOR_OPTIONS).forEach(
        ([key, value]) => {
          const section = {
            date: '2023-01-15',
            dueDate: '',
            note: '',
            orderedFor: key,
          } as MinuteSheetFormState['ordersSection']['statusReportOrdered'];
          const result = formatStatusReportOrdered(section);
          expect(result).toBe(`01/15/2023; Ordered for ${value}`);
        },
      );
    });
  });

  describe('formatStipulatedDecision', () => {
    it('should format with all fields present', () => {
      const section = {
        date: '2023-01-15',
        dueDate: '2023-02-15',
        note: 'test note',
      };
      const result = formatStipulatedDecision(section);
      expect(result).toBe('01/15/2023; Due 02/15/2023; <em>test note</em>');
    });

    it('should format with only required fields', () => {
      const section = {
        date: '2023-01-15',
        dueDate: '',
        note: '',
      };
      const result = formatStipulatedDecision(section);
      expect(result).toBe('01/15/2023');
    });
  });

  describe('formatMotions', () => {
    it('should return empty array when no motions', () => {
      const motionsSection = {
        motions: {},
      };
      const result = formatMotions(motionsSection);
      expect(result).toEqual([]);
    });

    it('should format a single motion correctly', () => {
      const motionsSection = {
        motions: {
          '1': {
            date: '2023-01-15',
            filedBy: 'petitioner' as keyof typeof MOTION_FILED_BY_OPTIONS,
            note: 'test note',
            objection: '' as keyof typeof MOTION_OBJECTION_OPTIONS,
            oralMotion: false,
            renderKey: '1',
            status: 'granted' as keyof typeof MOTION_STATUS_OPTIONS,
            type: 'motionToDismiss' as keyof typeof MOTION_TYPE_OPTIONS,
          },
        },
      };
      const result = formatMotions(motionsSection);
      expect(result).toEqual([
        {
          content:
            'Motion to Dismiss; 01/15/2023; Filed by Petitioner; Granted; <em>test note</em>',
          motionType: 'Motion to Dismiss',
          renderKey: '1',
        },
      ]);
    });

    it('should format an oral motion correctly', () => {
      const motionsSection = {
        motions: {
          '1': {
            date: '2023-01-15',
            filedBy: 'petitioner' as keyof typeof MOTION_FILED_BY_OPTIONS,
            note: 'test note',
            objection: '' as keyof typeof MOTION_OBJECTION_OPTIONS,
            oralMotion: true,
            renderKey: '1',
            status: 'granted' as keyof typeof MOTION_STATUS_OPTIONS,
            type: 'motionToDismiss' as keyof typeof MOTION_TYPE_OPTIONS,
          },
        },
      };
      const result = formatMotions(motionsSection);
      expect(result).toEqual([
        {
          content:
            'Oral Motion to Dismiss; 01/15/2023; Filed by Petitioner; Granted; <em>test note</em>',
          motionType: 'Motion to Dismiss',
          renderKey: '1',
        },
      ]);
    });

    it('should filter out motions without required fields', () => {
      const motionsSection = {
        motions: {
          '1': {
            date: '2023-01-15',
            filedBy: '' as keyof typeof MOTION_FILED_BY_OPTIONS,
            note: '',
            objection: '' as keyof typeof MOTION_OBJECTION_OPTIONS,
            oralMotion: false,
            renderKey: '1',
            status: '' as keyof typeof MOTION_STATUS_OPTIONS,
            type: '' as keyof typeof MOTION_TYPE_OPTIONS,
          },
        },
      };
      const result = formatMotions(motionsSection);
      expect(result).toEqual([]);
    });
  });

  describe('formatActionsAndFilings', () => {
    it('should return empty array when no actions', () => {
      const section = {
        actionsAndFilings: {},
      };
      const result = formatActionsAndFilings(section);
      expect(result).toEqual([]);
    });

    it('should format a single action correctly', () => {
      const section = {
        actionsAndFilings: {
          '1': {
            date: '2023-01-15',
            documentType: 'filing' as keyof typeof ACTION_DOCUMENT_TYPE_OPTIONS,
            filedBy: 'petitioner' as keyof typeof ACTION_FILED_BY_OPTIONS,
            isOnDocketRecord: true,
            note: 'test note',
            objection: '',
            renderKey: '1',
            status: 'filed' as keyof typeof ACTION_STATUS_OPTIONS,
          },
        },
      };
      const result = formatActionsAndFilings(section);
      expect(result).toEqual([
        {
          content: '01/15/2023; Filing - <em>test note</em>; Petitioner; Filed',
          renderKey: '1',
        },
      ]);
    });

    it('should format action without note correctly', () => {
      const section = {
        actionsAndFilings: {
          '1': {
            date: '2023-01-15',
            documentType: 'filing',
            filedBy: 'petitioner',
            isOnDocketRecord: true,
            note: '',
            renderKey: '1',
            status: 'filed',
          },
        },
      } as MinuteSheetFormState['actionsAndFilingsSection'];
      const result = formatActionsAndFilings(section);
      expect(result).toEqual([
        {
          content: '01/15/2023; Filing; Petitioner; Filed',
          renderKey: '1',
        },
      ]);
    });

    it('should filter out actions without required fields', () => {
      const section = {
        actionsAndFilings: {
          '1': {
            date: '',
            documentType: '',
            filedBy: '',
            isOnDocketRecord: false,
            note: '',
            renderKey: '1',
            status: '',
          },
        },
      } as MinuteSheetFormState['actionsAndFilingsSection'];
      const result = formatActionsAndFilings(section);
      expect(result).toEqual([]);
    });
  });

  describe('formatTrialBrief', () => {
    it('should format with all fields present', () => {
      const section = {
        briefDetails: {
          opening: {
            dueDate: '2023-02-15',
            note: 'Opening brief note',
            partyType: 'petitioner',
          },
        },
        briefType: 'seriatimBrief' as keyof typeof BRIEF_TYPE_OPTIONS,
        dateBenchOpinionRendered: '2023-01-15',
        dateSubmitted: '2023-01-01',
        note: 'bench opinion note',
        totalTrialHours: 5,
        transcriptOrdered: true,
      };
      const result = formatTrialBrief(section);
      expect(result).toEqual({
        benchOpinionRendered:
          '01/15/2023; Transcript ordered; <em>bench opinion note</em>',
        briefDetails: [
          'Opening - petitioner; Due 02/15/2023; <em>Opening brief note</em>',
        ],
        briefType: 'seriatimBrief',
        dateSubmitted: '01/01/2023',
        totalTrialHours: '5',
      });
    });

    it('should handle empty optional fields', () => {
      const section = {
        briefDetails: {},
        briefType: '',
        dateBenchOpinionRendered: '',
        dateSubmitted: '',
        note: '',
        totalTrialHours: 0,
        transcriptOrdered: false,
      };
      const result = formatTrialBrief(section);
      expect(result).toEqual({
        benchOpinionRendered: '',
        briefDetails: [],
        briefType: '',
        dateSubmitted: '',
        totalTrialHours: '',
      });
    });
  });

  describe('formatPretrialConference', () => {
    it('should format with all fields present', () => {
      const section = {
        date: '2023-01-15',
        note: 'test note',
        transcriptOrdered: true,
      };
      const result = formatPretrialConference(section);
      expect(result).toBe('2023-01-15; <em>test note</em>; Transcript ordered');
    });

    it('should handle empty optional fields', () => {
      const section = {
        date: '2023-01-15',
        note: '',
        transcriptOrdered: false,
      };
      const result = formatPretrialConference(section);
      expect(result).toBe('2023-01-15');
    });

    it('should return empty string when no date', () => {
      const section = {
        date: '',
        note: 'test note',
        transcriptOrdered: true,
      };
      const result = formatPretrialConference(section);
      expect(result).toBe('<em>test note</em>; Transcript ordered');
    });
  });

  describe('formatTrialHearing', () => {
    it('should format with all fields present', () => {
      const section = {
        date: '2023-01-15',
        note: 'test note',
        transcriptOrdered: true,
        trialHearingType: 'trial' as keyof typeof TRIAL_HEARING_OPTIONS,
      };
      const result = formatTrialHearing(section);
      expect(result).toBe(
        '2023-01-15; Trial; <em>test note</em>; Transcript ordered',
      );
    });

    it('should handle empty optional fields', () => {
      const section = {
        date: '2023-01-15',
        note: '',
        transcriptOrdered: false,
        trialHearingType: undefined,
      };
      const result = formatTrialHearing(section);
      expect(result).toBe('2023-01-15');
    });
  });

  describe('formatExhibits', () => {
    it('should return empty array when no exhibits', () => {
      const section = {
        exhibits: {},
      };
      const result = formatExhibits(section);
      expect(result).toEqual([]);
    });

    it('should format exhibits correctly', () => {
      const section = {
        exhibits: {
          '1': {
            description: 'Exhibit A',
            note: 'test note',
            renderKey: '1',
            status: 'admitted' as keyof typeof EXHIBIT_STATUS_OPTIONS,
          },
          '2': {
            description: 'Exhibit B',
            note: '',
            renderKey: '2',
            status: 'withdrawn' as keyof typeof EXHIBIT_STATUS_OPTIONS,
          },
        },
      };
      const result = formatExhibits(section);
      expect(result).toEqual([
        {
          description: 'Exhibit A',
          note: 'test note',
          renderKey: '1',
          status: 'Admitted',
        },
        {
          description: 'Exhibit B',
          note: '',
          renderKey: '2',
          status: 'Withdrawn',
        },
      ]);
    });

    it('should filter out empty exhibits', () => {
      const section = {
        exhibits: {
          '1': {
            description: '',
            note: '',
            renderKey: '1',
            status: '' as keyof typeof EXHIBIT_STATUS_OPTIONS,
          },
        },
      };
      const result = formatExhibits(section);
      expect(result).toEqual([]);
    });
  });

  describe('getBriefDetails', () => {
    it('should format seriatim brief details', () => {
      const briefDetails = {
        opening: {
          dueDate: '2023-02-15',
          note: 'Opening note',
          partyType: 'petitioner',
        },
        reply: {
          dueDate: '2023-03-15',
          note: 'Reply note',
          partyType: 'respondent',
        },
      };
      const result = getBriefDetails(briefDetails);
      expect(result).toEqual([
        'Opening - petitioner; Due 02/15/2023; <em>Opening note</em>',
        'Reply - respondent; Due 03/15/2023; <em>Reply note</em>',
      ]);
    });

    it('should handle empty brief details', () => {
      const result = getBriefDetails({});
      expect(result).toEqual([]);
    });
  });

  describe('getConsolidatedDocketNumbers', () => {
    it('should return single docket number when no consolidated cases', () => {
      const aCase = {
        ...MOCK_CASE,
        consolidatedCases: [],
        docketNumber: '123-45',
      };
      const result = getConsolidatedDocketNumbers(aCase);
      expect(result).toBe('123-45');
    });

    it('should format consolidated docket numbers', () => {
      const aCase = {
        ...MOCK_CASE,
        consolidatedCases: [
          { ...MOCK_CONSOLIDATED_CASE_SUMMARY, docketNumber: '123-45' },
          { ...MOCK_CONSOLIDATED_CASE_SUMMARY, docketNumber: '234-56' },
        ],
        docketNumber: '123-45',
      };
      const result = getConsolidatedDocketNumbers(aCase);
      expect(result).toBe('123-45, 234-56');
    });
  });

  describe('formatWitnesses', () => {
    it('should filter out witnesses without names', () => {
      const witnessSection = {
        '1': { name: 'John Doe', renderKey: '1' },
        '2': { name: '', renderKey: '2' },
        '3': { name: 'Jane Smith', renderKey: '3' },
      };
      const result = formatWitnesses(witnessSection);
      expect(result).toEqual([
        { name: 'John Doe', renderKey: '1' },
        { name: 'Jane Smith', renderKey: '3' },
      ]);
    });

    it('should return empty array when no witnesses have names', () => {
      const witnessSection = {
        '1': { name: '', renderKey: '1' },
        '2': { name: '', renderKey: '2' },
      };
      const result = formatWitnesses(witnessSection);
      expect(result).toEqual([]);
    });

    it('should return empty array when witness section is empty', () => {
      const witnessSection = {};
      const result = formatWitnesses(witnessSection);
      expect(result).toEqual([]);
    });
  });

  describe('formatPetitioners', () => {
    const mockPetitioner1: TPetitioner = {
      address1: '123 Main St',
      city: 'Somewhere',
      contactId: '1234-5678',
      contactType: 'primary',
      countryType: 'domestic',
      entityName: '',
      isAddressSealed: false,
      name: 'John Doe',
      phone: '123-456-7890',
      postalCode: '12345',
      sealedAndUnavailable: false,
      state: 'CA',
    };

    const mockPetitioner2: TPetitioner = {
      address1: '456 Oak Ave',
      city: 'Elsewhere',
      contactId: '8765-4321',
      contactType: 'primary',
      countryType: 'domestic',
      entityName: '',
      isAddressSealed: false,
      name: 'Jane Smith',
      phone: '098-765-4321',
      postalCode: '54321',
      sealedAndUnavailable: false,
      state: 'NY',
    };

    it('should join multiple petitioner names with commas', () => {
      const testCase = {
        ...MOCK_CASE,
        petitioners: [mockPetitioner1, mockPetitioner2],
      };
      const result = formatPetitioners(testCase);
      expect(result).toBe('John Doe, Jane Smith');
    });

    it('should return single petitioner name without comma', () => {
      const testCase = {
        ...MOCK_CASE,
        petitioners: [mockPetitioner1],
      };
      const result = formatPetitioners(testCase);
      expect(result).toBe('John Doe');
    });

    it('should return empty string when no petitioners', () => {
      const testCase = {
        ...MOCK_CASE,
        petitioners: [],
      };
      const result = formatPetitioners(testCase);
      expect(result).toBe('');
    });
  });

  describe('formatRemoteSession', () => {
    it('should return "Yes" when remote session is true', () => {
      const result = formatRemoteSession(true);
      expect(result).toBe('Yes');
    });

    it('should return "No" when remote session is false', () => {
      const result = formatRemoteSession(false);
      expect(result).toBe('No');
    });
  });
});
