#!/usr/bin/env -S npx ts-node --transpile-only

import {
  getContexts,
  getOrganizationId,
  updateContextVariable,
} from '../../shared/admin-tools/circleci/circleci-helper';

export const updateAwsCredentialsInContext = async ({
  apiToken,
  awsAccessKeyId,
  awsSecretAccessKey,
  contextName,
  projectSlug,
}: {
  apiToken: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  contextName: string;
  projectSlug: string;
}): Promise<void> => {
  console.log(`Getting organization ID for project ${projectSlug}...`);
  const organizationId = await getOrganizationId({ apiToken, projectSlug });
  console.log(`Organization ID: ${organizationId}`);

  console.log('Listing contexts...');
  const contexts = await getContexts({ apiToken, ownerId: organizationId });

  const targetContext = contexts.find(context => context.name === contextName);

  if (!targetContext) {
    throw new Error(`Context '${contextName}' not found.`);
  }

  console.log(`Updating context: ${targetContext.name} (${targetContext.id})`);

  await updateContextVariable({
    apiToken,
    contextId: targetContext.id,
    variableName: 'AWS_ACCESS_KEY_ID',
    variableValue: awsAccessKeyId,
  });
  console.log('  Updated AWS_ACCESS_KEY_ID');

  await updateContextVariable({
    apiToken,
    contextId: targetContext.id,
    variableName: 'AWS_SECRET_ACCESS_KEY',
    variableValue: awsSecretAccessKey,
  });
  console.log('  Updated AWS_SECRET_ACCESS_KEY');

  console.log(`Successfully updated context '${contextName}'.`);
};
