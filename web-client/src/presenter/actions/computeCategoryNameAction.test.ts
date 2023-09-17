import { PRACTITIONER_DOCUMENT_TYPES_MAP } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { computeCategoryNameAction } from './computeCategoryNameAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('computeCategoryNameAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set the categoryName to match the categoryType when NOT a good standing type', async () => {
    const result = await runAction(computeCategoryNameAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          categoryType: PRACTITIONER_DOCUMENT_TYPES_MAP.APPLICATION,
        },
      },
    });

    expect(result.state.form.categoryName).toEqual(
      PRACTITIONER_DOCUMENT_TYPES_MAP.APPLICATION,
    );
  });

  it('should set the categoryName and append the location to the name when categoryType when is a good standing type', async () => {
    const expectedLocation = 'Texas';

    const result = await runAction(computeCategoryNameAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          categoryType:
            PRACTITIONER_DOCUMENT_TYPES_MAP.CERTIFICATE_OF_GOOD_STANDING,
          location: expectedLocation,
        },
      },
    });

    expect(result.state.form.categoryName).toEqual(
      `${PRACTITIONER_DOCUMENT_TYPES_MAP.CERTIFICATE_OF_GOOD_STANDING} - ${expectedLocation}`,
    );
  });
});
