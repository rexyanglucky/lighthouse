const puppeteer = require('puppeteer');
const login = require('./login');
const schedule = require('./schedule');

const PORT = 49435;
const opts = {
  chromeFlags: [`--remote-debugging-port=${PORT}`,  '--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'], 
  port: PORT, 
  userDataDir: '/Users/rex/Library/Application Support/Google/Chrome',
  onlyCategories: ['performance']
  // handleSIGINT: false
};


const domain = 'school.aijianzi.com';

async function main() {
  // Direct Puppeteer to open Chrome with a specific debugging port.
  const browser = await puppeteer.launch({
    args: opts.chromeFlags,
    // Optional, if you want to see the tests in action.
    headless: false,
    defaultViewport: {
      /**
       * page width in pixels.
       */
      width: 1200,
      /**
       * page height in pixels.
       */
      height: 1000,
    },
    slowMo: 100,
  });

  // Setup the browser session to be logged into our site.
  try {
    const page = await login(browser, domain);
    await schedule(browser, page, domain);
    await browser.close();
  } catch (ex) {
    console.log(ex);
  }
  setTimeout(async () => {
    await main();
  }, 1000 * 60 * 5);
}
main();