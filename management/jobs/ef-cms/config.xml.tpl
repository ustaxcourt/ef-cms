<?xml version='1.1' encoding='UTF-8'?>
<org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject plugin="workflow-multibranch@2.20">
  <actions/>
  <description>An Electronic Filing / Case Management System.</description>
  <properties>
    <org.jenkinsci.plugins.pipeline.modeldefinition.config.FolderConfig plugin="pipeline-model-definition@1.3.2">
      <dockerLabel></dockerLabel>
      <registry plugin="docker-commons@1.13"/>
    </org.jenkinsci.plugins.pipeline.modeldefinition.config.FolderConfig>
  </properties>
  <folderViews class="jenkins.branch.MultiBranchProjectViewHolder" plugin="branch-api@2.0.20">
    <owner class="org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject" reference="../.."/>
  </folderViews>
  <healthMetrics>
    <com.cloudbees.hudson.plugins.folder.health.WorstChildHealthMetric plugin="cloudbees-folder@6.5.1">
      <nonRecursive>false</nonRecursive>
    </com.cloudbees.hudson.plugins.folder.health.WorstChildHealthMetric>
  </healthMetrics>
  <icon class="jenkins.branch.MetadataActionFolderIcon" plugin="branch-api@2.0.20">
    <owner class="org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject" reference="../.."/>
  </icon>
  <orphanedItemStrategy class="com.cloudbees.hudson.plugins.folder.computed.DefaultOrphanedItemStrategy" plugin="cloudbees-folder@6.5.1">
    <pruneDeadBranches>true</pruneDeadBranches>
    <daysToKeep>5</daysToKeep>
    <numToKeep>5</numToKeep>
  </orphanedItemStrategy>
  <triggers/>
  <disabled>false</disabled>
  <sources class="jenkins.branch.MultiBranchProject$BranchSourceList" plugin="branch-api@2.0.20">
    <data>
      <jenkins.branch.BranchSource>
        <source class="org.jenkinsci.plugins.github_branch_source.GitHubSCMSource" plugin="github-branch-source@2.4.0">
          <id>aa923230-bdf4-42f9-976e-4619eec4a89f</id>
          <credentialsId>GITHUB_USER</credentialsId>
          <repoOwner>REPO_OWNER</repoOwner>
          <repository>REPOSITORY</repository>
          <traits>
            <org.jenkinsci.plugins.github__branch__source.BranchDiscoveryTrait>
              <strategyId>3</strategyId>
            </org.jenkinsci.plugins.github__branch__source.BranchDiscoveryTrait>
            <org.jenkinsci.plugins.github__branch__source.OriginPullRequestDiscoveryTrait>
              <strategyId>2</strategyId>
            </org.jenkinsci.plugins.github__branch__source.OriginPullRequestDiscoveryTrait>
            <jenkins.scm.impl.trait.WildcardSCMHeadFilterTrait plugin="scm-api@2.2.7">
              <includes>develop staging master PR*</includes>
              <excludes></excludes>
            </jenkins.scm.impl.trait.WildcardSCMHeadFilterTrait>
            <jenkins.plugins.git.traits.RefSpecsSCMSourceTrait plugin="git@3.9.1">
              <templates>
                <jenkins.plugins.git.traits.RefSpecsSCMSourceTrait_-RefSpecTemplate>
                  <value>+refs/heads/*:refs/remotes/origin/*</value>
                </jenkins.plugins.git.traits.RefSpecsSCMSourceTrait_-RefSpecTemplate>
              </templates>
            </jenkins.plugins.git.traits.RefSpecsSCMSourceTrait>
          </traits>
        </source>
        <strategy class="jenkins.branch.DefaultBranchPropertyStrategy">
          <properties class="empty-list"/>
        </strategy>
      </jenkins.branch.BranchSource>
    </data>
    <owner class="org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject" reference="../.."/>
  </sources>
  <factory class="org.jenkinsci.plugins.workflow.multibranch.WorkflowBranchProjectFactory">
    <owner class="org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject" reference="../.."/>
    <scriptPath>Jenkinsfile</scriptPath>
  </factory>
</org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject>