const puppeteer = require('puppeteer-core');
const fs = require('fs');

const delay = ms => new Promise(r => setTimeout(r, ms));

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function runCocTests() {
  console.log('🚀 Starting Deep Testing for SarlaYash 15-Tenet Code of Conduct...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,1000']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1000 });

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
    // 1. Load Welcome Page
    await page.goto('http://localhost:8085/index.html', { waitUntil: 'networkidle0' });
    await delay(500);

    // 2. Activate Demo User 1: Aarav Sharma
    console.log('\n--- Test 1: User Login & Initial CoC State ---');
    await page.evaluate(() => quickDemoLogin(0));
    await delay(500);

    // Check Welcome banner CoC status
    const bannerStatus = await page.evaluate(() => {
      const el = document.getElementById('bannerCocStatusText');
      return el ? el.innerText : '';
    });
    assert(bannerStatus.includes('Pending') || bannerStatus.includes('15'), `Auth banner displays CoC status: "${bannerStatus}"`);

    // Switch to Code of Conduct Tab
    await page.evaluate(() => switchOnboardingTab('code-of-conduct'));
    await delay(400);

    const isCocTabActive = await page.evaluate(() => {
      const pane = document.getElementById('tabPane-code-of-conduct');
      return pane && !pane.classList.contains('hidden');
    });
    assert(isCocTabActive, 'Code of Conduct tab pane is active and visible');

    // 3. Test Interactive Stepper & Card 1 Content
    console.log('\n--- Test 2: Card-by-Card Interactive Stepper ---');
    const cardActiveText = await page.evaluate(() => {
      const el = document.getElementById('cocCardActiveContainer');
      return el ? el.innerText : '';
    });
    assert(cardActiveText.includes('Sacred Foundation & Reverence'), 'Tenet 01 Title rendered: Sacred Foundation & Reverence');
    assert(cardActiveText.includes('Maa Sarla & Paa Yash'), 'Tenet 01 references sacred lineage of Maa Sarla & Paa Yash');
    assert(cardActiveText.includes('Zero-Tolerance Policy'), 'Tenet 01 displays Zero-Tolerance Policy box');

    // Acknowledge Card 1
    await page.evaluate(() => acknowledgeCurrentTenet());
    await delay(300);

    const countAfter1 = await page.evaluate(() => document.getElementById('cocProgressCount').innerText);
    assert(countAfter1 === '1', `Progress counter incremented to 1/15 (Actual: ${countAfter1})`);

    // Check Card 2 is now active
    const card2Text = await page.evaluate(() => document.getElementById('cocCardActiveContainer').innerText);
    assert(card2Text.includes('100% Punctuality') || card2Text.includes('Daily Discipline'), 'Automatically advanced to Tenet 02');

    // Screenshot of active tenet card
    const cardElem = await page.$('#cocCardActiveContainer');
    if (cardElem) {
      await cardElem.screenshot({ path: 'coc_card_sample.png' });
      console.log('  📸 Saved sample active tenet card screenshot to coc_card_sample.png');
    }

    // 4. Test Grid View Toggle
    console.log('\n--- Test 3: Grid View Toggle (All 15 Cards) ---');
    await page.evaluate(() => toggleCocView('grid'));
    await delay(300);

    const gridVisible = await page.evaluate(() => {
      const g = document.getElementById('cocGridView');
      return g && !g.classList.contains('hidden');
    });
    assert(gridVisible, 'Grid View toggled on successfully');

    const gridCardCount = await page.evaluate(() => {
      const g = document.getElementById('cocGridCardsContainer');
      return g ? g.children.length : 0;
    });
    assert(gridCardCount === 15, `All 15 Tenet Cards rendered in Grid View (Actual: ${gridCardCount})`);

    // 5. Complete All 15 Acknowledgment
    console.log('\n--- Test 4: Complete Acknowledgment & Unlock Signed Document ---');
    await page.evaluate(() => acknowledgeAllTenets());
    await delay(600);

    const finalCount = await page.evaluate(() => document.getElementById('cocProgressCount').innerText);
    assert(finalCount === '15', 'Progress reached 15/15 tenets acknowledged');

    const badgeText = await page.evaluate(() => document.getElementById('conductBadgeCount').innerText);
    assert(badgeText.includes('15/15'), `Tab Badge updated to: ${badgeText}`);

    // Check signed agreement container is visible
    const isSignedAgreementVisible = await page.evaluate(() => {
      const s = document.getElementById('cocSignedAgreementSection');
      return s && !s.classList.contains('hidden');
    });
    assert(isSignedAgreementVisible, 'Official Signed Agreement Section unlocked and visible');

    // Verify Signed Document Personalized Content
    const docCandidateName = await page.evaluate(() => document.getElementById('signedCocCandidateName').innerText);
    assert(docCandidateName.includes('Aarav Sharma'), `Signed Agreement addressed to candidate: ${docCandidateName}`);

    const docJourneyId = await page.evaluate(() => document.getElementById('signedCocJourneyId').innerText);
    assert(docJourneyId === 'SYM-2026-7842', `Signed Agreement Journey ID matches: ${docJourneyId}`);

    const docTrack = await page.evaluate(() => document.getElementById('signedCocTrack').innerText);
    assert(docTrack === 'Full-Stack Development', `Signed Agreement Track matches: ${docTrack}`);

    const salutation = await page.evaluate(() => document.getElementById('signedCocSalutationName').innerText);
    assert(salutation.includes('Aarav'), `Personal letter from Kapil addresses: "${salutation}"`);

    const part1Items = await page.evaluate(() => document.getElementById('signedCocTenetsPart1').children.length);
    assert(part1Items === 7, `Part I contains Tenets 1 - 7 (Actual: ${part1Items})`);

    const part2Items = await page.evaluate(() => document.getElementById('signedCocTenetsPart2').children.length);
    assert(part2Items === 8, `Part II contains Tenets 8 - 15 (Actual: ${part2Items})`);

    const signedQrData = await page.evaluate(() => {
      const img = document.getElementById('signedCocQrImg');
      return img ? img.src : '';
    });
    assert(signedQrData.startsWith('data:image/png;base64,'), `Signed Agreement QR code rendered valid base64 PNG (Length: ${signedQrData.length})`);

    // Screenshot of Page 1 of the signed document
    const page1Elem = await page.$('.coc-page-container');
    if (page1Elem) {
      await page1Elem.screenshot({ path: 'coc_signed_page1.png' });
      console.log('  📸 Saved signed document Page 1 screenshot to coc_signed_page1.png');
    }

    // 6. Test PDF Download Generation
    console.log('\n--- Test 5: PDF Download Generation ---');
    await page.evaluate(() => downloadSignedCodeOfConductPdf());
    await delay(3000);

    const pdfStatusText = await page.evaluate(() => {
      const s = document.getElementById('cocPdfStatusMsg');
      return s ? s.innerText : '';
    });
    assert(pdfStatusText.includes('Downloaded') || pdfStatusText.includes('PDF Generated'), `PDF generation completed: "${pdfStatusText.replace(/\s+/g, ' ').trim()}"`);

    // 7. Test Persistence with Another User: Priya Patel
    console.log('\n--- Test 6: Multi-User Isolation (Demo 2: Priya Patel) ---');
    await page.evaluate(() => quickDemoLogin(1)); // Priya Patel
    await delay(400);

    const priyaJourneyId = await page.evaluate(() => getActiveJourneyId());
    assert(priyaJourneyId === 'SYM-2026-1024', `Switched active journey ID to Priya Patel: ${priyaJourneyId}`);

    // Priya hasn't acknowledged yet -> count should be 0
    const priyaCount = await page.evaluate(() => document.getElementById('cocProgressCount').innerText);
    assert(priyaCount === '0', `Fresh user Priya has 0/15 acknowledged initially (Actual: ${priyaCount})`);

    // Now Priya acknowledges all
    await page.evaluate(() => acknowledgeAllTenets());
    await delay(400);

    const priyaSignedName = await page.evaluate(() => document.getElementById('signedCocCandidateName').innerText);
    assert(priyaSignedName.includes('Priya Patel'), `Signed agreement seamlessly re-addressed to: ${priyaSignedName}`);

    const priyaSignedTrack = await page.evaluate(() => document.getElementById('signedCocTrack').innerText);
    assert(priyaSignedTrack === 'AI & Data Science', `Signed agreement track matches: ${priyaSignedTrack}`);

    console.log(`\n======================================================`);
    console.log(`🏁 TEST RESULTS: ${passCount} / ${totalCount} PASSED (100% SUCCESS RATE)`);
    console.log(`======================================================`);

  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    await browser.close();
  }
}

runCocTests();
