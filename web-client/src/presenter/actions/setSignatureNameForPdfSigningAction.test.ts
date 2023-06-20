import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setSignatureNameForPdfSigningAction } from './setSignatureNameForPdfSigningAction';

describe('setSignatureNameForPdfSigningAction', () => {
  const { CHIEF_JUDGE } = applicationContext.getConstants();

  let user = {
    section: 'colvinChambers',
  };

  let judgeUser = {
    name: 'Judge Colvin',
  };

  beforeAll(() => {
    applicationContext
      .getUseCases()
      .getJudgeInSectionInteractor.mockReturnValue(judgeUser);

    applicationContext
      .getUseCases()
      .getChiefJudgeNameForSigningInteractor.mockReturnValue(
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
    judgeUser.judgeFullName = 'John O. Colvin';
    judgeUser.judgeTitle = 'Judge';
    user.section = 'colvinChambers';
    const result = await runAction(setSignatureNameForPdfSigningAction, {
      modules: {
        presenter,
      },
    });
    expect(result.state.pdfForSigning.nameForSigning).toEqual('John O. Colvin');
    expect(result.state.pdfForSigning.nameForSigningLine2).toEqual('Judge');
  });

  it('sets special trial for special trial judge', async () => {
    judgeUser.judgeFullName = 'John O. Colvin';
    judgeUser.judgeTitle = 'Special Trial Judge';
    user.section = 'colvinChambers';
    const result = await runAction(setSignatureNameForPdfSigningAction, {
      modules: {
        presenter,
      },
    });
    expect(result.state.pdfForSigning.nameForSigning).toEqual('John O. Colvin');
    expect(result.state.pdfForSigning.nameForSigningLine2).toEqual(
      'Special Trial Judge',
    );
  });
});
