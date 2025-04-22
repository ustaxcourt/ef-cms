/* eslint-disable max-lines */
import {
  EXHIBIT_STATUS_OPTIONS,
  PETITIONER_ROLE_OPTIONS,
  PETITIONER_ROLE_OPTIONS_INVERTED,
  RESPONDENT_ROLE_OPTIONS,
  RESPONDENT_ROLE_OPTIONS_INVERTED,
  RespondentRoleOption,
  STATUS_REPORT_ORDERED_FOR_OPTIONS,
  type BriefTypeOption,
  type MotionFiledByOption,
  type MotionObjectionOption,
  type MotionStatusOption,
  type MotionTypeOption,
  type PetitionerRoleOption,
  type StatusReportOrderedForOption,
  type TrialHearingOption,
} from '@shared/business/entities/EntityConstants';
import {
  MOCK_CASE,
  MOCK_CONSOLIDATED_CASE_SUMMARY,
} from '@shared/test/mockCase';
import {
  formatActionsAndFilings,
  formatCalledSection,
  formatCaseTitle,
  formatExhibits,
  formatJurisdictionContinued,
  formatJurisdictionRetained,
  formatMinuteSheet,
  formatMotions,
  formatPetitionerAppearances,
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
  sanitizeMinuteSheetForm,
} from './formatMinuteSheet';
import {
  MinuteSheet,
  Appearance,
} from '@shared/business/entities/trialSessionMinutes/MinuteSheet';
import { MOCK_TRIAL_REGULAR } from '@shared/test/mockTrial';
import { mockMinuteSheet } from '@shared/test/mockMinuteSheet';

