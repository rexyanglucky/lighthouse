const launch = require('./index');
const fs = require('fs');

const config = require('./desktop-config');

// const PORT = 9002;

// const opts = {port: PORT, userDataDir: false};
// chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox']
const opts = { userDataDir: '/Users/rex/Library/Application Support/Google/Chrome/Default',
 startingUrl: "https://school.aijianzi.com",
 onlyCategories: ['performance'],
output: 'html' };

async function main() {
  const urlArr = [
    // 'https://www.aijianzi.com',
    'https://school.aijianzi.com/course-center/student/courses/',
    // 'https://school.aijianzi.com/course-learn/#/video?lessonid=10293&chapterid=-1&courseid=914&p=1'
  ]
  urlArr.forEach(async (url, index) => {
    const result = await launch(url, opts, config);
    if (result.lhr && fs.existsSync(url)) {
      fs.unlinkSync(`./${index}.js`);
    }
    fs.appendFileSync(`./${index}.js`, JSON.stringify(result.report, null, 2));
  })
}
main();