
// This port will be used by Lighthouse later. The specific port is arbitrary.
const message = require('./message');
const defaultdomain = 'school.aijianzi.com';
let messageStr = '';
let courseState = {};
let oldCourseState = {};
function concatMsg (...rest) {
  const str = rest.join('');
  console.log(str);
  messageStr += rest.join('');
}
function getUrlParameterByName(name, url) {
  if (!url) url = window.location.href;
  // name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
async function courseLearn(page, link) {
  const  url = link;
  const lessonid = getUrlParameterByName('lessonid', url);
  if (courseState[lessonid] === '回放已生成；') {
    return;
  }
  await page.goto(url);
  concatMsg('播放页面url：', url, '\r\n')
  await page.waitForSelector('.video-view', {visible: true});
  await page.waitFor(1000);
  /*
  跳转之后有三种情况 直播未开始，正在直播，回放生成中，回放已生成
  直播未开始：路由为 two-teacher-live，页面提示直播未开始
  正在直播：路由为two-teacher-live video标签有视频url
  回放生成中：路由为video，页面提示回放生成中
  回放已生成：路由为video，video标签有视频url
  */
 let realUrl = await page.evaluate(() => location.href);
//  const realUrl = page.url();
 let state = '';
  if (realUrl.indexOf('two-teacher-live') > -1) {
    const { hasVideo } = await getVideoUrl(page);
    if (hasVideo) {
      state = '正在直播；';
      concatMsg('真实状态：', state)
    } 
    else {
      state = '直播未开始；';
      concatMsg('真实状态：', state)
    }
  } else if (realUrl.indexOf('video') > -1) {
    const { videoUrl, hasVideo } = await getVideoUrl(page);
    if (hasVideo && videoUrl) {
      state = '回放已生成；';
      concatMsg('真实状态：', state, '回放视频地址：', videoUrl);
    } else {
      state = '回放上传中；';
      concatMsg('真实状态：', state);
    }
  }
  courseState[lessonid] = state;
  await page.close();
  
}
async function getVideoUrl(page) {
  const videoWrap = await page.$('.video-view');
  const video = await videoWrap.$('video');
  if (video) {
    const videoUrl = await video.evaluate(v => v.src);
    return {hasVideo: true, videoUrl};
  }
  return {hasVideo: false, videoUrl: ''};
}
const doubleSplit = '\r\n==========================\r\n';
const signleSplit = '\r\n------------------------\r\n';
const ignoreWord = /(测试)|(test)|(启航)/;
module.exports = async function schedule(browser, page, domain) {
  // const page = await browser.newPage();
  domain = domain || defaultdomain;
  await page.goto(`https://${domain}/course-center/schedule/`);
  await page.waitForSelector('.lesson-card', {visible: true});
  const courseList = await page.$$('.chapter-list .course-wrap');
  if (courseList.length === 0) return;
  concatMsg('任务执行时间：', new Date().toString('YYYY-MM-DD HH:mm:ss'));
  concatMsg(doubleSplit);
  concatMsg('今日课次数量:', courseList.length);
  concatMsg(doubleSplit);
  concatMsg('今日课次详情')
  concatMsg(signleSplit);
  for (var k = 0; k < courseList.length; k++) {
    const c = courseList[k];
    // c.$course-wrap
    // const info = await c.evaluate(node => node.innerText);
    const courseName = await c.$eval('.course-info', node => node.innerText);
    if (ignoreWord.test(courseName)) {
      continue;
    }
    const info = await c.$eval('.info', node => node.innerText);
    if (info) {
      concatMsg(info, '\r\n');
    }

    let studyBtn = await c.$('.btn-study');
    let link = '';
    if (studyBtn) {
      link = await studyBtn.evaluate(btn => btn.href);
    }
    if (!link) {
      concatMsg(signleSplit);
      continue;
    }
    link = link.replace(/#\/(.*)[?]/, '/#/two-teacher-live?');
    try {
      const newPage = await browser.newPage();
      await courseLearn(newPage, link);
    } catch (ex) {
      console.log(ex);
    }
    concatMsg(signleSplit);
    await page.waitFor(2000);
  }
  if (JSON.stringify(courseState) !== JSON.stringify(oldCourseState)) {
    message(messageStr);
    console.warn('send');
    oldCourseState = { ...courseState };
  } else {
    console.warn('not send');
  }
  messageStr = '';
}


