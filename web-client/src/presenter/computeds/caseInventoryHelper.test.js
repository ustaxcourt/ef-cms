import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { applicationContext } from '../../applicationContext';
import { caseInventoryHelper as caseInventoryHelperComputed } from './caseInventoryHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const caseInventoryHelper = withAppContextDecorator(
  caseInventoryHelperComputed,
  {
    ...applicationContext,
  },
);

describe('caseInventoryHelper', () => {
  it('should return all case statuses', () => {
    const result = runCompute(caseInventoryHelper);

    expect(result.caseStatuses).toEqual(Case.STATUS_TYPES);
  });

  it('should return all judges from state along with Chief Judge sorted alphabetically', () => {
    const result = runCompute(caseInventoryHelper, {
      state: {
        judges: [
          { name: 'Joseph Dredd' },
          { name: 'Judith Blum' },
          { name: 'Roy Scream' },
        ],
      },
    });

    expect(result.judges).toEqual([
      'Chief Judge',
      'Joseph Dredd',
      'Judith Blum',
      'Roy Scream',
    ]);
  });

  it('should return a result count for filtered cases', () => {
    const result = runCompute(caseInventoryHelper);

    expect(result.resultCount).toEqual(0);
  });
});
