import { CONTACT_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { GENERATION_TYPES } from '@web-client/getConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { generateEntryOfAppearancePdfAction } from './generateEntryOfAppearancePdfAction';
import { presenter } from '../../presenter';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('generateEntryOfAppearancePdfAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .generateEntryOfAppearancePdfInteractor.mockReturnValue({
        pdfUrl: 'http://example.com',
      });
  });

  it('should try to generate a pdf and return the url when the generationType is auto', async () => {
    const result = await runAction(generateEntryOfAppearancePdfAction, {
      modules: {
        presenter,
      },
      props: {
        petitioners: [{ contactType: CONTACT_TYPES.primary, name: 'Daphne' }],
      },
      state: {
        caseDetail: {
          caseTitle: 'testing',
          docketNumber: '101-20',
          docketNumberWithSuffix: '101-20S',
          petitioners: [],
        },
        constants: {
          GENERATION_TYPES,
        },
        form: {},
      },
    });

    expect(result.output?.pdfUrl).toEqual('http://example.com');
  });
});
