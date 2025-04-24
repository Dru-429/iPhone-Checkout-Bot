const puppeteer = require("puppeteer-extra");
const locateChrome = require("chrome-location");

const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { executablePath } = require("puppeteer");
puppeteer.use(StealthPlugin());

const url = "https://www.apple.com/in/shop/buy-iphone/iphone-16";

const givePage = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: locateChrome,
  });
  let page = await browser.newPage();
  return page;
};

async function clickBtn(page, selector, delay = 0) {
  await page.waitForSelector(selector);
  await page.evaluate((s) => document.querySelector(s).click(), selector);

  if (delay > 0) {
    await new Promise((res) => setTimeout(res, delay));
  }
}

async function run() {
  console.log("Starting....");
  const page = await givePage();
  await page.goto(url);
  await add_to_cart(page);
  await shipping(page)
}

async function add_to_cart(page) {
  await clickBtn(page, "input[data-autom='dimensionScreensize6_1inch'], 2000");
  await clickBtn(page, "input[value='black']", 1500);
  await clickBtn(page, "input[data-autom='dimensionCapacity256gb']", 2000);

  await clickBtn(page, "[id='noTradeIn']", 1500);
  await clickBtn(page, "[id='applecareplus_58_noapplecare']", 1500);
  await clickBtn(page, "button[data-autom='add-to-cart']", 5000);

}

async function shipping(page) {
  let selector = "button[name='proceed']";
  await clickBtn(page, selector);
  await clickBtn(page, "[id='shoppingCart.actions.navCheckout']", 1500);
  await clickBtn(page, "[id='signIn.guestLogin.guestLogin']", 1500);
  await clickBtn(page, "[id='rs-checkout-continue-button-bottom']", 1500);

  //form for address
  selector =
    "input[id='checkout.shipping.addressSelector.newAddress.address.firstName']";
  await page.waitForSelector(selector);
  await page.type(selector, "Dru");

  await page.type("input[name='lastName']", "Sahoo");
  await page.type("input[name='street']", "8204 Baltimore Avenue");

  // Zip code handling
  const input = await page.$("input[name='postalCode']");
  await input.click({ clickCount: 3 });
  await input.type("110017");

  await page.type("input[name='emailAddress']", "sahoo.dru@gmail.com");
  await new Promise((r) => setTimeout(r, 1500));

  await page.type("input[name='mobilePhone']", "1234567890");
  await new Promise((r) => setTimeout(r, 2000));

  await page.click("#rs-checkout-continue-button-bottom");
}

run();
