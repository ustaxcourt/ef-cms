import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import {
  docketClerkUser,
  irsSuperuserUser,
} from '../../../../../shared/src/test/mockUsers';
import { generateNoticeOfDocketChangePdf } from './generateNoticeOfDocketChangePdf';

describe('generateNoticeOfDocketChangePdf', () => {
  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);
  });

  it('should throw an error when the user does not have permission to generate a notice of docket change', async () => {
    applicationContext.getCurrentUser.mockReturnValue(irsSuperuserUser); // IRS Superuser does not have this permission

    await expect(
      generateNoticeOfDocketChangePdf({
        applicationContext,
        docketChangeInfo: {
          caseCaptionExtension:
            'Bert & Ernie, Petitioners v. Commissioner of Internal Revenue, Respondent',
          caseTitle: 'Bert & Ernie',
          docketEntryIndex: '3',
          docketNumber: '123-19X',
          filingParties: { after: 'Cody', before: 'Joe' },
          filingsAndProceedings: { after: 'Sausage', before: 'Pepperoni' },
          nameOfClerk: 'Barney',
          titleOfClerk: 'Clerk Sr.',
        },
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should call the document generator to create the Notice of Docket Change PDF', async () => {
    applicationContext.getUniqueId.mockReturnValue('uniqueId');

    const result = await generateNoticeOfDocketChangePdf({
      applicationContext,
      docketChangeInfo: {
        caseCaptionExtension:
          'Bert & Ernie, Petitioners v. Commissioner of Internal Revenue, Respondent',
        caseTitle: 'Bert & Ernie',
        docketEntryIndex: '3',
        docketNumber: '123-19X',
        filingParties: { after: 'Cody', before: 'Joe' },
        filingsAndProceedings: { after: 'Sausage', before: 'Pepperoni' },
        nameOfClerk: 'Barney',
        titleOfClerk: 'Clerk Sr.',
      },
    });

    expect(
      applicationContext.getDocumentGenerators().noticeOfDocketChange,
    ).toHaveBeenCalled();
    expect(result).toEqual('uniqueId');
  });
});
