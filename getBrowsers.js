require('dotenv').config();
const fs = require('fs-extra');

const BrowserStack = require("browserstack");

const browsers = BrowserStack
  .createClient({
    username: process.env.BROWSERSTACK_USER,
    password: process.env.BROWSERSTACK_ACCESSKEY
  })
  .getBrowsers((_, data) => {
    const browsers = data
      // Skip Android because of "Window related commands are currently not supported for android devices" error
      .filter(({os}) => os !== 'android')
      // Opera not supported
      .filter(({browser}) => browser !== 'opera')
      .map(datum => datum.os === 'ios'
        ? {...datum, 'browserstack.appium_version': '1.14.0'}
        : datum
      );
    fs.writeJson('browsers.json', browsers, {spaces: 2});
  });
