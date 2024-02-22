import * as core from '@actions/core';
import axios from 'axios';

export const run = async () => {
  const discordWebhook = core.getInput('discord-webhook', { required: true });
  if (!discordWebhook) throw new Error("discordWebhook doesn't exist");

  core.info(`------>${discordWebhook}`);
  // let res;
  // try {
  //   res = await axios.post(discordWebhook, 'hola');
  //   core.info(res.statusText);
  // } catch (err: any) {
  //   throw new Error(err.message);
  // }
};

export default run;

if (require.main === module) {
  run();
}
