import { isFiledByPractitionerNameAction } from './isFiledByPractitionerNameAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('isFiledByPractitionerNameAction', () => {
  beforeEach(() => {
    presenter.providers.path = {
      no: jest.fn(),
      yes: jest.fn(),
    };
  });

  it.each([
    ['NOTW', { eventCode: 'NOTW' }],
    ['M112', { eventCode: 'M112' }],
    [
      'a Nonstandard H filing targeting an M112',
      { eventCode: 'M115', secondaryDocument: { eventCode: 'M112' } },
    ],
  ])('calls path.yes when the form is %s', async (_, form) => {
    await runAction(isFiledByPractitionerNameAction, {
      modules: { presenter },
      state: { form },
    });

    expect(presenter.providers.path.yes).toHaveBeenCalledTimes(1);
    expect(presenter.providers.path.no).not.toHaveBeenCalled();
  });

  it.each([
    ['another event code', { eventCode: 'ABC' }],
    [
      'a Nonstandard H filing not targeting an M112',
      { eventCode: 'M115', secondaryDocument: { eventCode: 'M000' } },
    ],
  ])('calls path.no when the form is %s', async (_, form) => {
    await runAction(isFiledByPractitionerNameAction, {
      modules: { presenter },
      state: { form },
    });

    expect(presenter.providers.path.yes).not.toHaveBeenCalled();
    expect(presenter.providers.path.no).toHaveBeenCalledTimes(1);
  });
});
