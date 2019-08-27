// from https://github.com/webdriverio/webdriverio/blob/master/packages/wdio-concise-reporter/src/index.js#L108-L125
module.exports = function getEnviromentCombo(capabilities) {
  const device = capabilities.deviceManufacturer
    ? `${capabilities.deviceManufacturer} ${capabilities.deviceModel}`
    : capabilities.deviceName;
  const browser = capabilities.browserName || capabilities.browser;
  const version = capabilities.version || capabilities.browser_version || capabilities.browserVersion;
  const platform = capabilities.os
    ? (capabilities.os + ' ' + capabilities.os_version)
    : (capabilities.platformName || capabilities.platform) + ' ' + (capabilities.platformVersion || '');

  // mobile capabilities
  if (device) {
    const program = (capabilities.app || '').replace('sauce-storage:', '') || capabilities.browserName;
    const executing = program ? `executing ${program} ${version ? ` (v${version})` : ''}` : '';

    return `${device} on ${platform} ${executing}`.trim()
  }

  return browser
    + (version ? ` (v${version})` : '')
    + (platform ? ` on ${platform}` : '')
};