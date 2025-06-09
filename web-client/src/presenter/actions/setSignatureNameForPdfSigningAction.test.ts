import { RawUser } from '@shared/business/entities/User';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { cloneDeep } from 'lodash';
import { judgeColvin } from '@shared/test/mockUsers';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setSignatureNameForPdfSigningAction } from './setSignatureNameForPdfSigningAction';

describe('setSignatureNameForPdfSigningAction', () => {
  const { ALLOWLIST_FEATURE_FLAGS, CHIEF_JUDGE } =
    applicationContext.getConstants();

  let judgeUser: RawUser;

  beforeAll(() => {
    judgeUser = cloneDeep(judgeColvin);
    applicationContext
      .getUseCases()
      .getJudgeInSectionInteractor.mockReturnValue(judgeUser);

    applicationContext
      .getUseCases()
      .getAllFeatureFlagsInteractor.mockReturnValue({
        [ALLOWLIST_FEATURE_FLAGS.CHIEF_JUDGE_NAME.key]: 'Oscar the Grouch',
      });

    presenter.providers.applicationContext = applicationContext;
  });

  it('sets the Chief Judge for non chamber users', async () => {
    const result = await runAction(setSignatureNameForPdfSigningAction, {
      modules: {
        presenter,
      },
      state: {
        user: {
          section: 'docketclerk',
        },
      },
    });
    expect(result.state.pdfForSigning.nameForSigning).toEqual(
      'Oscar the Grouch',
    );
    expect(result.state.pdfForSigning.nameForSigningLine2).toEqual(CHIEF_JUDGE);
  });

  it('sets the chamber judge for chamber users', async () => {
    judgeUser.judgeFullName = 'John O. Colvin';
    judgeUser.judgeTitle = 'Judge';
    const result = await runAction(setSignatureNameForPdfSigningAction, {
      modules: {
        presenter,
      },
      state: {
        user: {
          section: 'colvinChambers',
        },
      },
    });
    expect(result.state.pdfForSigning.nameForSigning).toEqual('John O. Colvin');
    expect(result.state.pdfForSigning.nameForSigningLine2).toEqual('Judge');
  });

  it('sets special trial for special trial judge', async () => {
    judgeUser.judgeFullName = 'John O. Colvin';
    judgeUser.judgeTitle = 'Special Trial Judge';
    const result = await runAction(setSignatureNameForPdfSigningAction, {
      modules: {
        presenter,
      },
      state: {
        user: {
          section: 'colvinChambers',
        },
      },
    });
    expect(result.state.pdfForSigning.nameForSigning).toEqual('John O. Colvin');
    expect(result.state.pdfForSigning.nameForSigningLine2).toEqual(
      'Special Trial Judge',
    );
  });
});
