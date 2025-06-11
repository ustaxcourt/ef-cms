import {
  ECRClient,
  DescribeRepositoriesCommand,
  ListImagesCommand,
  BatchDeleteImageCommand,
  ImageIdentifier,
} from '@aws-sdk/client-ecr';
import {
  parseArgsAndEnvVars,
  ScriptConfig,
} from 'scripts/helpers/parseArgsAndEnvVars';

const scriptConfig: ScriptConfig = {
  description:
    'deleteEcrImages - Deletes ECR images from us-west-1',
  environment: {
    env: 'ENV',
    deployingColor: 'DEPLOYING_COLOR',
  },
  requireActiveAwsSession: true,
};
const { env, deployingColor } = parseArgsAndEnvVars(scriptConfig) as {
  env: string;
  deployingColor: string;
};

const REGION = 'us-west-1';
const client = new ECRClient({ region: REGION });

export async function deleteAllImages() {
  const repoName = `docket-entry-zipper-${env}-${deployingColor}-us-west-1`;
  try {
    const describeRepos = await client.send(
      new DescribeRepositoriesCommand({ repositoryNames: [repoName] }),
    );
    const repositories = describeRepos.repositories ?? [];

    for (const repo of repositories) {
      const repoName = repo.repositoryName!;
      console.log(`Processing repository: ${repoName}`);

      // Step 2: List all images in the repository
      const listImagesResponse = await client.send(
        new ListImagesCommand({
          repositoryName: repoName,
        }),
      );

      const imageIds: ImageIdentifier[] = listImagesResponse.imageIds ?? [];

      if (imageIds.length === 0) {
        console.log(`No images found in repository: ${repoName}`);
        continue;
      }

      // Step 3: Delete all images
      const deleteResponse = await client.send(
        new BatchDeleteImageCommand({
          repositoryName: repoName,
          imageIds,
        }),
      );

      const deleted = deleteResponse.imageIds ?? [];
      console.log(`Deleted ${deleted.length} image(s) from ${repoName}`);
    }

    console.log(`Finished deleting all images inside of ${repoName}`);
  } catch (err) {
    console.error('Error deleting images:', err);
  }
}
