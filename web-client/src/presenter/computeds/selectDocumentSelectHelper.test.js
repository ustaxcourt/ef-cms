import { applicationContext } from '../../applicationContext';
import { runCompute } from 'cerebral/test';
import { selectDocumentSelectHelper as selectDocumentSelectHelperComputed } from './selectDocumentSelectHelper';
import { withAppContextDecorator } from '../../withAppContext';

const selectDocumentSelectHelper = withAppContextDecorator(
  selectDocumentSelectHelperComputed,
  applicationContext,
);

describe('selectDocumentSelectHelper', () => {
  it('returns documentTypes for select components (regular and sorted)', () => {
    const result = runCompute(selectDocumentSelectHelper, {
      state: {},
    });

    expect(result.documentTypesForSelect).toBeTruthy();
    expect(result.documentTypesForSelectSorted).toBeTruthy();
  });
});
