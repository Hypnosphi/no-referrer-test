const {expect} = require('chai');

const getWindowCount = async () => (await browser.getWindowHandles()).length

function test({title, linkId, expectToHaveOpener}) {
  it(title, async () => {
    await browser.url('');
    if (linkId != null) {
      const link = await $(`#${linkId}`);
      const windowCount = await getWindowCount();
      await link.click();

      // Handle iOS confirmation popup
      try {
        const contexts = await browser.getContexts();
        if (contexts.includes('NATIVE_APP')) {
          const prevContext = await browser.getContext();
          await browser.switchContext('NATIVE_APP');
          const allow = await $('~Allow');
          if (allow != null) {
            await allow.click();
          }
          await browser.switchContext(prevContext)
        }
        // await browser.acceptAlert()
      } catch (e) {}

      await browser.waitUntil(async () => {
        const newWindowCount = await getWindowCount();
        return newWindowCount > windowCount;
      });
      await browser.switchWindow(`#${linkId}`);
    }

    const hasOpener = await browser.execute(function() {
      return window.opener != null;
    });
    expect(hasOpener).to.equal(expectToHaveOpener);
  });
}

describe('window.opener', () => {
  test({
    title: 'should be null on a fresh page',
    expectToHaveOpener: false,
  });
  test({
    title: 'should be present after clicking a link with rel="opener"',
    linkId: 'opener',
    expectToHaveOpener: true
  });
  test({
    title: 'should be null after clicking a link with rel="noreferrer noopener"',
    linkId: 'noreferrer-noopener',
    expectToHaveOpener: false
  });
  test({
    title: 'should be null after clicking a link with rel="noreferrer"',
    linkId: 'noreferrer',
    expectToHaveOpener: false
  });
});
