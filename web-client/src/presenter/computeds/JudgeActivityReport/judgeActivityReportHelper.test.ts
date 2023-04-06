import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import {
  chambersUser,
  judgeUser,
} from '../../../../../shared/src/test/mockUsers';
import { getJudgesChambers } from '../../../../../shared/src/persistence/dynamo/chambers/getJudgesChambers';
import { judgeActivityReportHelper as judgeActivityReportHelperComputed } from './judgeActivityReportHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../../withAppContext';

describe('judgeActivityReportHelper', () => {
  const judgeActivityReportHelper = withAppContextDecorator(
    judgeActivityReportHelperComputed,
    { ...applicationContext },
  );

  describe('formattedJudgeName', () => {
    it('should be the last name of the current user when they are a judge', () => {
      applicationContext.getCurrentUser.mockReturnValue({
        ...judgeUser,
        judgeFullName: 'Ronald L. Buch',
      });

      const { formattedJudgeName } = runCompute(judgeActivityReportHelper, {});

      expect(formattedJudgeName).toBe('Buch');
    });

    it('should be the last name of the section judge when the current user is a chambers user', () => {
      const colvinsSection =
        getJudgesChambers().COLVINS_CHAMBERS_SECTION.section;
      applicationContext.getCurrentUser.mockReturnValue({
        ...chambersUser,
        section: colvinsSection,
      });

      const { formattedJudgeName } = runCompute(judgeActivityReportHelper, {});

      expect(formattedJudgeName).toBe('Colvin');
    });
  });
});
