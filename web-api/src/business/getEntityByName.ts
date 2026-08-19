import { Case } from '@shared/business/entities/cases/Case';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';
import { CaseDeadline } from '@shared/business/entities/CaseDeadline';
import { Correspondence } from '@shared/business/entities/Correspondence';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { FeatureFlagResponseDTO } from '@shared/business/dto/system/FeatureFlagResponseDTO';
import { HealthCheckResponse } from '@shared/business/dto/public/HealthCheckResponse';
import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { Message } from '@shared/business/entities/Message';
import { Practitioner } from '@shared/business/entities/Practitioner';
import { PrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { PublicCase } from '@shared/business/entities/cases/PublicCase';
import { PublicCaseResponse } from '@shared/business/dto/cases/PublicCaseResponse';
import { PublicCaseSearchResult } from '@shared/business/entities/cases/PublicCaseSearchResult';
import { PublicContact } from '@shared/business/entities/cases/PublicContact';
import { PublicDocketEntry } from '@shared/business/entities/cases/PublicDocketEntry';
import { PublicDocketRecordPdfJobResponse } from '@shared/business/dto/public/PublicDocketRecordPdfJobResponse';
import { PublicDocumentDownloadUrl } from '@shared/business/dto/public/PublicDocumentDownloadUrl';
import { PublicDocumentSearchResult } from '@shared/business/entities/documents/PublicDocumentSearchResult';
import { PublicTrialSessionDetails } from '@shared/business/entities/trialSessions/PublicTrialSessionDetails';
import { PublicTrialSessionInfo } from '@shared/business/dto/trialSessions/PublicTrialSessionInfo';
import { PublicUser } from '@shared/business/entities/PublicUser';
import { RestrictedCase } from '@shared/business/entities/cases/RestrictedCase';
import { RestrictedCaseResponse } from '@shared/business/dto/cases/RestrictedCaseResponse';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';
import { TrialSessionWorkingCopy } from '@shared/business/entities/trialSessions/TrialSessionWorkingCopy';
import { User } from '@shared/business/entities/User';
import { UserCase } from '@web-api/business/entities/UserCase';
import { UserCaseNote } from '@shared/business/entities/notes/UserCaseNote';

export const getEntityByName = (name: string) => {
  const entitiesByName = {
    Case,
    CaseDTO,
    CaseDeadline,
    Correspondence,
    DocketEntry,
    FeatureFlagResponseDTO,
    HealthCheckResponse,
    IrsPractitioner,
    Message,
    Practitioner,
    PrivatePractitioner,
    PublicCase,
    PublicCaseResponse,
    PublicCaseSearchResult,
    PublicContact,
    PublicDocketEntry,
    PublicDocketRecordPdfJobResponse,
    PublicDocumentDownloadUrl,
    PublicDocumentSearchResult,
    PublicTrialSessionDetails,
    PublicTrialSessionInfo,
    PublicUser,
    RestrictedCase,
    RestrictedCaseResponse,
    TrialSession,
    TrialSessionInfoDTO,
    TrialSessionWorkingCopy,
    User,
    UserCase,
    UserCaseNote,
  };

  return entitiesByName[name];
};
