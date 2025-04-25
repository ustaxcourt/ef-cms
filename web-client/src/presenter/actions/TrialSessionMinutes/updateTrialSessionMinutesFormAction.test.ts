import {
  handleActionsAndFilingsDocType,
  handleActionsAndFilingsFiledBy,
  handleBriefTypeChange,
  handlePetitionerNoAppearance,
  updateTrialSessionMinutesFormAction,
} from './updateTrialSessionMinutesFormAction';
import { mockMinuteSheetFormState } from './mockMinuteSheetFormState';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import {
  ACTION_FILED_BY_OPTIONS,
  ACTION_FILED_BY_OPTIONS_INVERTED,
  BRIEF_TYPE_OPTIONS,
} from '@shared/business/entities/EntityConstants';

jest.mock('uuid', () => ({
  v4: () => '123456',
}));

describe('updateTrialSessionMinutesFormAction', () => {
  let mockStore;
  let renderKey;

  beforeEach(() => {
    mockStore = {
      set: jest.fn(),
      unset: jest.fn(),
    };
    renderKey = '123456';
  });

  describe('handlePetitionerNoAppearance', () => {
    it('should clear petitioners when value is false', () => {
      handlePetitionerNoAppearance({
        store: mockStore,
        value: false,
      });

      expect(mockStore.set).toHaveBeenCalledWith(expect.any(Object), {
        [renderKey]: {
          datesOfAppreance: '',
          name: '',
          renderKey,
        },
      });
    });
  });

  describe('handleActionsAndFilingsDocType', () => {
    it('should unset oralMotion and objection when value is not motion', () => {
      handleActionsAndFilingsDocType({
        name: 'actionsAndFilings',
        rowInfo: { key: renderKey },
        section: 'actionsAndFilingsSection',
        store: mockStore,
        value: 'O',
      });

      expect(mockStore.unset).toHaveBeenCalledTimes(2);
    });

    it('should not unset oralMotion and objection when value is motion', () => {
      handleActionsAndFilingsDocType({
        name: 'actionsAndFilings',
        rowInfo: { key: renderKey },
        section: 'actionsAndFilingsSection',
        store: mockStore,
        value: 'M000',
      });

      expect(mockStore.unset).not.toHaveBeenCalled();
    });
  });

  describe('handleActionsAndFilingsFiledBy', () => {
    it('should reset documentType when filedBy is changed to "court"', () => {
      handleActionsAndFilingsFiledBy({
        name: 'actionsAndFilings',
        rowInfo: { key: renderKey },
        section: 'actionsAndFilingsSection',
        store: mockStore,
        value: ACTION_FILED_BY_OPTIONS_INVERTED[ACTION_FILED_BY_OPTIONS.court],
        previousValue:
          ACTION_FILED_BY_OPTIONS_INVERTED[ACTION_FILED_BY_OPTIONS.petitioner],
      });

      expect(mockStore.set).toHaveBeenCalledWith(expect.any(Object), '');
    });

    it('should reset documentType when filedBy is changed from "court"', () => {
      handleActionsAndFilingsFiledBy({
        name: 'actionsAndFilings',
        rowInfo: { key: renderKey },
        section: 'actionsAndFilingsSection',
        store: mockStore,
        value:
          ACTION_FILED_BY_OPTIONS_INVERTED[ACTION_FILED_BY_OPTIONS.petitioner],
        previousValue:
          ACTION_FILED_BY_OPTIONS_INVERTED[ACTION_FILED_BY_OPTIONS.court],
      });

      expect(mockStore.set).toHaveBeenCalledWith(expect.any(Object), '');
    });

    it('should not reset documentType when filedBy is changed from any option apart from "court" and the previous value was not "court"', () => {
      handleActionsAndFilingsFiledBy({
        name: 'actionsAndFilings',
        rowInfo: { key: renderKey },
        section: 'actionsAndFilingsSection',
        store: mockStore,
        value: ACTION_FILED_BY_OPTIONS_INVERTED[ACTION_FILED_BY_OPTIONS.joint],
        previousValue:
          ACTION_FILED_BY_OPTIONS_INVERTED[ACTION_FILED_BY_OPTIONS.petitioner],
      });

      expect(mockStore.set).not.toHaveBeenCalled();
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
          [renderKey]: {
            datesOfAppreance: '',
            name: '',
            renderKey,
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
          rowInfo: { key: renderKey, nestedName: 'documentType' },
          section: 'actionsAndFilingsSection',
          value: 'O',
        },
        state: {
          minuteSheetForm: {
            ...mockMinuteSheetFormState,
            actionsAndFilingsSection: {
              actionsAndFilings: {
                [renderKey]: {
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
        state.minuteSheetForm.actionsAndFilingsSection.actionsAndFilings[
          renderKey
        ],
      ).toMatchObject({ documentType: 'O' });
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
