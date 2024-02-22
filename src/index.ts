import * as core from '@actions/core';
import axios from 'axios';

export const run = async () => {
  const discordWebhook = core.getInput('discord-webhook', { required: true });
  if (!discordWebhook) throw new Error("discordWebhook doesn't exist");
  axios.post(discordWebhook, 'hola');
};

export default run;

if (require.main === module) {
  run();
}
