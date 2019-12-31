
// This port will be used by Lighthouse later. The specific port is arbitrary.

const url = 'school135.aijianzi.com';
const account = {
  mobile: '18888880021',
  pwd: 'qastudent'
}
/**
 * @param {import('puppeteer').Browser} browser
 */
module.exports = async function login(browser, domain) {
  const page = await browser.newPage();
  domain = domain || url;
  await page.goto(`https://${domain}/account/?role=student&to=login`);
  await page.waitForSelector('#login-student input[type="text"]', {visible: true});

  // Fill in and submit login form.
  const mobilInput = await page.$('#login-student input[type="text"]');
  await mobilInput.type(account.mobile);
  const passwordInput = await page.$('#login-student input[type="password"]');
  await passwordInput.type(account.pwd);
  await Promise.all([
    page.$eval("#login-student .ajz-btn-account", btn => btn.click()),
    page.waitForNavigation(),
  ]);
  return page;
  // await page.close();
}
