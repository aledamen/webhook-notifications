import * as core from '@actions/core';
import * as github from '@actions/github';
import axios from 'axios';
import handleError from './helpers/handleError';
import hexToDecimal from './helpers/hexToDecimal';

export const run = async () => {
  const { context } = github;
  const { payload } = context;

  // GETTING INPUTS
  const discordWebhook = core.getInput('discord-webhook', { required: true });
  if (!discordWebhook) throw new Error("discordWebhook doesn't exist");

  const messageColor = core.getInput('message-color', { required: false });
  core.info(`message-color ${messageColor}`);
  const messageIcon = core.getInput('message-icon', { required: false });
  core.info(`message-icon ${messageIcon}`);
  const messageUsername = core.getInput('message-username', { required: false });
  core.info(`message-username ${messageUsername}`);
  const messageActionTitle = core.getInput('message-action-title', { required: false });
  core.info(`message-body-title ${messageActionTitle}`);
  const messageActionName = core.getInput('message-action-name', { required: false });
  core.info(`message-body-text ${messageActionName}`);
  const messageBodyTitle = core.getInput('message-body-title', { required: false });
  core.info(`message-body-title ${messageBodyTitle}`);
  const messageBodyText = core.getInput('message-body-text', { required: false });
  core.info(`message-body-text ${messageBodyText}`);

  // SETTING VARIABLES TO SEND MESSAGE
  const repoName = payload.repository?.name;
  core.info(`setting REPO_NAME: ${repoName}`);

  const branchName = context.ref.includes('/') ? context.ref.split('/').pop() ?? '' : '';
  core.info(`setting BRANCH_NAME: ${branchName}`);

  const stage = (branchName.toUpperCase() === 'MAIN') ? 'PROD' : branchName.toUpperCase();
  core.info(`setting STAGE: ${stage}`);

  let actorInfo;
  try {
    actorInfo = await axios.get(`https://api.github.com/users/${context.actor}`);
    core.info(`Success Actor Info ---> ${actorInfo.data.avatar_url}`);
  } catch (err: any) {
    const errorMsg = handleError(err);
    core.info(`Error Actor Info---> ${errorMsg}`);
    throw new Error(errorMsg);
  }

  if (!('commits' in payload)) {
    throw new Error('No commits found in payload, check the action initiator');
  }

  const commits = payload.commits.sort(
    (a: any, b: any) => Math.abs(new Date(b.timestamp).valueOf() - new Date(a.timestamp).valueOf()),
  );

  // TODO: Check if commits is empty and throw error
  const lastCommit = commits.shift();
  const commitMessage = lastCommit.message;

  core.info(`setting COMMIT_MESSAGE: ${commitMessage}`);

  core.info(`setting SUCCESS_MESSAGE: The test, build and deploy succeeded! 🚀 Message: ${commitMessage}`);

  const msg1 = {
    username: messageUsername || `${repoName} ${stage}`,
    avatar_url: messageIcon || 'https://avatars.githubusercontent.com/u/52255631?s=200&v=4',
    embeds: [
      {
        author: {
          name: context.actor,
          url: `https://github.com/${context.actor}`,
          icon_url: actorInfo.data.avatar_url || 'https://avatars.githubusercontent.com/u/52255631?s=200&v=4',
        },
        color: hexToDecimal(messageColor) || 3307709,
        fields: [
          {
            name: messageActionTitle || 'Actions URL',
            value: `[${context.workflow}](https://github.com/EducacionIT/${repoName}/commit/${context.sha}/checks)`
              || '[Workflows Name](https://github.com/)',
          },
          {
            name: 'Your message title for deploy should be here',
            value: 'The test, build and deploy succeeded! 🚀 Message: ',
          },
        ],
      },
    ],
  };

  try {
    const res = await axios.post(discordWebhook, msg1);
    core.info(`Success Message ---> ${res.data.data}`);
  } catch (err: any) {
    const errorMsg = handleError(err);
    core.info(`Error Message ---> ${errorMsg}`);
    throw new Error(errorMsg);
  }
};

export default run;

if (require.main === module) {
  run();
}
