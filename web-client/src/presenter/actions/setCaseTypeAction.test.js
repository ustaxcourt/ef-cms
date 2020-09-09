import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setCaseTypeAction } from './setCaseTypeAction';

describe('setCaseTypeAction', () => {
  const { CASE_TYPES_MAP } = applicationContext.getConstants();
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it(`sets state.form.caseType to ${CASE_TYPES_MAP.disclosure} when state.form.caseType is "Disclosure1"`, async () => {
    const { state } = await runAction(setCaseTypeAction, {
      modules: {
        presenter,
      },
      state: {
        form: { caseType: 'Disclosure1' },
      },
    });

    expect(state.form.caseType).toEqual(CASE_TYPES_MAP.disclosure);
  });

  it(`sets state.form.caseType to ${CASE_TYPES_MAP.disclosure} when state.form.caseType is "Disclosure2"`, async () => {
    const { state } = await runAction(setCaseTypeAction, {
      modules: {
        presenter,
      },
      state: {
        form: { caseType: 'Disclosure2' },
      },
    });

    expect(state.form.caseType).toEqual(CASE_TYPES_MAP.disclosure);
  });
});
