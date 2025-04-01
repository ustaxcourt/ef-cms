import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { mockMinuteSheetFormState } from './mockMinuteSheetFormState';
import { presenter } from '../../presenter-mock';
import { removeMinuteSheetFormRowAction } from './removeMinuteSheetFormRowAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('removeMinuteSheetFormRowAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should remove a row from petitioners section when specified', async () => {
    const renderKey = 'test-key';
    const mockState = {
      minuteSheetForm: {
        ...mockMinuteSheetFormState,
        petitionersSection: {
          petitioners: {
            [renderKey]: { name: 'Test Petitioner' },
          },
        },
      },
    };

    const result = await runAction(removeMinuteSheetFormRowAction, {
      modules: {
        presenter,
      },
      props: {
        key: renderKey,
        name: 'petitioners',
        section: 'petitionersSection',
      },
      state: mockState,
    });

    expect(
      result.state.minuteSheetForm.petitionersSection.petitioners[renderKey],
    ).toBeUndefined();
  });

  it('should remove a row from respondents section when specified', async () => {
    const renderKey = 'test-key';
    const mockState = {
      minuteSheetForm: {
        ...mockMinuteSheetFormState,
        respondentsSection: {
          respondents: {
            [renderKey]: { name: 'Test Respondent' },
          },
        },
      },
    };

    const result = await runAction(removeMinuteSheetFormRowAction, {
      modules: {
        presenter,
      },
      props: {
        key: renderKey,
        name: 'respondents',
        section: 'respondentsSection',
      },
      state: mockState,
    });

    expect(
      result.state.minuteSheetForm.respondentsSection.respondents[renderKey],
    ).toBeUndefined();
  });

  it('should remove a row from motions section when specified', async () => {
    const renderKey = 'test-key';
    const mockState = {
      minuteSheetForm: {
        ...mockMinuteSheetFormState,
        motionsSection: {
          motions: {
            [renderKey]: { type: 'Test Motion' },
          },
        },
      },
    };

    const result = await runAction(removeMinuteSheetFormRowAction, {
      modules: {
        presenter,
      },
      props: {
        key: renderKey,
        name: 'motions',
        section: 'motionsSection',
      },
      state: mockState,
    });

    expect(
      result.state.minuteSheetForm.motionsSection.motions[renderKey],
    ).toBeUndefined();
  });

  it('should remove a row from exhibits section when specified', async () => {
    const renderKey = 'test-key';
    const mockState = {
      minuteSheetForm: {
        ...mockMinuteSheetFormState,
        exhibitsSection: {
          exhibits: {
            [renderKey]: { description: 'Test Exhibit' },
          },
        },
      },
    };

    const result = await runAction(removeMinuteSheetFormRowAction, {
      modules: {
        presenter,
      },
      props: {
        key: renderKey,
        name: 'exhibits',
        section: 'exhibitsSection',
      },
      state: mockState,
    });

    expect(
      result.state.minuteSheetForm.exhibitsSection.exhibits[renderKey],
    ).toBeUndefined();
  });

  it('should remove a row from actions and filings section when specified', async () => {
    const renderKey = 'test-key';
    const mockState = {
      minuteSheetForm: {
        ...mockMinuteSheetFormState,
        actionsAndFilingsSection: {
          actionsAndFilings: {
            [renderKey]: { type: 'Test Action' },
          },
        },
      },
    };

    const result = await runAction(removeMinuteSheetFormRowAction, {
      modules: {
        presenter,
      },
      props: {
        key: renderKey,
        name: 'actionsAndFilings',
        section: 'actionsAndFilingsSection',
      },
      state: mockState,
    });

    expect(
      result.state.minuteSheetForm.actionsAndFilingsSection.actionsAndFilings[
        renderKey
      ],
    ).toBeUndefined();
  });

  it('should remove a row from petitioner witnesses section when specified', async () => {
    const renderKey = 'test-key';
    const mockState = {
      minuteSheetForm: {
        ...mockMinuteSheetFormState,
        witnessesSection: {
          petitionerWitnesses: {
            [renderKey]: { name: 'Test Witness' },
          },
        },
      },
    };

    const result = await runAction(removeMinuteSheetFormRowAction, {
      modules: {
        presenter,
      },
      props: {
        key: renderKey,
        name: 'petitionerWitnesses',
        section: 'witnessesSection',
      },
      state: mockState,
    });

    expect(
      result.state.minuteSheetForm.witnessesSection.petitionerWitnesses[
        renderKey
      ],
    ).toBeUndefined();
  });

  it('should remove a row from recalled section when specified', async () => {
    const renderKey = 'test-key';
    const mockState = {
      minuteSheetForm: {
        ...mockMinuteSheetFormState,
        caseMetadataSection: {
          recalled: {
            [renderKey]: { date: '2023-01-01' },
          },
        },
      },
    };

    const result = await runAction(removeMinuteSheetFormRowAction, {
      modules: {
        presenter,
      },
      props: {
        key: renderKey,
        name: 'recalled',
        section: 'caseMetadataSection',
      },
      state: mockState,
    });

    expect(
      result.state.minuteSheetForm.caseMetadataSection.recalled[renderKey],
    ).toBeUndefined();
  });
});
