const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');
(async () => {
  fs.mkdirSync('test-results', { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  let posts=0;page.on('request',request=>{if(request.method()==='POST')posts++;});
  try {
    const response=await page.goto('http://127.0.0.1:4173');assert.equal(response.status(),200);
    for(const width of [320,375,425,768,1024,1440]) {
      await page.setViewportSize({width,height:900});
      await page.evaluate(async()=>{for(const img of document.images){if(!img.getAttribute("src"))continue;img.loading='eager';await img.decode();}});
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Horizontal overflow at ${width}`);
      await page.screenshot({path:`test-results/${width}.png`,fullPage:true});
      console.log(`PASS layout and images ${width}px`);
    }
    assert(await page.evaluate(()=>[...document.querySelectorAll('a[href^="#"]')].every(a=>a.hash===''||document.getElementById(a.hash.slice(1)))));
    await page.locator('#menu a[href="#plantas"]').click();assert.equal(new URL(page.url()).hash,'#plantas');
    await page.setViewportSize({width:375,height:812});
    await page.locator('.menu-toggle').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
    await page.locator('#menu a[href="#galeria"]').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
    await page.locator('[data-gallery="0"]').click();assert(await page.locator('#media-modal').evaluate(e=>e.open));
    await page.locator('#next').click();assert.equal(await page.locator('#modal-count').textContent(),'2 / 8');
    await page.keyboard.press('ArrowLeft');assert.equal(await page.locator('#modal-count').textContent(),'1 / 8');
    await page.locator('#previous').click();assert.equal(await page.locator('#modal-count').textContent(),'8 / 8');
    for(let i=0;i<6;i++){await page.keyboard.press('Tab');assert(await page.evaluate(()=>!!document.activeElement.closest('#media-modal')));}
    await page.keyboard.press('Escape');assert.equal(await page.locator('#media-modal').evaluate(e=>e.open),false);
    assert.equal(await page.evaluate(()=>document.activeElement.dataset.gallery),'0');
    for(const id of ['a','b','c']){await page.locator(`[data-plan="${id}"]`).click();assert(await page.locator('#modal-image').getAttribute('src').then(s=>s.endsWith(`planta-${id}.svg`)));await page.keyboard.press('Escape');}
    assert.equal(await page.locator('#interest').inputValue(),'Apartamento 3 quartos + suíte');
    await page.locator('.floating-wa').click();assert((await page.locator('#wa-message').textContent()).includes('118 m²'));await page.locator('#wa-ok').click();
    await page.locator('.submit').click();assert.equal(await page.locator('#name').getAttribute('aria-invalid'),'true');
    await page.locator('#name').fill('Pessoa de Teste');await page.locator('#phone').fill('123');await page.locator('#email').fill('invalido');await page.locator('.submit').click();assert.equal(await page.locator('#phone').getAttribute('aria-invalid'),'true');assert.equal(await page.locator('#email').getAttribute('aria-invalid'),'true');
    await page.locator('#phone').fill('(11) 99999-9999');await page.locator('#email').fill('teste@example.com');await page.locator('#consent').check();await page.locator('.submit').click();assert((await page.locator('#form-feedback').textContent()).includes('modo demonstrativo'));assert.equal(posts,0);assert.equal(await page.locator('#name').inputValue(),'');
    await page.locator('.back-top').click();assert.equal(await page.evaluate(()=>scrollY),0);
    await page.goto(pathToFileURL(path.resolve('index.html')).href);assert.equal(await page.locator('.gallery-item').count(),8);await page.locator('[data-gallery="0"]').click();assert(await page.locator('#modal-image').evaluate(e=>e.complete&&e.naturalWidth>0));await page.keyboard.press('Escape');
    assert.deepEqual(errors,[]);console.log('PASS desktop/mobile navigation, anchors, gallery, keyboard, focus, plans, WhatsApp, form validation, demo privacy, back-to-top, file:// and console');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});

