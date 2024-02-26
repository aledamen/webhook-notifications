import * as core from '@actions/core';
import * as github from '@actions/github';
import axios from 'axios';
import hexToRgb from './helpers/hexToRgb';
import handleError from './helpers/handleError';

export const run = async () => {
  const { context } = github;
  const { payload } = context;

  const discordWebhook = core.getInput('discord-webhook', { required: true });
  if (!discordWebhook) throw new Error("discordWebhook doesn't exist");

  const messageColor = core.getInput('message-color', { required: false });
  const messageIcon = core.getInput('message-icon', { required: false });
  const messageUsername = core.getInput('message-username', { required: false });
  const messageTitle = core.getInput('message-title', { required: false });
  const messageText = core.getInput('message-text', { required: false });

  const repoName = payload.repository?.name;
  core.info(`setting REPO_NAME: ${repoName}`);

  const branchName = context.ref.includes('/') ? context.ref.split('/').pop() ?? '' : '';
  core.info(`setting BRANCH_NAME: ${branchName}`);

  const stage = (branchName.toUpperCase() === 'MAIN') ? 'PROD' : branchName.toUpperCase();
  core.info(`setting STAGE: ${stage}`);

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
    username: 'a',
    avatar_url: 'https://i.imgur.com/4M34hi2.png',
    content: 'i am a content',
    embeds: [
      {
        author: {
          name: 'a',
          url: 'https://github.com/',
          icon_url: 'https://i.imgur.com/R66g1Pe.jpg',
        },
        color: 15258703,
        fields: [
          {
            name: 'Actions URL',
            value: '[hyperlink](https://github.com/',
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
    core.info(`Success ---> ${res.data}`);
  } catch (err: any) {
    const errorMsg = handleError(err);
    core.info(`Error ---> ${errorMsg}`);
    throw new Error(errorMsg);
  }
};

export default run;

if (require.main === module) {
  run();
}
