import {
  handleActionsAndFilingsDocType,
  handleBriefTypeChange,
  handlePetitionerNoAppearance,
  updateFormValue,
  updateTrialSessionMinutesFormAction,
} from './updateTrialSessionMinutesFormAction';
import { mockMinuteSheetFormState } from './mockMinuteSheetFormState';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { BRIEF_TYPE_OPTIONS } from '@shared/business/entities/EntityConstants';

jest.mock('uuid', () => ({
  v4: () => 'test-uuid-1234',
}));

describe('updateTrialSessionMinutesFormAction', () => {
  let mockStore;

  beforeEach(() => {
    mockStore = {
      set: jest.fn(),
      unset: jest.fn(),
    };
  });

  describe('updateFormValue', () => {
    it('should update nested value when nestedName and key are provided', () => {
      updateFormValue({
        name: 'fieldName',
        rowInfo: { key: '123', nestedName: 'nested' },
        section: 'testSection',
        store: mockStore,
        value: 'test',
      });

      expect(mockStore.set).toHaveBeenCalledWith(expect.any(Object), 'test');
    });
  });

  describe('handlePetitionerNoAppearance', () => {
    it('should clear petitioners when value is false', () => {
      handlePetitionerNoAppearance({
        store: mockStore,
        value: false,
      });

      expect(mockStore.set).toHaveBeenCalledWith(expect.any(Object), {
        'test-uuid-1234': {
          datesOfAppreance: '',
          name: '',
          renderKey: 'test-uuid-1234',
        },
      });
    });
  });

  describe('handleActionsAndFilingsDocType', () => {
    it('should unset oralMotion and objection when value is not motion', () => {
      handleActionsAndFilingsDocType({
        name: 'actionsAndFilings',
        rowInfo: { key: '123' },
        section: 'actionsAndFilingsSection',
        store: mockStore,
        value: 'order',
      });

      expect(mockStore.unset).toHaveBeenCalledTimes(2);
      expect(mockStore.set).toHaveBeenCalledWith(expect.any(Object), 'court');
    });
  });

  describe('handleBriefTypeChange', () => {
    it('should set correct brief details for seriatim brief', () => {
      handleBriefTypeChange({
        store: mockStore,
        value: BRIEF_TYPE_OPTIONS.seriatimBrief,
      });

      expect(mockStore.set).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          answering: expect.any(Object),
          opening: expect.any(Object),
          reply: expect.any(Object),
          surReply: expect.any(Object),
        }),
      );
    });
  });

  describe('updateTrialSessionMinutesFormAction', () => {
    it('should update basic form value', async () => {
      const { state } = await runAction(updateTrialSessionMinutesFormAction, {
        modules: {
          presenter,
        },
        props: {
          name: 'judge',
          section: 'trialSessionMetadataSection',
          value: { fullName: 'Judge Smith', title: 'Judge', userId: '123' },
        },
        state: {
          minuteSheetForm: mockMinuteSheetFormState,
        },
      });

      expect(state.minuteSheetForm.trialSessionMetadataSection.judge).toEqual({
        fullName: 'Judge Smith',
        title: 'Judge',
        userId: '123',
      });
    });

    it('should handle petitioner no appearance updates', async () => {
      const { state } = await runAction(updateTrialSessionMinutesFormAction, {
        modules: {
          presenter,
        },
        props: {
          name: 'noAppearance',
          section: 'petitionersSection',
          value: false,
        },
        state: {
          minuteSheetForm: mockMinuteSheetFormState,
        },
      });

      expect(state.minuteSheetForm.petitionersSection).toEqual({
        noAppearance: false,
        petitioners: {
          'test-uuid-1234': {
            datesOfAppreance: '',
            name: '',
            renderKey: 'test-uuid-1234',
          },
        },
      });
    });

    it('should handle actions and filings document type updates', async () => {
      const { state } = await runAction(updateTrialSessionMinutesFormAction, {
        modules: {
          presenter,
        },
        props: {
          name: 'actionsAndFilings',
          rowInfo: { key: '123', nestedName: 'documentType' },
          section: 'actionsAndFilingsSection',
          value: 'order',
        },
        state: {
          minuteSheetForm: {
            ...mockMinuteSheetFormState,
            actionsAndFilingsSection: {
              actionsAndFilings: {
                '123': {
                  documentType: '',
                  filedBy: '',
                  objection: true,
                  oralMotion: true,
                },
              },
            },
          },
        },
      });

      expect(
        state.minuteSheetForm.actionsAndFilingsSection.actionsAndFilings['123'],
      ).toEqual({
        documentType: 'order',
        filedBy: 'court',
      });
    });

    it('should handle brief type changes', async () => {
      const { state } = await runAction(updateTrialSessionMinutesFormAction, {
        modules: {
          presenter,
        },
        props: {
          name: 'briefType',
          section: 'trialBriefSection',
          value: BRIEF_TYPE_OPTIONS.seriatimBrief,
        },
        state: {
          minuteSheetForm: mockMinuteSheetFormState,
        },
      });

      expect(
        state.minuteSheetForm.trialBriefSection.briefDetails,
      ).toMatchObject({
        answering: expect.any(Object),
        opening: expect.any(Object),
        reply: expect.any(Object),
        surReply: expect.any(Object),
      });
    });
  });
});
