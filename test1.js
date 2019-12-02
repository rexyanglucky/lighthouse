const lighthouse = require('lighthouse');
const puppeteer = require('puppeteer');
const config = require('./desktop-config');
const login = require('./login');

const PORT = 49435;

const opts = {
  chromeFlags: [`--remote-debugging-port=${PORT}`,  '--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'], 
  port: PORT, userDataDir: '/Users/rex/Library/Application Support/Google/Chrome',
  onlyCategories: ['performance']
  // handleSIGINT: false
};

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
    slowMo: 50,
  });

  // Setup the browser session to be logged into our site.
  await login(browser);

  // const urlArr = [
  //   // 'https://www.aijianzi.com',
  //   'https://school.aijianzi.com/course-center/student/courses/',
  //   // 'https://school.aijianzi.com/course-learn/#/video?lessonid=10293&chapterid=-1&courseid=914&p=1'
  // ]
  // urlArr.forEach(async (url) => {
  //   await lighthouse(url, opts, config);
  //   // const result = await lighthouse(url, opts);
  //   // console.log(JSON.stringify(result.lhr, null, 2));
  // })
  // await browser.close();
}
main();