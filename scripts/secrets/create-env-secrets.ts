#!/usr/bin/env -S npx ts-node --transpile-only

import { parseArgsAndEnvVars } from '../helpers/parseArgsAndEnvVars';
import {
  createEnvSecrets,
  createEnvSecretsScriptConfig,
} from './create-env-secrets.helpers';

const {
  adminUserEmail,
  baseDomain,
  dynamsoftProductKeys,
  emailDmarcPolicy,
  enableDynamsoft,
  enableEmail,
  enableHealthChecks,
  env,
  generateSecureDefaultAccountPassword,
  irsSuperuserEmail,
  opensearchEngineVersion,
  opensearchInstanceCount,
  opensearchInstanceType,
  opensearchVolumeSize,
  paymentPortalArn,
  paymentPortalHost,
  payGovOrigin,
  postgresOriginalUsername,
  prodAccountId,
  prodDocumentsBucket,
  rdsEngineVersion,
  rdsMaxCapacity,
  rdsMinCapacity,
  region,
  rumSampleRate,
  update,
  zendeskUserEmail,
} = parseArgsAndEnvVars(createEnvSecretsScriptConfig) as {
  adminUserEmail: string;
  baseDomain: string;
  dynamsoftProductKeys: string;
  emailDmarcPolicy: string;
  enableDynamsoft: boolean;
  enableEmail: boolean;
  enableHealthChecks: boolean;
  env: string;
  generateSecureDefaultAccountPassword: boolean;
  irsSuperuserEmail: string;
  opensearchEngineVersion: string;
  opensearchInstanceCount: number;
  opensearchInstanceType: string;
  opensearchVolumeSize: number;
  paymentPortalArn: string;
  paymentPortalHost: string;
  payGovOrigin: string;
  postgresOriginalUsername: string;
  prodAccountId: string;
  prodDocumentsBucket: string;
  rdsEngineVersion: string;
  rdsMaxCapacity: string;
  rdsMinCapacity: string;
  region: string;
  rumSampleRate: string;
  update: boolean;
  zendeskUserEmail: string;
};

void createEnvSecrets({
  adminUserEmail,
  baseDomain,
  dynamsoftProductKeys,
  emailDmarcPolicy,
  enableDynamsoft,
  enableEmail,
  enableHealthChecks,
  env,
  generateSecureDefaultAccountPassword,
  irsSuperuserEmail,
  opensearchEngineVersion,
  opensearchInstanceCount,
  opensearchInstanceType,
  opensearchVolumeSize,
  paymentPortalArn,
  paymentPortalHost,
  payGovOrigin,
  postgresOriginalUsername,
  prodAccountId,
  prodDocumentsBucket,
  rdsEngineVersion,
  rdsMaxCapacity,
  rdsMinCapacity,
  region,
  rumSampleRate,
  update,
  zendeskUserEmail,
});
