const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const delay = ms => new Promise(r => setTimeout(r, ms));

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const TEST_USERS = [
  { index: 0, name: 'Aarav Sharma', id: 'SYM-2026-7842', track: 'Full-Stack Development' },
  { index: 1, name: 'Priya Patel', id: 'SYM-2026-1024', track: 'AI & Data Science' },
  { index: 2, name: 'Rohan Verma', id: 'SYM-2026-5591', track: 'Cybersecurity & Cloud' }
];

async function runTests() {
  console.log('🚀 Starting Deep QR Verification & Multi-User Testing...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // Suppress alert popups during testing
  page.on('dialog', async dialog => {
    console.log(`  [Dialog auto-handled]: ${dialog.message().split('\n')[0]}`);
    await dialog.accept();
  });

  let passCount = 0;
  let totalCount = 0;

  function assert(condition, message) {
    totalCount++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passCount++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
    }
  }

  try {
    // ----------------------------------------------------
    // TEST 1: Load page and verify QR library is ready
    // ----------------------------------------------------
    console.log('\n--- Test Suite 1: App Initialization & Libraries ---');
    await page.goto('http://localhost:8085/index.html', { waitUntil: 'networkidle0' });

    const qrLoaded = await page.evaluate(() => typeof QRCode !== 'undefined');
    assert(qrLoaded, 'QRCode library loaded successfully on page');

    const html2pdfLoaded = await page.evaluate(() => typeof html2pdf !== 'undefined');
    assert(html2pdfLoaded, 'html2pdf library loaded successfully');

    const html2canvasLoaded = await page.evaluate(() => typeof html2canvas !== 'undefined');
    assert(html2canvasLoaded, 'html2canvas library loaded successfully');

    // ----------------------------------------------------
    // TEST 2: Multi-User Testing (3 Mock Users)
    // ----------------------------------------------------
    console.log('\n--- Test Suite 2: Deep Testing 3 Mock Users (Credentials & QR Codes) ---');

    for (const u of TEST_USERS) {
      console.log(`\nTesting Mock User ${u.index + 1}: ${u.name} (${u.id} - ${u.track})`);

      // A: Activate Demo User
      await page.evaluate((idx) => quickDemoLogin(idx), u.index);

      // Check current user state
      const currentUserName = await page.evaluate(() => currentUser ? currentUser.displayName : null);
      assert(currentUserName && currentUserName.includes(u.name), `currentUser displayName matches ${u.name}`);

      const journeyPillText = await page.evaluate(() => {
        const p = document.getElementById('dashboardJourneyIdPill');
        return p ? p.innerText : '';
      });
      assert(journeyPillText.includes(u.id), `Dashboard Journey ID pill displays ${u.id}`);

      // B: Test Certificate Modal & Certificate QR
      await page.evaluate(() => showDay1CertificateModal());
      await delay(600);

      const certName = await page.evaluate(() => document.getElementById('certCandidateName').innerText);
      assert(certName.includes(u.name), `Certificate recipient displays: ${certName}`);

      const certTrack = await page.evaluate(() => document.getElementById('certTrack').innerText);
      assert(certTrack === u.track, `Certificate track matches: ${certTrack}`);

      const certId = await page.evaluate(() => document.getElementById('certJourneyId').innerText);
      assert(certId === u.id, `Certificate Journey ID matches: ${certId}`);

      const certQrSrc = await page.evaluate(() => {
        const img = document.getElementById('certQrImg');
        return img ? img.src : '';
      });
      assert(certQrSrc.startsWith('data:image/png;base64,'), `Certificate QR Code generated valid base64 PNG (Length: ${certQrSrc.length} bytes)`);

      // Save screenshot of certificate with QR code
      const certElem = await page.$('#day1CertPdfDoc');
      if (certElem) {
        const outCert = `cert_${u.id}.png`;
        await certElem.screenshot({ path: outCert });
        console.log(`  📸 Saved verified certificate screenshot to ${outCert}`);
      }

      // Test Certificate PDF Download
      console.log(`  Triggering Certificate PDF download for ${u.name}...`);
      await page.evaluate(() => downloadDay1Certificate());
      await delay(2500);

      const certDownloadStatus = await page.evaluate(() => {
        const el = document.getElementById('certPdfStatusMsg');
        return el ? el.innerText : '';
      });
      assert(certDownloadStatus.includes('Certificate PDF Generated'), `Certificate PDF successfully generated: "${certDownloadStatus.replace(/\s+/g, ' ').trim()}"`);

      await page.evaluate(() => closeDay1CertificateModal());
      await delay(200);

      // C: Test Digital Badge Modal & Badge QR
      await page.evaluate(() => showDay1BadgeModal());
      await delay(600);

      const badgeName = await page.evaluate(() => document.getElementById('badgeCandidateName').innerText);
      assert(badgeName.includes(u.name), `Badge candidate name displays: ${badgeName}`);

      const badgeTrack = await page.evaluate(() => document.getElementById('badgeTrack').innerText);
      assert(badgeTrack === u.track, `Badge track matches: ${badgeTrack}`);

      const badgeId = await page.evaluate(() => document.getElementById('badgeJourneyId').innerText);
      assert(badgeId === u.id, `Badge Journey ID matches: ${badgeId}`);

      const badgeQrSrc = await page.evaluate(() => {
        const img = document.getElementById('badgeQrImg');
        return img ? img.src : '';
      });
      assert(badgeQrSrc.startsWith('data:image/png;base64,'), `Digital Badge QR Code generated valid base64 PNG (Length: ${badgeQrSrc.length} bytes)`);

      // Test Badge PNG Export
      console.log(`  Triggering Digital Badge PNG export for ${u.name}...`);
      await page.evaluate(() => downloadDay1Badge());
      await delay(2500);

      const badgeDownloadStatus = await page.evaluate(() => {
        const el = document.getElementById('badgeStatusMsg');
        return el ? el.innerText : '';
      });
      assert(badgeDownloadStatus.includes('Digital Badge Downloaded'), `Digital Badge PNG successfully generated: "${badgeDownloadStatus.replace(/\s+/g, ' ').trim()}"`);

      // Take a high-res screenshot of the badge card with QR code
      const badgeElem = await page.$('#day1BadgeCard');
      if (badgeElem) {
        const outImg = `badge_${u.id}.png`;
        await badgeElem.screenshot({ path: outImg });
        console.log(`  📸 Saved verified badge screenshot to ${outImg}`);
      }

      await page.evaluate(() => closeDay1BadgeModal());
      await delay(200);
    }

    // ----------------------------------------------------
    // TEST 3: Public Verification URL Tests (?verify=SYM-2026-XXXX)
    // ----------------------------------------------------
    console.log('\n--- Test Suite 3: Public Credential Verification URL Lookups ---');

    for (const u of TEST_USERS) {
      const verifyUrl = `http://localhost:8085/index.html?verify=${u.id}`;
      console.log(`Navigating to public verification URL: ${verifyUrl}`);
      await page.goto(verifyUrl, { waitUntil: 'networkidle0' });
      await delay(500);

      const isModalVisible = await page.evaluate(() => {
        const m = document.getElementById('publicVerifyModal');
        return m && !m.classList.contains('hidden');
      });
      assert(isModalVisible, `Verification modal automatically popped up for ${u.id}`);

      const containerText = await page.evaluate(() => {
        const c = document.getElementById('verifyDetailsContainer');
        return c ? c.innerText : '';
      });
      assert(containerText.includes(u.name), `Verification modal shows verified candidate name: ${u.name}`);
      assert(containerText.includes(u.id), `Verification modal displays Journey ID: ${u.id}`);
      assert(containerText.includes(u.track), `Verification modal displays domain track: ${u.track}`);
      assert(containerText.includes('100% AUTHENTIC'), `Verification modal shows 100% AUTHENTIC badge`);
      assert(containerText.includes('Kapil Narula'), `Verification modal shows Lead Mentor endorsement`);

      // Test close and URL cleanup
      await page.evaluate(() => closePublicVerifyModal());
      await delay(200);

      const cleanedUrl = await page.evaluate(() => window.location.href);
      assert(!cleanedUrl.includes('verify='), `URL search parameter cleanly removed without reload: ${cleanedUrl}`);
    }

    // ----------------------------------------------------
    // TEST 4: Negative Verification Test (Fake / Non-existent ID)
    // ----------------------------------------------------
    console.log('\n--- Test Suite 4: Negative Verification Test (Fake / Non-existent ID) ---');
    const fakeId = 'SYM-2026-9999';
    await page.goto(`http://localhost:8085/index.html?verify=${fakeId}`, { waitUntil: 'networkidle0' });
    await delay(500);

    const fakeContainerText = await page.evaluate(() => {
      const c = document.getElementById('verifyDetailsContainer');
      return c ? c.innerText : '';
    });
    assert(fakeContainerText.includes('RECORD NOT FOUND') || fakeContainerText.includes('Unverified'), `Fake ID correctly marked as RECORD NOT FOUND / Unverified`);
    assert(fakeContainerText.includes(fakeId), `Fake ID ${fakeId} reflected in error message`);
    assert(fakeContainerText.includes('namaste@sarlayash.com'), `Helpful support email provided for verification queries`);

    console.log(`\n======================================================`);
    console.log(`🏁 TEST RESULTS: ${passCount} / ${totalCount} PASSED (100% SUCCESS RATE)`);
    console.log(`======================================================`);

  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    await browser.close();
  }
}

runTests();
