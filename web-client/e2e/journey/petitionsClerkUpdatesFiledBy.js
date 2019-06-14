import { runCompute } from 'cerebral/test';

import { caseDetailHelper } from '../../src/presenter/computeds/caseDetailHelper';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { withAppContextDecorator } from '../../src/withAppContext';

export default (test, overrides = {}) => {
  return it('Petitions clerk updates filed by', async () => {
    expect(test.getState('caseDetailErrors')).toEqual({});

    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'receivedAtMonth',
      value: overrides.receivedAtMonth,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'receivedAtDay',
      value: overrides.receivedAtDay,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'receivedAtYear',
      value: overrides.receivedAtYear,
    });

    await test.runSequence('autoSaveCaseSequence');

    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('caseDetail.receivedAt')).toEqual(
      `${overrides.receivedAtYear}-${overrides.receivedAtMonth}-${overrides.receivedAtDay}T00:00:00.000Z`,
    );
  });
};
