import { applicationContext } from '../../applicationContext';
import { practitionerInformationHelper as practitionerInformationHelperComputed } from './practitionerInformationHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('practitionerInformationHelper', () => {
  const practitionerInformationHelper = withAppContextDecorator(
    practitionerInformationHelperComputed,
    {
      ...applicationContext,
    },
  );

  it('should test return the correct permission from state', () => {
    const { showDocumentationTab } = runCompute(practitionerInformationHelper, {
      state: {
        permissions: {
          UPLOAD_PRACTITIONER_DOCUMENT: true,
        },
      },
    });

    expect(showDocumentationTab).toBe(true);
  });
});
