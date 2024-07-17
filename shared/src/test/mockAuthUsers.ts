import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { ROLES } from '@shared/business/entities/EntityConstants';

export const mockPetitionerUser: AuthUser = {
  email: 'mockPetitioner@example.com',
  name: 'Tax Payer',
  role: ROLES.petitioner,
  userId: 'e4988d2d-deb0-4b65-a97f-5abfadb0970a',
};

export const mockDocketClerkUser: AuthUser = {
  email: 'mockDocketClerk@example.com',
  name: 'Dimmy Docket',
  role: ROLES.docketClerk,
  userId: '612e3eb3-332c-4f1f-aaff-44ac8eae9a5f',
};

export const mockJudgeUser: AuthUser = {
  email: 'mockJudge@example.com',
  name: 'Judge Judy',
  role: ROLES.judge,
  userId: '3a13531b-0fc5-4a4c-8188-c72f50b1889d',
};

export const mockPetitionsClerkUser: AuthUser = {
  email: 'mockPetitionsClerk@example.com',
  name: 'Patty Petitions Clerk',
  role: ROLES.petitionsClerk,
  userId: 'd5234a80-64aa-4e3e-b0fd-59e6a835585e',
};

export const mockPrivatePractitionerUser: AuthUser = {
  email: 'mockPrivatePractitioner@example.com',
  name: 'Reginald Barclay',
  role: ROLES.privatePractitioner,
  userId: '73dedd03-e353-4703-bf6b-5b864b8c16ae',
};

export const mockAdmissionsClerkUser: AuthUser = {
  email: 'mockAdmissionsClerk@example.com',
  name: 'Nora Scott',
  role: ROLES.admissionsClerk,
  userId: 'e796d8cd-2e85-4d79-b4e1-281b59cacd5f',
};

export const mockTrialClerkUser: AuthUser = {
  email: 'mockTrialClerk@example.com',
  name: 'Emil Lawerance',
  role: ROLES.trialClerk,
  userId: '474492fc-5aaf-4fe8-829d-b80a9c933e93',
};

export const mockAdminUser: AuthUser = {
  email: 'mockAdmin@example.com',
  name: 'Admiral Admin',
  role: ROLES.admin,
  userId: 'f56424f2-e071-4b3c-97b9-708f660a0ea7',
};

export const mockAdcUser: AuthUser = {
  email: 'mockAdc@example.com',
  name: 'Antony Aardvark',
  role: ROLES.adc,
  userId: '9f357f78-a8fa-40bf-83db-8144ddf14047',
};

export const mockIrsPractitionerUser: AuthUser = {
  email: 'mockIrsPractitioner@example.com',
  name: 'Ida Igloo',
  role: ROLES.irsPractitioner,
  userId: '4eb0a70d-ed4c-4715-a95f-261cb1441db9',
};

export const mockIrsSuperuser: AuthUser = {
  email: 'mockIrsSuperUser@example.com',
  name: 'Iris Iguana',
  role: ROLES.irsSuperuser,
  userId: '192b629a-aa9c-4a7d-9379-b2a1331a6848',
};

export const mockChambersUser: AuthUser = {
  email: 'mockChambersUser@example.com',
  name: 'Chitty Chambers',
  role: ROLES.chambers,
  userId: 'e28c2f91-6925-48ac-8441-22b522b0c044',
};

export const mockCaseServicesSupervisorUser: AuthUser = {
  email: 'mockCaseServicesSupervisorUser@example.com',
  name: 'Candy Case',
  role: ROLES.caseServicesSupervisor,
  userId: '97451b05-ae9c-46d5-9074-1ac6ef12cfc6',
};
