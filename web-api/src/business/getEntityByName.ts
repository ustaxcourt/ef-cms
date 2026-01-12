import { Case } from '@shared/business/entities/cases/Case';
import { CaseDeadline } from '@shared/business/entities/CaseDeadline';
import { Correspondence } from '@shared/business/entities/Correspondence';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { Message } from '@shared/business/entities/Message';
import { Practitioner } from '@shared/business/entities/Practitioner';
import { PrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { TrialSessionWorkingCopy } from '@shared/business/entities/trialSessions/TrialSessionWorkingCopy';
import { User } from '@shared/business/entities/User';
import { UserCase } from '@shared/business/entities/UserCase';
import { UserCaseNote } from '@shared/business/entities/notes/UserCaseNote';

export const getEntityByName = (name: string) => {
  const entitiesByName = {
    Case,
    CaseDeadline,
    Correspondence,
    DocketEntry,
    IrsPractitioner,
    Message,
    Practitioner,
    PrivatePractitioner,
    TrialSession,
    TrialSessionWorkingCopy,
    User,
    UserCase,
    UserCaseNote,
  };

  return entitiesByName[name];
};
