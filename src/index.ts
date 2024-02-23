import * as core from '@actions/core';
import * as github from '@actions/github';
import axios from 'axios';

export const run = async () => {
  const { context } = github;
  const { payload } = context;

  const discordWebhook = core.getInput('discord-webhook', { required: true });
  if (!discordWebhook) throw new Error("discordWebhook doesn't exist");

  const repoName = payload.repository?.name;
  core.info(`setting REPO_NAME: ${repoName}`);

  const branchName = context.ref.includes('/') ? context.ref.split('/').pop() ?? '' : '';
  core.info(`setting BRANCH_NAME: ${branchName}`);
  // core.exportVariable('BRANCH_NAME', branchName);

  const stage = (branchName.toUpperCase() === 'MAIN') ? 'PROD' : branchName.toUpperCase();
  core.info(`setting STAGE: ${stage}`);
  // core.exportVariable('STAGE', stage);

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
  // core.exportVariable('COMMIT_MESSAGE', commitMessage);

  core.info(`setting SUCCESS_MESSAGE: The test, build and deploy succeeded! 🚀 Message: ${commitMessage}`);
  // core.exportVariable('SUCCESS_MESSAGE', `The test, build and deploy succeeded! 🚀 Message: ${commitMessage}`);

  const webhookParts = discordWebhook.split('://');
  const protocol = webhookParts[0];
  const remainingUrl = webhookParts[1];

  core.info(`Protocol: ${protocol}`);
  core.info(`URL: ${remainingUrl}`);

  const msg = {
    username: repoName,
    content: 'hello world!',
    embeds: [

    ],
  };

  const msg1 = {
    username: 'Webhook',
    avatar_url: 'https://i.imgur.com/4M34hi2.png',
    content: 'Text message. Up to 2000 characters.',
    embeds: [
      {
        author: {
          name: 'Birdie♫',
          url: 'https://www.reddit.com/r/cats/',
          icon_url: 'https://i.imgur.com/R66g1Pe.jpg',
        },
        title: 'Title',
        url: 'https://google.com/',
        description: 'Text message. You can use Markdown here. *Italic* **bold** __underline__ ~~strikeout~~ [hyperlink](https://google.com) `code`',
        color: 15258703,
        fields: [
          {
            name: 'Text',
            value: 'More text',
            inline: true,
          },
          {
            name: 'Even more text',
            value: 'Yup',
            inline: true,
          },
          {
            name: 'Use "inline": true parameter, if you want to display fields in the same line.',
            value: 'okay...',
          },
          {
            name: 'Thanks!',
            value: "You're welcome :wink:",
          },
        ],
        thumbnail: {
          url: 'https://upload.wikimedia.org/wikipedia/commons/3/38/4-Nature-Wallpapers-2014-1_ukaavUI.jpg',
        },
        image: {
          url: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/A_picture_from_China_every_day_108.jpg',
        },
        footer: {
          text: 'Woah! So cool! :smirk:',
          icon_url: 'https://i.imgur.com/fKL31aD.jpg',
        },
      },
    ],
  };

  let res;
  try {
    res = await axios.post(discordWebhook, msg1);
    core.info(res.statusText);
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export default run;

if (require.main === module) {
  run();
}
