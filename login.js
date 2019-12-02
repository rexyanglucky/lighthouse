
// This port will be used by Lighthouse later. The specific port is arbitrary.

/**
 * @param {import('puppeteer').Browser} browser
 */
module.exports = async function login(browser) {
  const page = await browser.newPage();
  await page.goto('https://school.aijianzi.com/account/?role=student&to=login');
  console.log(1);
  await page.waitForSelector('#login input[type="text"]', {visible: true});

  // Fill in and submit login form.
  const mobilInput = await page.$('#login input[type="text"]');
  await mobilInput.type('18888880021');
  const passwordInput = await page.$('input[type="password"]');
  await passwordInput.type('qastudent');
  await Promise.all([
    // page.$eval('#login', form => form.submit()),
    page.$eval(".ajz-btn-account", btn => btn.click()),
    page.waitForNavigation(),
  ]);
  // await page.close();
}
