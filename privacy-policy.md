# Privacy Policy for Shirabeyou

**Last updated:** August 2, 2026

Shirabeyou ("the extension," "the app," "we," "our") is a Japanese kanji learning tool consisting of a Chrome browser extension, a mobile app, and a supporting backend service. This policy explains what information we collect, how we use it, and your choices.

## Information We Collect

**Account information.** When you create a Shirabeyou account, we collect your username and a password. Passwords are hashed (bcrypt) before storage — we never store or have access to your plaintext password.

**Kanji collection and study data.** We store the kanji entries you save, along with spaced-repetition scheduling data (review intervals, correctness history, timestamps) needed to run the practice/review features.

**Text you look up.** When you use the lookup panel to look up a word or kanji, the selected text is sent to our backend, which queries the [kanjiapi.dev](https://kanjiapi.dev) public API on your behalf and returns the result. We do not collect or store the full content of the pages you browse — only the specific characters you actively select for lookup.

**Technical data.** Our backend logs standard request metadata (IP address, timestamps) for security and rate-limiting purposes. This is not linked to your account beyond what's operationally necessary and is not sold or shared.

## How We Use Your Information

We use the information above solely to:
- Authenticate you and keep your account secure
- Sync your kanji collection and practice progress across the extension and mobile app
- Look up kanji/word data on your behalf via kanjiapi.dev
- Maintain and improve the reliability of the service (e.g., rate limiting, debugging)

We do not sell your data. We do not use your data for advertising. We do not share your data with third parties except as described above (kanjiapi.dev, solely to fulfill lookup requests, and without your account information attached).

## Data Storage

Your account and study data are stored in a PostgreSQL database hosted on Railway. Data is transmitted between the extension/app and our backend over HTTPS.

## Your Choices

- You can delete individual kanji entries from your collection at any time within the app.
- You can delete your full account, along with all stored data throught the application's Account page.

## Permissions Used by the Extension

Shirabeyou's Chrome extension requests only the permissions needed to:
- Read selected text on pages you visit, to power the lookup panel
- Store your theme/settings locally (`chrome.storage`)
- Communicate with our backend to sync your account and collection

## Children's Privacy

Shirabeyou is not directed at children under 13, and we do not knowingly collect data from children under 13.

## Changes to This Policy

We may update this policy as the app evolves. Material changes will be reflected with an updated "Last updated" date above.

## Contact

Questions about this policy or your data? Contact us at: **[shirabeyou.support@gmail.com]**
