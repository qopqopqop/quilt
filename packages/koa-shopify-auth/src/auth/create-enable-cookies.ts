import {readFileSync} from 'fs';
import {join} from 'path';
import {Context} from 'koa';

import Error from './errors';
import {OAuthStartOptions} from '../types';

const HEADING = 'Enable cookies';
const BODY =
  'You must manually enable cookies in this browser in order to use this app within Shopify.';
const FOOTER = `Cookies let the app authenticate you by temporarily storing your preferences and personal
information. They expire after 30 days.`;
const ACTION = 'Enable cookies';

const CSS = readFileSync(join(__dirname, '../../client/auth.css')).toString();

export default function createEnableCookies(
  {apiKey}: OAuthStartOptions,
  script: string,
) {
  return function enableCookies(ctx: Context) {
    const {query} = ctx;
    const {shop} = query;

    if (shop == null) {
      ctx.throw(400, Error.ShopParamMissing);
      return;
    }

    ctx.body = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <style>
    ${CSS}
  </style>
  <base target="_top">
  <title>Redirecting…</title>

  <script>
    window.apiKey = "${apiKey}";
    window.shopOrigin = "https://${shop}";
    window.redirectUrl = "${ctx.state.authRoute}?shop=${shop}";
  </script>
</head>
<body>
  <main id="CookiePartitionPrompt" class="hide">
    <div class="Polaris-Page">
      <div class="Polaris-Page__Content">
        <div class="Polaris-Layout">
          <div class="Polaris-Layout__Section">
            <div class="Polaris-Stack Polaris-Stack--vertical">
              <div class="Polaris-Stack__Item">
                <div class="Polaris-Card">
                  <div class="Polaris-Card__Header">
                    <h1 class="Polaris-Heading">${HEADING}</h1>
                  </div>
                  <div class="Polaris-Card__Section">
                    <p>${BODY}</p>
                  </div>
                  <div class="Polaris-Card__Section Polaris-Card__Section--subdued">
                    <p>${FOOTER}</p>
                  </div>
                </div>
              </div>
              <div class="Polaris-Stack__Item">
                <div class="Polaris-Stack Polaris-Stack--distributionTrailing">
                  <div class="Polaris-Stack__Item">
                    <button type="button" class="Polaris-Button Polaris-Button--primary" id="AcceptCookies">
                      <span class="Polaris-Button__Content"><span>${ACTION}</span></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <script>
  ${script}
  </script>
</body>
</html>`;
  };
}
