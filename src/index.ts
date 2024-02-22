import * as core from '@actions/core';

export const run = async () => {
  const discordWebhook = core.getInput('discord-webhook', { required: true });
  if (!discordWebhook) throw new Error("discordWebhook doesn't exist")
  //testing
  core.info(`setting output LATEST_LAYER_VERSION: ${JSON.stringify(discordWebhook, null)} *** ${discordWebhook}`);
};

export default run;

if (require.main === module) {
  run();
}
