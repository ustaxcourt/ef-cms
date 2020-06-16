import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionsClerkViewsDocketRecordEditLinks = test => {
  return it('Petitions Clerk views the docket record edit links', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    expect(caseDetailFormatted.formattedDocketEntries).toMatchObject([
      { description: 'Petition', editLink: '/review' },
      {
        description: 'Request for Place of Trial at Seattle, Washington',
        editLink: '',
      },
      // externally-filed documents should not be editable by a petitions clerk
      // and editLink should be empty string to go to the document detail page
      {
        description: 'Motion for Leave to File Out of Time Statement Anything',
        editLink: '',
      },
      {
        description:
          'Affidavit of  in Support of Motion for Leave to File Out of Time Statement Anything',
        editLink: '',
      },
      { description: 'Statement Anything', editLink: '' },
      {
        description: 'Declaration of  in Support of Statement Anything',
        editLink: '',
      },
    ]);
  });
};
