import { RawUserCaseNote } from 'shared/src/business/entities/notes/UserCaseNote';

export const getUserCaseNoteForCasesAction = async ({
  applicationContext,
  props,
}: ActionProps): Promise<{ notes: RawUserCaseNote[] }> => {
  const { trialSession } = props;

  let notes: RawUserCaseNote[] = [];
  if (trialSession.caseOrder.length) {
    notes = await applicationContext
      .getUseCases()
      .getUserCaseNoteForCasesInteractor(applicationContext, {
        docketNumbers: trialSession.caseOrder.map(entry => entry.docketNumber),
      });
  }

  return { notes };
};