describe('formatMinuteSheet', () => {
  describe('formatMinuteSheet', () => {
    const mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      startDate: '2024-01-01',
      trialLocation: 'Washington, D.C.',
    };

    const mockCase = {
      ...MOCK_CASE,
      consolidatedCases: [MOCK_CONSOLIDATED_CASE_SUMMARY],
    };

    it('should format a minute sheet correctly', () => {
      const result = formatMinuteSheet({
        aCase: mockCase,
        minuteSheet: mockMinuteSheet,
        trialSession: mockTrialSession,
      });

      expect(result).toMatchObject({
        actionsAndFilings: [],
        called: '',
        caseTitle: 'Test Petitioner',
        courtReporter: '',
        docketNumberWithSuffix: '101-18',
        docketNumbers: ['101-18'],
        exhibits: [],
        formattedDocketNumbers: '101-18',
        judgeFullName: '',
        judgeTitle: 'Judge',
        jurisdictionContinued: '',
        jurisdictionRetained: '',
        motions: [],
        notCalled: '',
        petitionerAppearances: [],
        petitionerWitnesses: [],
        pretrialConference: '',
        recalled: [],
        remoteSession: 'No',
        respondentAppearances: [],
        respondentWitnesses: [],
        statusReportOrdered: '',
        stipulatedDecisionOrdered: '',
        trialBrief: {
          benchOpinionRendered: '',
          briefDetails: [],
          briefType: '',
          dateSubmitted: '',
          totalTrialHours: '',
        },
        trialClerk: '',
        trialHearing: '',
        trialLocation: 'Washington, D.C.',
        trialStartDate: 'January 1, 2024',
      });
    });

    it('should handle missing optional fields', () => {
      const result = formatMinuteSheet({
        aCase: MOCK_CASE,
        minuteSheet: mockMinuteSheet,
        trialSession: mockTrialSession,
      });

      expect(result.called).toBe('');
      expect(result.notCalled).toBe('');
      expect(result.pretrialConference).toBe('');
      expect(result.recalled).toEqual([]);
      expect(result.jurisdictionContinued).toBe('');
      expect(result.jurisdictionRetained).toBe('');
    });
  });

  describe('sanitizeMinuteSheetForm', () => {
    it('should encode HTML entities in strings', () => {
      const input = '<script>alert("xss")</script>';
      const result = sanitizeMinuteSheetForm(input);
      expect(result).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
      );
    });

    it('should handle arrays recursively', () => {
      const input = ['<test>', { text: '<p>html</p>' }];
      const result = sanitizeMinuteSheetForm(input);
      expect(result).toEqual([
        '&lt;test&gt;',
        { text: '&lt;p&gt;html&lt;/p&gt;' },
      ]);
    });

    it('should handle objects recursively', () => {
      const input = {
        html: '<div>',
        nested: {
          text: '<span>test</span>',
        },
      };
      const result = sanitizeMinuteSheetForm(input);
      expect(result).toEqual({
        html: '&lt;div&gt;',
        nested: {
          text: '&lt;span&gt;test&lt;/span&gt;',
        },
      });
    });

    it('should return non-string primitives unchanged', () => {
      const input = {
        bool: true,
        num: 42,
        undef: undefined,
        nul: null,
      };
      const result = sanitizeMinuteSheetForm(input);
      expect(result).toEqual(input);
    });
  });

  describe('formatting functions', () => {
    describe('formatRecalledRows', () => {
      it('should return an empty array when passed only empty rows', () => {
        const recalledRows: MinuteSheet['caseRecord']['recalls'] = [];
        const result = formatRecalledRows(recalledRows);
        expect(result).toHaveLength(0);
      });

      it('should properly format an array of differently shaped rows', () => {
        const mockRecalledRows: MinuteSheet['caseRecord']['recalls'] = [
          {
            date: '2022-03-01',
            note: 'This is a note',
            transcriptOrdered: true,
          },
          {
            date: '2022-03-02',
            note: 'This is another note',
            transcriptOrdered: false,
          },
          {
            date: '',
            note: 'This is another note',
            transcriptOrdered: true,
          },
          {
            date: '2022-03-04',
            note: '',
            transcriptOrdered: false,
          },
          {
            date: '',
            note: '',
            transcriptOrdered: true,
          },
          // empty row
          {
            date: '',
            note: '',
            transcriptOrdered: false,
          },
        ];

        const result = formatRecalledRows(mockRecalledRows);

        expect(result.length).toEqual(5); // One fewer since the last row is empty

        expect(result[0]).toEqual({
          content: '2022-03-01; <em>This is a note</em>; Transcript ordered',
        });
        expect(result[1]).toEqual({
          content: '2022-03-02; <em>This is another note</em>',
        });
        expect(result[2]).toEqual({
          content: '<em>This is another note</em>; Transcript ordered',
        });
        expect(result[3]).toEqual({
          content: '2022-03-04',
        });
        expect(result[4]).toEqual({
          content: 'Transcript ordered',
        });
      });
    });

    describe('formatCalledSection', () => {
      it('should format note and transcript ordered when no date is provided', () => {
        const section: MinuteSheet['caseRecord']['calendarCall'] = {
          date: '',
          note: 'some note',
          transcriptOrdered: true,
        };
        const result = formatCalledSection(section);
        expect(result).toBe('<em>some note</em>; Transcript ordered');
      });

      it('should format date only when only date is provided', () => {
        const section = {
          date: '01/15/2023',
          note: '',
          transcriptOrdered: false,
        };
        const result = formatCalledSection(section);
        expect(result).toBe('01/15/2023');
      });

      it('should format date and note when provided', () => {
        const section = {
          date: '01/15/2023',
          note: 'Test note',
          transcriptOrdered: false,
        };
        const result = formatCalledSection(section);
        expect(result).toBe('01/15/2023; <em>Test note</em>');
      });

      it('should format date and transcript ordered when transcript is ordered', () => {
        const section = {
          date: '01/15/2023',
          note: '',
          transcriptOrdered: true,
        };
        const result = formatCalledSection(section);
        expect(result).toBe('01/15/2023; Transcript ordered');
      });

      it('should format all fields when all are provided', () => {
        const section = {
          date: '01/15/2023',
          note: 'Test note',
          transcriptOrdered: true,
        };
        const result = formatCalledSection(section);
        expect(result).toBe(
          '01/15/2023; <em>Test note</em>; Transcript ordered',
        );
      });
    });

    describe('formatPetitionerAppearances', () => {
      it('should return "No appearance" when noAppearance is true', () => {
        const petitionersSection = {
          noAppearance: true,
          appearances: [],
        };
        const result = formatPetitionerAppearances(petitionersSection);
        expect(result).toEqual(['No appearance']);
      });

      it('should format a single petitioner appearance correctly', () => {
        const petitionersSection: MinuteSheet['appearances']['petitioners'] = {
          noAppearance: false,
          appearances: [
            {
              datesOfAppearance: '01/15/2023',
              name: 'John Smith',
              note: '',
              role: 'proSe' as PetitionerRoleOption,
            } as Appearance,
          ],
        };
        const result = formatPetitionerAppearances(petitionersSection);
        expect(result).toEqual([
          `John Smith (${PETITIONER_ROLE_OPTIONS.proSe}) - 01/15/2023`,
        ]);
      });

      it('should format multiple petitioner appearances correctly', () => {
        const petitionersSection = {
          noAppearance: false,
          appearances: [
            {
              datesOfAppearance: '01/15/2023',
              name: 'John Smith',
              note: '',
              role: PETITIONER_ROLE_OPTIONS_INVERTED[
                PETITIONER_ROLE_OPTIONS.proSe
              ],
            },
            {
              datesOfAppearance: '01/16/2023',
              name: 'Jane Doe',
              note: '',
              role: PETITIONER_ROLE_OPTIONS_INVERTED[
                PETITIONER_ROLE_OPTIONS.counsel
              ],
            },
          ] as Appearance[],
        };
        const result = formatPetitionerAppearances(petitionersSection);
        expect(result).toEqual([
          `John Smith (${PETITIONER_ROLE_OPTIONS.proSe}) - 01/15/2023`,
          `Jane Doe (${PETITIONER_ROLE_OPTIONS.counsel}) - 01/16/2023`,
        ]);
      });

      it('should return an empty array when no appearances and noAppearance is false', () => {
        const petitionersSection = {
          noAppearance: false,
          appearances: [],
        };
        const result = formatPetitionerAppearances(petitionersSection);
        expect(result).toEqual([]);
      });

      it('should handle petitioner with missing datesOfAppearance', () => {
        const petitionersSection = {
          noAppearance: false,
          appearances: [
            {
              datesOfAppearance: '',
              name: 'John Smith',
              note: '',
              role: PETITIONER_ROLE_OPTIONS_INVERTED[
                PETITIONER_ROLE_OPTIONS.proSe
              ],
            },
          ] as Appearance[],
        };
        const result = formatPetitionerAppearances(petitionersSection);
        expect(result).toEqual([
          `John Smith (${PETITIONER_ROLE_OPTIONS.proSe})`,
        ]);
      });

      it('should handle petitioner with missing name', () => {
        const petitionersSection = {
          noAppearance: false,
          appearances: [
            {
              datesOfAppearance: '01/15/2023',
              name: '',
              note: '',
              role: PETITIONER_ROLE_OPTIONS_INVERTED[
                PETITIONER_ROLE_OPTIONS.proSe
              ],
            },
          ] as Appearance[],
        };
        const result = formatPetitionerAppearances(petitionersSection);
        expect(result).toEqual([
          `(${PETITIONER_ROLE_OPTIONS.proSe}) - 01/15/2023`,
        ]);
      });

      it('should handle petitioner with missing name and datesOfAppearance', () => {
        const petitionersSection = {
          noAppearance: false,
          appearances: [
            {
              datesOfAppearance: '',
              name: '',
              note: '',
              role: PETITIONER_ROLE_OPTIONS_INVERTED[
                PETITIONER_ROLE_OPTIONS.proSe
              ],
            },
          ] as Appearance[],
        };
        const result = formatPetitionerAppearances(petitionersSection);
        expect(result).toEqual([`(${PETITIONER_ROLE_OPTIONS.proSe})`]);
      });

      it('should handle completely empty petitioner appearance', () => {
        const petitionersSection = {
          noAppearance: false,
          appearances: [
            {
              datesOfAppearance: '',
              name: '',
              note: '',
              role: '' as PetitionerRoleOption,
            },
          ] as Appearance[],
        };
        const result = formatPetitionerAppearances(petitionersSection);
        expect(result).toEqual([]);
      });

      it('should display the note after role when note is provided', () => {
        const mockNote = 'Big Wig';
        const petitionersSection = {
          noAppearance: false,
          appearances: [
            {
              datesOfAppearance: '',
              name: '',
              note: mockNote,
              role: PETITIONER_ROLE_OPTIONS_INVERTED[
                PETITIONER_ROLE_OPTIONS.other
              ],
            },
          ] as Appearance[],
        };
        const result = formatPetitionerAppearances(petitionersSection);
        expect(result).toEqual([
          `(${PETITIONER_ROLE_OPTIONS.other} - <em>${mockNote}</em>)`,
        ]);
      });

      it('should not display the note after role when no note is provided', () => {
        const petitionersSection = {
          noAppearance: false,
          appearances: [
            {
              datesOfAppearance: '',
              name: '',
              note: '',
              role: PETITIONER_ROLE_OPTIONS_INVERTED[
                PETITIONER_ROLE_OPTIONS.other
              ],
            },
          ] as Appearance[],
        };
        const result = formatPetitionerAppearances(petitionersSection);
        expect(result).toEqual([`(${PETITIONER_ROLE_OPTIONS.other})`]);
      });
    });

    describe('formatRespondentAppearances', () => {
      it('should format a single respondent appearance correctly', () => {
        const respondentsSection: MinuteSheet['appearances']['respondents'] = [
          {
            datesOfAppearance: '01/15/2023',
            name: 'John Smith',
            note: 'This is a note',
            role: RESPONDENT_ROLE_OPTIONS_INVERTED[
              RESPONDENT_ROLE_OPTIONS.counsel
            ] as RespondentRoleOption,
          },
        ];
        const result = formatRespondentAppearances(respondentsSection);
        expect(result).toEqual([
          'John Smith (Counsel - <em>This is a note</em>) - 01/15/2023',
        ]);
      });

      it('should format multiple respondent appearances correctly', () => {
        const respondentsSection: MinuteSheet['appearances']['respondents'] = [
          {
            datesOfAppearance: '01/15/2023',
            name: 'John Smith',
            note: 'This is a note',
            role: RESPONDENT_ROLE_OPTIONS_INVERTED[
              RESPONDENT_ROLE_OPTIONS.counsel
            ] as RespondentRoleOption,
          },
          {
            datesOfAppearance: '01/16/2023',
            name: 'Jane Doe',
            note: 'This is a second note',
            role: RESPONDENT_ROLE_OPTIONS_INVERTED[
              RESPONDENT_ROLE_OPTIONS.counsel
            ] as RespondentRoleOption,
          },
        ];
        const result = formatRespondentAppearances(respondentsSection);
        expect(result).toEqual([
          'John Smith (Counsel - <em>This is a note</em>) - 01/15/2023',
          'Jane Doe (Counsel - <em>This is a second note</em>) - 01/16/2023',
        ]);
      });

      it('should return an empty array when no respondents', () => {
        const respondentsSection = [];
        const result = formatRespondentAppearances(respondentsSection);
        expect(result).toEqual([]);
      });

      it('should handle respondent with missing datesOfAppearance', () => {
        const respondentsSection: MinuteSheet['appearances']['respondents'] = [
          {
            datesOfAppearance: '',
            name: 'John Smith',
            note: 'This is a note',
            role: RESPONDENT_ROLE_OPTIONS_INVERTED[
              RESPONDENT_ROLE_OPTIONS.counsel
            ] as RespondentRoleOption,
          },
        ];
        const result = formatRespondentAppearances(respondentsSection);
        expect(result).toEqual([
          'John Smith (Counsel - <em>This is a note</em>)',
        ]);
      });

      it('should handle respondent with missing name', () => {
        const respondentsSection: MinuteSheet['appearances']['respondents'] = [
          {
            datesOfAppearance: '01/15/2023',
            name: '',
            note: 'This is a note',
            role: RESPONDENT_ROLE_OPTIONS_INVERTED[
              RESPONDENT_ROLE_OPTIONS.counsel
            ] as RespondentRoleOption,
          },
        ];
        const result = formatRespondentAppearances(respondentsSection);
        expect(result).toEqual([
          '(Counsel - <em>This is a note</em>) - 01/15/2023',
        ]);
      });

      it('should handle respondent with missing name and datesOfAppearance', () => {
        const respondentsSection: MinuteSheet['appearances']['respondents'] = [
          {
            datesOfAppearance: '',
            name: '',
            note: 'This is a note',
            role: RESPONDENT_ROLE_OPTIONS_INVERTED[
              RESPONDENT_ROLE_OPTIONS.counsel
            ] as RespondentRoleOption,
          },
        ];
        const result = formatRespondentAppearances(respondentsSection);
        expect(result).toEqual(['(Counsel - <em>This is a note</em>)']);
      });

      it('should handle respondent with no note', () => {
        const respondentsSection: MinuteSheet['appearances']['respondents'] = [
          {
            datesOfAppearance: '01/15/2023',
            name: 'John Smith',
            note: '',
            role: RESPONDENT_ROLE_OPTIONS_INVERTED[
              RESPONDENT_ROLE_OPTIONS.counsel
            ] as RespondentRoleOption,
          },
        ];
        const result = formatRespondentAppearances(respondentsSection);
        expect(result).toEqual(['John Smith (Counsel) - 01/15/2023']);
      });

      it('should still display note when role is not selected', () => {
        const respondentsSection: MinuteSheet['appearances']['respondents'] = [
          {
            datesOfAppearance: '01/15/2023',
            name: 'John Smith',
            note: 'This is a note.',
            role: '' as RespondentRoleOption,
          },
        ];
        const result = formatRespondentAppearances(respondentsSection);
        expect(result).toEqual([
          'John Smith (<em>This is a note.</em>) - 01/15/2023',
        ]);
      });
    });

    describe('formatJurisdictionRetained', () => {
      it('should return undefined when no date is provided', () => {
        const section: MinuteSheet['jurisdiction']['retained'] = {
          date: '',
          note: 'test note',
        };
        const result = formatJurisdictionRetained(section);
        expect(result).toBe('');
      });

      it('should format jurisdiction retained without continued status', () => {
        const section: MinuteSheet['jurisdiction']['retained'] = {
          date: '01/15/2023',
          note: 'test note',
        };
        const result = formatJurisdictionRetained(section);
        expect(result).toBe('01/15/2023; <em>test note</em>');
      });

      it('should handle empty note', () => {
        const section: MinuteSheet['jurisdiction']['retained'] = {
          date: '01/15/2023',
          note: '',
        };
        const result = formatJurisdictionRetained(section);
        expect(result).toBe('01/15/2023');
      });
    });

    describe('formatStatusReportOrdered', () => {
      it('should format with all fields present', () => {
        const section: MinuteSheet['orders']['statusReport'] = {
          date: '01/15/2023',
          dueDate: '02/15/2023',
          note: 'test note',
          orderedFor: 'joint' as StatusReportOrderedForOption,
        };
        const result = formatStatusReportOrdered(section);
        expect(result).toBe(
          '01/15/2023; Ordered for Joint; Due 02/15/2023; <em>test note</em>',
        );
      });

      it('should format without optional fields', () => {
        const section: MinuteSheet['orders']['statusReport'] = {
          date: '01/15/2023',
          dueDate: '',
          note: '',
          orderedFor: '' as StatusReportOrderedForOption,
        };
        const result = formatStatusReportOrdered(section);
        expect(result).toBe('01/15/2023');
      });

      it('should handle all status report ordered for options', () => {
        Object.entries(STATUS_REPORT_ORDERED_FOR_OPTIONS).forEach(
          ([key, value]) => {
            const section = {
              date: '01/15/2023',
              dueDate: '',
              note: '',
              orderedFor: key as StatusReportOrderedForOption,
            };
            const result = formatStatusReportOrdered(section);
            expect(result).toBe(`01/15/2023; Ordered for ${value}`);
          },
        );
      });

      it('should handle a minute sheet associated with a case that has not had a status report ordered yet', () => {
        const result = formatStatusReportOrdered(null as any);
        expect(result).toBe('');
      });
    });

    describe('formatStipulatedDecision', () => {
      it('should format with all fields present', () => {
        const section: MinuteSheet['orders']['stipulatedDecision'] = {
          date: '01/15/2023',
          dueDate: '02/15/2023',
          note: 'test note',
        };
        const result = formatStipulatedDecision(section);
        expect(result).toBe('01/15/2023; Due 02/15/2023; <em>test note</em>');
      });

      it('should format with only required fields', () => {
        const section = {
          date: '01/15/2023',
          dueDate: '',
          note: '',
        };
        const result = formatStipulatedDecision(section);
        expect(result).toBe('01/15/2023');
      });

      it('should handle a minute sheet associated with a case that has not had a stipulated decision ordered yet', () => {
        const result = formatStipulatedDecision(null as any);
        expect(result).toBe('');
      });
    });

    describe('formatMotions', () => {
      it('should return empty array when no motions', () => {
        const motionsSection: MinuteSheet['proceedings']['motions'] = [];
        const result = formatMotions(motionsSection);
        expect(result).toEqual([]);
      });

      it('should format a single motion correctly', () => {
        const motionsSection: MinuteSheet['proceedings']['motions'] = [
          {
            date: '01/15/2023',
            type: 'motionToDismiss' as MotionTypeOption,
            filedBy: 'petitioner' as MotionFiledByOption,
            status: 'granted' as MotionStatusOption,
            objection: '' as MotionObjectionOption,
            note: 'test note',
            oralMotion: false,
          },
        ];
        const result = formatMotions(motionsSection);
        expect(result).toEqual([
          {
            content:
              'Motion to Dismiss; 01/15/2023; Filed by Petitioner; GRANTED; <em>test note</em>',
            motionType: 'Motion to Dismiss',
          },
        ]);
      });

      it('should format an oral motion correctly', () => {
        const motionsSection: MinuteSheet['proceedings']['motions'] = [
          {
            date: '01/15/2023',
            filedBy: 'petitioner' as MotionFiledByOption,
            note: 'test note',
            objection: '' as MotionObjectionOption,
            oralMotion: true,
            status: 'granted' as MotionStatusOption,
            type: 'motionToDismiss' as MotionTypeOption,
          },
        ];
        const result = formatMotions(motionsSection);
        expect(result).toEqual([
          {
            content:
              'Oral Motion to Dismiss; 01/15/2023; Filed by Petitioner; GRANTED; <em>test note</em>',
            motionType: 'Motion to Dismiss',
          },
        ]);
      });

      it('should format a motion with an "unknown" objection correctly', () => {
        const motionsSection: MinuteSheet['proceedings']['motions'] = [
          {
            date: '01/15/2023',
            filedBy: 'petitioner' as MotionFiledByOption,
            note: 'test note',
            objection: 'unknown',
            oralMotion: true,
            status: 'granted' as MotionStatusOption,
            type: 'motionToDismiss' as MotionTypeOption,
          },
        ];
        const result = formatMotions(motionsSection);
        expect(result).toEqual([
          {
            content:
              'Oral Motion to Dismiss; 01/15/2023; Filed by Petitioner; GRANTED; Obj. Unknown; <em>test note</em>',
            motionType: 'Motion to Dismiss',
          },
        ]);
      });

      it('should format a motion with an objection correctly', () => {
        const motionsSection: MinuteSheet['proceedings']['motions'] = [
          {
            date: '01/15/2023',
            filedBy: 'petitioner' as MotionFiledByOption,
            note: 'test note',
            objection: 'objection',
            oralMotion: true,
            status: 'granted' as MotionStatusOption,
            type: 'motionToDismiss' as MotionTypeOption,
          },
        ];
        const result = formatMotions(motionsSection);
        expect(result).toEqual([
          {
            content:
              'Oral Motion to Dismiss; 01/15/2023; Filed by Petitioner; GRANTED; Objection; <em>test note</em>',
            motionType: 'Motion to Dismiss',
          },
        ]);
      });

      it('should filter out motions without required fields', () => {
        const motionsSection: MinuteSheet['proceedings']['motions'] = [
          {
            date: '01/15/2023',
            filedBy: '' as MotionFiledByOption,
            note: '',
            objection: '' as MotionObjectionOption,
            oralMotion: false,
            status: '' as MotionStatusOption,
            type: '' as MotionTypeOption,
          },
        ];
        const result = formatMotions(motionsSection);
        expect(result).toEqual([]);
      });
    });

    describe('formatActionsAndFilings', () => {
      it('should return empty array when no actions', () => {
        const actionsSection: MinuteSheet['proceedings']['actionsAndFilings'] =
          [];
        const result = formatActionsAndFilings(actionsSection);
        expect(result).toEqual([]);
      });

      it('should format a single action correctly', () => {
        const actionsSection: MinuteSheet['proceedings']['actionsAndFilings'] =
          [
            {
              date: '01/15/2023',
              documentType: 'filing',
              filedBy: 'petitioner',
              status: 'filed',
              note: 'test note',
              isOnDocketRecord: true,
              oralMotion: false,
            },
          ];
        const result = formatActionsAndFilings(actionsSection);
        expect(result).toEqual([
          {
            content:
              '01/15/2023; Filing - <em>test note</em>; Filed by Petitioner; FILED',
          },
        ]);
      });

      it('should format action without note correctly', () => {
        const actionsSection: MinuteSheet['proceedings']['actionsAndFilings'] =
          [
            {
              date: '01/15/2023',
              documentType: 'filing',
              filedBy: 'petitioner',
              status: 'filed',
              note: '',
              isOnDocketRecord: true,
              oralMotion: false,
            },
          ];
        const result = formatActionsAndFilings(actionsSection);
        expect(result).toEqual([
          {
            content: '01/15/2023; Filing; Filed by Petitioner; FILED',
          },
        ]);
      });

      it('should filter out actions without required fields', () => {
        const actionsSection: MinuteSheet['proceedings']['actionsAndFilings'] =
          [
            {
              date: '',
              documentType: '',
              filedBy: '',
              status: '',
              note: '',
              isOnDocketRecord: false,
              oralMotion: false,
            },
          ];
        const result = formatActionsAndFilings(actionsSection);
        expect(result).toEqual([]);
      });

      it('should format an oral motion correctly', () => {
        const actionsSection: MinuteSheet['proceedings']['actionsAndFilings'] =
          [
            {
              date: '01/15/2023',
              documentType: 'motion',
              filedBy: 'petitioner',
              status: 'filed',
              note: 'test note',
              isOnDocketRecord: true,
              oralMotion: true,
            },
          ];
        const result = formatActionsAndFilings(actionsSection);
        expect(result).toEqual([
          {
            content:
              '01/15/2023; Motion - Oral Motion <em>test note</em>; Filed by Petitioner; FILED',
          },
        ]);
      });

      it('should format an objection correctly', () => {
        const actionsSection: MinuteSheet['proceedings']['actionsAndFilings'] =
          [
            {
              date: '01/15/2023',
              documentType: 'motion',
              filedBy: 'petitioner',
              status: 'granted',
              note: 'test note',
              isOnDocketRecord: true,
              oralMotion: false,
              objection: 'noObjection' as MotionObjectionOption,
            },
          ];
        const result = formatActionsAndFilings(actionsSection);
        expect(result).toEqual([
          {
            content:
              '01/15/2023; Motion - <em>test note</em>; Filed by Petitioner; GRANTED; No Objection',
          },
        ]);
      });

      it('should format an unknown objection correctly', () => {
        const actionsSection: MinuteSheet['proceedings']['actionsAndFilings'] =
          [
            {
              date: '01/15/2023',
              documentType: 'motion',
              filedBy: 'petitioner',
              status: 'denied',
              note: 'test note',
              isOnDocketRecord: true,
              oralMotion: false,
              objection: 'unknown' as MotionObjectionOption,
            },
          ];
        const result = formatActionsAndFilings(actionsSection);
        expect(result).toEqual([
          {
            content:
              '01/15/2023; Motion - <em>test note</em>; Filed by Petitioner; DENIED; Obj. Unknown',
          },
        ]);
      });
    });

    describe('formatTrialBrief', () => {
      it('should format with all fields present', () => {
        const section: MinuteSheet['brief'] = {
          type: 'seriatimBrief' as BriefTypeOption,
          details: {
            opening: {
              dueDate: '02/15/2023',
              note: 'Opening brief note',
              partyType: 'petitioner',
            },
          },
          dateSubmitted: '01/01/2023',
          hoursOfTrial: 5,
          benchOpinionDate: '01/15/2023',
          transcriptOrdered: true,
          note: 'bench opinion note',
        };
        const result = formatTrialBrief(section);
        expect(result).toEqual({
          benchOpinionRendered: '01/15/2023; Transcript ordered',
          briefDetails: [
            'Opening - petitioner; Due 02/15/2023; <em>Opening brief note</em>',
          ],
          briefType: 'seriatimBrief',
          dateSubmitted: '01/01/2023',
          totalTrialHours: '5',
          note: '<em>bench opinion note</em>',
        });
      });

      it('should handle empty optional fields', () => {
        const section: MinuteSheet['brief'] = {
          type: '' as BriefTypeOption,
          details: {},
          dateSubmitted: '',
          hoursOfTrial: 0,
          benchOpinionDate: '',
          transcriptOrdered: false,
          note: '',
        };
        const result = formatTrialBrief(section);
        expect(result).toEqual({
          benchOpinionRendered: '',
          briefDetails: [],
          briefType: '',
          dateSubmitted: '',
          totalTrialHours: '',
          note: '',
        });
      });

      it('should format benchOpinionRendered correctly when all fields are present', () => {
        const section: MinuteSheet['brief'] = {
          type: '' as BriefTypeOption,
          details: {},
          dateSubmitted: '',
          hoursOfTrial: 0,
          benchOpinionDate: '01/15/2023',
          transcriptOrdered: true,
          note: 'bench opinion note',
        };
        const result = formatTrialBrief(section);
        expect(result.benchOpinionRendered).toBe(
          '01/15/2023; Transcript ordered',
        );
      });

      it('should format benchOpinionRendered correctly when only date is present', () => {
        const section: MinuteSheet['brief'] = {
          type: '' as BriefTypeOption,
          details: {},
          dateSubmitted: '',
          hoursOfTrial: 0,
          benchOpinionDate: '01/15/2023',
          transcriptOrdered: false,
          note: '',
        };
        const result = formatTrialBrief(section);
        expect(result.benchOpinionRendered).toBe('01/15/2023');
      });

      it('should format benchOpinionRendered correctly when only transcriptOrdered is present', () => {
        const section: MinuteSheet['brief'] = {
          type: '' as BriefTypeOption,
          details: {},
          dateSubmitted: '',
          hoursOfTrial: 0,
          benchOpinionDate: '',
          transcriptOrdered: true,
          note: '',
        };
        const result = formatTrialBrief(section);
        expect(result.benchOpinionRendered).toBe('Transcript ordered');
      });

      it('should format benchOpinionRendered correctly when no fields are present', () => {
        const section: MinuteSheet['brief'] = {
          type: '' as BriefTypeOption,
          details: {},
          dateSubmitted: '',
          hoursOfTrial: 0,
          benchOpinionDate: '',
          transcriptOrdered: false,
          note: '',
        };
        const result = formatTrialBrief(section);
        expect(result.benchOpinionRendered).toBe('');
      });
    });

    describe('formatPretrialConference', () => {
      it('should format with all fields present', () => {
        const section: MinuteSheet['caseRecord']['pretrialConference'] = {
          date: '01/15/2023',
          note: 'test note',
          transcriptOrdered: true,
        };
        const result = formatPretrialConference(section);
        expect(result).toBe(
          '01/15/2023; <em>test note</em>; Transcript ordered',
        );
      });

      it('should handle empty optional fields', () => {
        const section: MinuteSheet['caseRecord']['pretrialConference'] = {
          date: '01/15/2023',
          note: '',
          transcriptOrdered: false,
        };
        const result = formatPretrialConference(section);
        expect(result).toBe('01/15/2023');
      });

      it('should return empty string when no date', () => {
        const section: MinuteSheet['caseRecord']['pretrialConference'] = {
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
        const section: MinuteSheet['caseRecord']['trialHearing'] = {
          date: '01/15/2023',
          note: 'test note',
          transcriptOrdered: true,
          trialHearingType: 'trial' as TrialHearingOption,
        };
        const result = formatTrialHearing(section);
        expect(result).toBe(
          '01/15/2023; Trial; <em>test note</em>; Transcript ordered',
        );
      });

      it('should handle empty optional fields', () => {
        const section: MinuteSheet['caseRecord']['trialHearing'] = {
          date: '01/15/2023',
          note: '',
          transcriptOrdered: false,
          trialHearingType: undefined,
        };
        const result = formatTrialHearing(section);
        expect(result).toBe('01/15/2023');
      });
    });

    describe('formatExhibits', () => {
      it('should return empty array when no exhibits', () => {
        const section: MinuteSheet['evidence']['exhibits'] = [];
        const result = formatExhibits(section);
        expect(result).toEqual([]);
      });

      it('should format exhibits correctly', () => {
        const section: MinuteSheet['evidence']['exhibits'] = [
          {
            description: 'Exhibit A',
            note: 'test note',
            status: 'admitted',
          },
          {
            description: 'Exhibit B',
            note: '',
            status: 'withdrawn',
          },
        ];
        const result = formatExhibits(section);
        expect(result).toEqual([
          {
            description: 'Exhibit A',
            note: 'test note',
            status: 'Admitted',
          },
          {
            description: 'Exhibit B',
            note: '',
            status: 'Withdrawn',
          },
        ]);
      });

      it('should filter out empty exhibits', () => {
        const section: MinuteSheet['evidence']['exhibits'] = [
          {
            description: '',
            note: '',
            status: '' as keyof typeof EXHIBIT_STATUS_OPTIONS,
          },
        ];
        const result = formatExhibits(section);
        expect(result).toEqual([]);
      });
    });

    describe('getBriefDetails', () => {
      it('should format seriatim brief details', () => {
        const briefDetails: MinuteSheet['brief']['details'] = {
          opening: {
            dueDate: '02/15/2023',
            note: 'Opening note',
            partyType: 'petitioner',
          },
          reply: {
            dueDate: '03/15/2023',
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

      it('should handle brief details with missing optional fields', () => {
        const briefDetails: MinuteSheet['brief']['details'] = {
          opening: {
            dueDate: '02/15/2023',
            note: '',
            partyType: '',
          },
        };
        const result = getBriefDetails(briefDetails);
        expect(result).toEqual(['Opening - Due 02/15/2023']);
      });

      it('should handle brief details with only note', () => {
        const briefDetails: MinuteSheet['brief']['details'] = {
          opening: {
            dueDate: '',
            note: 'Only note',
            partyType: '',
          },
        };
        const result = getBriefDetails(briefDetails);
        expect(result).toEqual(['Opening - <em>Only note</em>']);
      });

      it('should handle brief details with only partyType', () => {
        const briefDetails: MinuteSheet['brief']['details'] = {
          opening: {
            dueDate: '',
            note: '',
            partyType: 'petitioner',
          },
        };
        const result = getBriefDetails(briefDetails);
        expect(result).toEqual(['Opening - petitioner']);
      });

      it('should handle brief details with all fields empty', () => {
        const briefDetails: MinuteSheet['brief']['details'] = {
          opening: {
            dueDate: '',
            note: '',
            partyType: '',
          },
        };
        const result = getBriefDetails(briefDetails);
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
        const witnessSection: MinuteSheet['evidence']['petitionerWitnesses'] = [
          { name: 'John Doe' },
          { name: '' },
          { name: 'Jane Smith' },
        ];
        const result = formatWitnesses(witnessSection);
        expect(result).toEqual([{ name: 'John Doe' }, { name: 'Jane Smith' }]);
      });

      it('should return empty array when no witnesses have names', () => {
        const witnessSection: MinuteSheet['evidence']['petitionerWitnesses'] = [
          { name: '' },
          { name: '' },
        ];
        const result = formatWitnesses(witnessSection);
        expect(result).toEqual([]);
      });

      it('should return empty array when witness section is empty', () => {
        const witnessSection: MinuteSheet['evidence']['petitionerWitnesses'] =
          [];
        const result = formatWitnesses(witnessSection);
        expect(result).toEqual([]);
      });

      it('should format witnesses correctly', () => {
        const witnessSection: MinuteSheet['evidence']['petitionerWitnesses'] = [
          { name: 'John Doe' },
          { name: 'Jane Smith' },
        ];
        const result = formatWitnesses(witnessSection);
        expect(result).toEqual([{ name: 'John Doe' }, { name: 'Jane Smith' }]);
      });
    });

    describe('formatCaseTitle', () => {
      it('should format the case title', () => {
        const result = formatCaseTitle(MOCK_CASE);
        expect(result).toBe('Test Petitioner');
      });

      it('should format the case title for a lead case', () => {
        const testCase = {
          ...MOCK_CASE,
          leadDocketNumber: MOCK_CASE.docketNumber,
        };
        const result = formatCaseTitle(testCase);
        expect(result).toBe('Test Petitioner, et al.');
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

    describe('formatJurisdictionContinued', () => {
      it('should return undefined when no date is provided', () => {
        const section: MinuteSheet['jurisdiction']['continued'] = {
          date: '',
          note: 'test note',
        };
        const result = formatJurisdictionContinued(section);
        expect(result).toBe('');
      });

      it('should format jurisdiction continued with date and note', () => {
        const section: MinuteSheet['jurisdiction']['continued'] = {
          date: '01/15/2023',
          note: 'test note',
        };
        const result = formatJurisdictionContinued(section);
        expect(result).toBe('01/15/2023; <em>test note</em>');
      });

      it('should format jurisdiction continued with date only', () => {
        const section: MinuteSheet['jurisdiction']['continued'] = {
          date: '01/15/2023',
          note: '',
        };
        const result = formatJurisdictionContinued(section);
        expect(result).toBe('01/15/2023');
      });
    });
  });
});
