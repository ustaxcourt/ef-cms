import { GENERATION_TYPES } from '@web-client/getConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { autoGenerateFilingPdfAction } from './autoGenerateFilingPdfAction';
import { presenter } from '../../presenter';
import { runAction } from '@web-client/presenter/test.cerebral';
import { MOCK_CASE } from '@shared/test/mockCase';
import {
  privatePractitionerUser,
  irsPractitionerUser,
} from '@shared/test/mockUsers';
import { SERVICE_INDICATOR_TYPES } from '@shared/business/entities/EntityConstants';
import { cloneDeep } from 'lodash';

type GenerationType = (typeof GENERATION_TYPES)[keyof typeof GENERATION_TYPES];
type UserType = typeof privatePractitionerUser | typeof irsPractitionerUser;

describe('autoGenerateFilingPdfAction', () => {
  const mockInput = {
    modules: {
      presenter,
    },
    state: {
      caseDetail: MOCK_CASE,
      form: {
        generationType: GENERATION_TYPES.AUTO as GenerationType,
        eventCode: 'EA',
        filers: [MOCK_CASE.petitioners[0].contactId],
      },
      user: privatePractitionerUser as UserType,
    },
  };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext
      .getUseCases()
      .generateEntryOfAppearancePdfInteractor.mockResolvedValue({
        url: 'http://example.com',
      });
    applicationContext
      .getUseCases()
      .generateNoticeOfWithdrawalPdfInteractor.mockResolvedValue({
        url: 'http://example.com',
      });
  });

  it('autogenerates entry of appearance pdf', async () => {
    const input = cloneDeep(mockInput);
    input.state.form.eventCode = 'EA';

    const result = await runAction(autoGenerateFilingPdfAction, input);

    expect(
      applicationContext.getUseCases().generateEntryOfAppearancePdfInteractor,
    ).toHaveBeenCalled();
    expect(result.output?.pdfUrl).toEqual('http://example.com');
  });

  it('autogenerates notice of withdrawal pdf', async () => {
    const input = cloneDeep(mockInput);
    input.state.form.eventCode = 'NOTW';

    const result = await runAction(autoGenerateFilingPdfAction, input);

    expect(
      applicationContext.getUseCases().generateNoticeOfWithdrawalPdfInteractor,
    ).toHaveBeenCalled();
    expect(result.output?.pdfUrl).toEqual('http://example.com');
  });

  it('autogenerates notice of withdrawal pdf and sets the certificate of service form fields', async () => {
    const input = cloneDeep(mockInput);
    input.state.caseDetail.petitioners = [
      {
        ...mockInput.state.caseDetail.petitioners[0],
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      },
    ];
    input.state.form.eventCode = 'NOTW';

    const result = await runAction(autoGenerateFilingPdfAction, input);

    expect(result.state.form.certificateOfService).toBe(true);
    expect(result.state.form.certificateOfServiceDate).toBeDefined();
  });

  it('should allow pdf generation if user is a private practitioner', async () => {
    const input = cloneDeep(mockInput);
    input.state.user = privatePractitionerUser;

    await runAction(autoGenerateFilingPdfAction, input);

    expect(
      applicationContext.getUseCases().generateEntryOfAppearancePdfInteractor,
    ).toHaveBeenCalled();
  });

  it('should allow pdf generation if user is an irs practitioner', async () => {
    const input = cloneDeep(mockInput);
    input.state.user = irsPractitionerUser;

    await runAction(autoGenerateFilingPdfAction, input);

    expect(
      applicationContext.getUseCases().generateEntryOfAppearancePdfInteractor,
    ).toHaveBeenCalled();
  });

  it('should not generate a pdf when the generationType is not auto', async () => {
    const input = cloneDeep(mockInput);
    input.state.form.generationType = GENERATION_TYPES.MANUAL;

    const result = await runAction(autoGenerateFilingPdfAction, input);

    expect(
      applicationContext.getUseCases().generateEntryOfAppearancePdfInteractor,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().generateNoticeOfWithdrawalPdfInteractor,
    ).not.toHaveBeenCalled();
    expect(result.output?.pdfUrl).toBeUndefined();
  });
});
