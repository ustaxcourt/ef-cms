import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setSignatureNameForPdfSigningAction } from './setSignatureNameForPdfSigningAction';

describe('setSignatureNameForPdfSigningAction', () => {
  const { CHIEF_JUDGE } = applicationContext.getConstants();

  let user = {
    section: 'armenChambers',
  };

  let judgeUser = {
    name: 'Judge Armen',
  };

  beforeAll(() => {
    applicationContext
      .getUseCases()
      .getJudgeForUserChambersInteractor.mockReturnValue(judgeUser);

    applicationContext.getChiefJudgeNameForSigning.mockReturnValue(
      'Maurice B. Foley',
    );

    applicationContext.getCurrentUser.mockReturnValue(user);

    presenter.providers.applicationContext = applicationContext;
  });

  it('sets the Chief Judge for non chamber users', async () => {
    user.section = 'docketclerk';

    const result = await runAction(setSignatureNameForPdfSigningAction, {
      modules: {
        presenter,
      },
    });
    expect(result.state.pdfForSigning.nameForSigning).toEqual(
      'Maurice B. Foley',
    );
    expect(result.state.pdfForSigning.nameForSigningLine2).toEqual(CHIEF_JUDGE);
  });

  it('sets the chamber judge for chamber users', async () => {
    judgeUser.judgeFullName = 'Robert N. Armen, Jr.';
    judgeUser.judgeTitle = 'Special Trial Judge';
    user.section = 'armenChambers';
    const result = await runAction(setSignatureNameForPdfSigningAction, {
      modules: {
        presenter,
      },
    });
    expect(result.state.pdfForSigning.nameForSigning).toEqual(
      'Robert N. Armen, Jr.',
    );
    expect(result.state.pdfForSigning.nameForSigningLine2).toEqual(
      'Special Trial Judge',
    );
  });

  it('sets special trial for special trial judge', async () => {
    judgeUser.judgeFullName = 'Robert N. Armen, Jr.';
    judgeUser.judgeTitle = 'Special Trial Judge';
    user.section = 'armenChambers';
    const result = await runAction(setSignatureNameForPdfSigningAction, {
      modules: {
        presenter,
      },
    });
    expect(result.state.pdfForSigning.nameForSigning).toEqual(
      'Robert N. Armen, Jr.',
    );
    expect(result.state.pdfForSigning.nameForSigningLine2).toEqual(
      'Special Trial Judge',
    );
  });
});
