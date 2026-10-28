import fs from "fs";
import os from "os";

import * as core from "@actions/core";
import axios, { isAxiosError } from "axios";

import * as installer from "./installer";

async function validateSubscription() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  let repoPrivate: boolean | undefined;

  if (eventPath && fs.existsSync(eventPath)) {
    const eventData = JSON.parse(fs.readFileSync(eventPath, "utf8"));
    repoPrivate = eventData?.repository?.private;
  }

  const upstream = "cloudposse/github-action-setup-atmos";
  const action = process.env.GITHUB_ACTION_REPOSITORY;
  const docsUrl = "https://docs.stepsecurity.io/actions/stepsecurity-maintained-actions";

  core.info("");
  core.info("\u001b[1;36mStepSecurity Maintained Action\u001b[0m");
  core.info(`Secure drop-in replacement for ${upstream}`);
  if (repoPrivate === false) core.info("\u001b[32m\u2713 Free for public repositories\u001b[0m");
  core.info(`\u001b[36mLearn more:\u001b[0m ${docsUrl}`);
  core.info("");

  if (repoPrivate === false) return;

  const serverUrl = process.env.GITHUB_SERVER_URL || "https://github.com";
  const body: Record<string, string> = { action: action || "" };
  if (serverUrl !== "https://github.com") body.ghes_server = serverUrl;
  try {
    await axios.post(
      `https://agent.api.stepsecurity.io/v1/github/${process.env.GITHUB_REPOSITORY}/actions/maintained-actions-subscription`,
      body,
      { timeout: 3000 }
    );
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 403) {
      core.error(`\u001b[1;31mThis action requires a StepSecurity subscription for private repositories.\u001b[0m`);
      core.error(`\u001b[31mLearn how to enable a subscription: ${docsUrl}\u001b[0m`);
      process.exit(1);
    }
    core.info("Timeout or API not reachable. Continuing to next step.");
  }
}

export const run = async () => {
  try {
    await validateSubscription();
    const versionSpec = core.getInput("atmos-version");
    core.info(`Setup atmos version spec ${versionSpec}`);

    const arch = core.getInput("architecture") || os.arch();
    const installWrapper = core.getInput("install-wrapper") === "true";
    const checksumValidation = installer.parseChecksumValidationMode(core.getInput("checksum-validation"));

    const token = core.getInput("token");
    const auth = !token ? undefined : `token ${token}`;

    const { toolPath, info } = await installer.getAtmos(versionSpec, auth, arch, installWrapper, checksumValidation);

    core.info(`Successfully set up Atmos version ${versionSpec} in ${toolPath}`);

    core.setOutput("atmos-version", info?.resolvedVersion);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    core.setFailed(error instanceof Error ? error.message : `${error}`);
  }
};
