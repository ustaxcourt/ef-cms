import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { toggleEditCaseTrialInfoMenuAction } from './toggleEditCaseTrialInfoMenuAction';

describe('toggleEditCaseTrialInfoMenuAction', () => {
  const mockMenuName = 'A Menu for 2';

  it('Unsets state.navigation.editCaseTrialInfoMenu when it matches the value of props.editCaseTrialInfoMenu', async () => {
    const result = await runAction(toggleEditCaseTrialInfoMenuAction, {
      modules: {
        presenter,
      },
      props: {
        editCaseTrialInfoMenu: mockMenuName,
      },
      state: {
        navigation: {
          editCaseTrialInfoMenu: mockMenuName,
        },
      },
    });
    expect(result.state.navigation.editCaseTrialInfoMenu).not.toBeDefined();
  });

  it('Sets state.navigation.editCaseTrialInfoMenu to props.editCaseTrialInfoMenu when state.navigation.editCaseTrialInfoMenu is undefined', async () => {
    const result = await runAction(toggleEditCaseTrialInfoMenuAction, {
      modules: {
        presenter,
      },
      props: {
        editCaseTrialInfoMenu: mockMenuName,
      },
      state: {
        navigation: {},
      },
    });
    expect(result.state.navigation.editCaseTrialInfoMenu).toEqual(mockMenuName);
  });
});
