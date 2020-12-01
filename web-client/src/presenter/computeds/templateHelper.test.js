import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { runCompute } from 'cerebral/test';
import { templateHelper as templateHelperComputed } from './templateHelper';
import { withAppContextDecorator } from '../../withAppContext';

const templateHelper = withAppContextDecorator(
  templateHelperComputed,
  applicationContext,
);

describe('templateHelper', () => {
  let initialState;
  const defaultShowBetaBarState = true;

  beforeAll(() => {
    initialState = {
      state: {
        header: {
          showBetaBar: defaultShowBetaBarState, // set the default state
        },
      },
    };
  });

  describe('feature 7142 enabled', () => {
    beforeAll(() => {
      applicationContext.setMockedCodeToggles(7142, true);
    });

    it('returns showBetaBar false if the current stage is prod', () => {
      applicationContext.getEnvironment.mockReturnValue({
        stage: 'prod',
      });
      const result = runCompute(templateHelper, initialState);
      expect(result.showBetaBar).toBeFalsy();
    });

    it('returns the initial/default showBetaBar state if the current stage is not prod', () => {
      applicationContext.getEnvironment.mockReturnValue({
        stage: 'local',
      });
      const result = runCompute(templateHelper, initialState);
      expect(result.showBetaBar).toEqual(defaultShowBetaBarState);
    });

    it('returns showDeployedDate false if the current stage is prod', () => {
      applicationContext.getEnvironment.mockReturnValue({
        stage: 'prod',
      });
      const result = runCompute(templateHelper, initialState);
      expect(result.showDeployedDate).toBeFalsy();
    });

    it('returns showDeployedDate true if the current stage is not prod', () => {
      applicationContext.getEnvironment.mockReturnValue({
        stage: 'local',
      });
      const result = runCompute(templateHelper, initialState);
      expect(result.showDeployedDate).toBeTruthy();
    });
  });

  describe('feature 7142 disabled', () => {
    beforeAll(() => {
      applicationContext.setMockedCodeToggles(7142, false);
    });

    it('returns the initial/default showBetaBar state if the current stage is prod', () => {
      applicationContext.getEnvironment.mockReturnValue({
        stage: 'prod',
      });
      const result = runCompute(templateHelper, initialState);
      expect(result.showBetaBar).toEqual(defaultShowBetaBarState);
    });

    it('returns the initial/default showBetaBar state if the current stage is not prod', () => {
      applicationContext.getEnvironment.mockReturnValue({
        stage: 'local',
      });
      const result = runCompute(templateHelper, initialState);
      expect(result.showBetaBar).toEqual(defaultShowBetaBarState);
    });

    it('returns showDeployedDate true if the current stage is prod', () => {
      applicationContext.getEnvironment.mockReturnValue({
        stage: 'prod',
      });
      const result = runCompute(templateHelper, initialState);
      expect(result.showDeployedDate).toBeTruthy();
    });

    it('returns showDeployedDate true if the current stage is not prod', () => {
      applicationContext.getEnvironment.mockReturnValue({
        stage: 'local',
      });
      const result = runCompute(templateHelper, initialState);
      expect(result.showDeployedDate).toBeTruthy();
    });
  });
});
