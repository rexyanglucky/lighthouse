/**
 * @license Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/** @type {LH.Config.Json} */
const config = {
  extends: 'lighthouse:default',
  settings: {
    maxWaitForFcp: 15 * 1000,
    maxWaitForLoad: 35 * 1000,
    emulatedFormFactor: 'desktop',
    disableStorageReset: true,
    throttling: {
    
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4,

      // rttMs: 40,
      // throughputKbps: 10 * 1024,
      // cpuSlowdownMultiplier: 1,
    },
    // Skip the h2 audit so it doesn't lie to us. See https://github.com/GoogleChrome/lighthouse/issues/6539
    // skipAudits: ['uses-http2'],
    onlyCategories: ['performance'],
  },
  // audits: [
  //   // 75th and 95th percentiles -> median and PODR
  //   // SELECT QUANTILES(renderStart, 21) FROM [httparchive:summary_pages.2018_12_15_desktop] LIMIT 1000
  //   {path: 'metrics/first-contentful-paint', options: {scorePODR: 800, scoreMedian: 1600}},
  //   {path: 'metrics/first-meaningful-paint', options: {scorePODR: 800, scoreMedian: 1600}},
  //   // 75th and 95th percentiles -> median and PODR
  //   // SELECT QUANTILES(SpeedIndex, 21) FROM [httparchive:summary_pages.2018_12_15_desktop] LIMIT 1000
  //   {path: 'metrics/speed-index', options: {scorePODR: 1100, scoreMedian: 2300}},
  //   // 75th and 95th percentiles -> median and PODR
  //   // SELECT QUANTILES(fullyLoaded, 21) FROM [httparchive:summary_pages.2018_12_15_desktop] LIMIT 1000
  //   {path: 'metrics/interactive', options: {scorePODR: 2000, scoreMedian: 4500}},
  //   {path: 'metrics/first-cpu-idle', options: {scorePODR: 2000, scoreMedian: 4500}},
  // ],
  onlyAudits: [
    'first-meaningful-paint',
    'speed-index',
    'first-cpu-idle',
    'interactive',
  ],
  categories: {
    performance: {
      "name": "Performance Metrics",
      "description": "These encapsulate your web app's performance.",
    }
  }
};

module.exports = config;
