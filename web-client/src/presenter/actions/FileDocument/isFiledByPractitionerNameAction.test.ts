import { isFiledByPractitionerNameAction } from './isFiledByPractitionerNameAction';
import {
  petitionerUser,
  privatePractitionerUser,
} from '@shared/test/mockUsers';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('isFiledByPractitionerNameAction', () => {
  beforeEach(() => {
    presenter.providers.path = {
      no: jest.fn(),
      yes: jest.fn(),
    };
  });

  it('calls path.yes when a practitioner files an M112', async () => {
    await runAction(isFiledByPractitionerNameAction, {
      modules: { presenter },
      state: { form: { eventCode: 'M112' }, user: privatePractitionerUser },
    });

    expect(presenter.providers.path.yes).toHaveBeenCalledTimes(1);
    expect(presenter.providers.path.no).not.toHaveBeenCalled();
  });

  it('calls path.no when a practitioner files another document type', async () => {
    await runAction(isFiledByPractitionerNameAction, {
      modules: { presenter },
      state: { form: { eventCode: 'ABC' }, user: privatePractitionerUser },
    });

    expect(presenter.providers.path.yes).not.toHaveBeenCalled();
    expect(presenter.providers.path.no).toHaveBeenCalledTimes(1);
  });

  it('calls path.no when a non-practitioner files an M112', async () => {
    await runAction(isFiledByPractitionerNameAction, {
      modules: { presenter },
      state: { form: { eventCode: 'M112' }, user: petitionerUser },
    });

    expect(presenter.providers.path.yes).not.toHaveBeenCalled();
    expect(presenter.providers.path.no).toHaveBeenCalledTimes(1);
  });
});
