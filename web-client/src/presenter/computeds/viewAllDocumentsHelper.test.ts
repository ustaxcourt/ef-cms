import { applicationContext } from '../../applicationContext';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { viewAllDocumentsHelper as viewAllDocumentsHelperComputed } from './viewAllDocumentsHelper';
import { withAppContextDecorator } from '../../withAppContext';

const viewAllDocumentsHelper = withAppContextDecorator(
  viewAllDocumentsHelperComputed,
  applicationContext,
);

describe('viewAllDocumentsHelper', () => {
  it('returns all document categories, document types, reasons, and sections', () => {
    const result = runCompute(viewAllDocumentsHelper, {
      state: {},
    });

    expect(result.categoryMap).toBeTruthy();
    expect(result.documentTypesForSelect).toBeTruthy();
    expect(result.documentTypesForSelectSorted).toBeTruthy();
    expect(result.reasons).toBeTruthy();
    expect(result.sections).toBeTruthy();
  });

  it("doesn't return any categories when looking for a secondary document", () => {
    const result = runCompute(viewAllDocumentsHelper, {
      state: {
        modal: {
          forSecondary: false,
        },
      },
    });

    expect(
      result.categoryMap.Motion.some(
        motion => motion.scenario === 'Nonstandard H',
      ),
    ).toEqual(true);
  });
});
