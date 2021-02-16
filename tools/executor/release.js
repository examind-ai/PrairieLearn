#!/usr/bin/env node
// @ts-check
const { execa, getImageName, loginToEcr, getEcrRegistryUrl } = require('./util');

(async () => {
  const imageName = await getImageName();

  console.log('Pushing image to Docker registry');
  await execa('docker', ['push', imageName]);

  const ecrRegistryUrl = await getEcrRegistryUrl();
  await loginToEcr();

  console.log('Pushing image to ECR registry');
  const ecrImageName = `${ecrRegistryUrl}/${imageName}`;
  await execa('docker', ['tag', imageName, ecrImageName]);
  await execa('docker', ['push', ecrImageName]);
})().catch(e => {
  console.error(e);
  process.exit(1);
});