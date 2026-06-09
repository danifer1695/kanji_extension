# Shirabeyou

This extension will allow you to select any text containing Kanji to get some quick information on their readings, meanings and JLPT level.

>This is intended as a portfolio project, and because of this its UI is intentionally made to resemble Migaku's fantastic visual identity.

[Watch demo video](https://www.youtube.com/watch?v=4yQ6qccl5VA)


![Demo](assets/images/screenshots/screenshot_collection_panel_01.png)

## A little bit of background

As a long-time Japanese-learning app user (Migaku, big fan), my goal making this extension is to fill a gap I have noticed in most of the services that I've used. Many will include the functionality to scan any Japanese-language website and give you a detailed breakdown of the vocabulary contained within, but what's often lacking is information on the individual kanji those words are made up of. It will typically be up to me to go on to a different tab and look the character up by myself... let's fix that!


## Features
![Demo](assets/images/screenshots/screenshot_lookup_panel_01.png)

Using the Shirabeyou extension that research process is simplified to simply highlighting the text containing the kanji(s) we are interested in. A handy pop-up will appear containing relevant data such as:

- **English meaning** 
- **on'yomi and kun'yomi readings**, in kana. 
- **JLPT level color coding**, a-la Migaku.
- **A save button (+)**, to save any kanji for review.
- **Backend implemented with Node.js, Postgres, and hosted through Railway**, individual account registering and logging in are fully functional. 
Backend repository can be found at: [https://github.com/danifer1695/kanji_extension_backend]
All kanji data is fetched in real time from [kanjiapi.dev].

## Test it out!

Test credentials are **username: test@test.com, pass: password123**.

## Installation (in development)

1. Clone this repo
    git clone https://github.com/danifer1695/kanji_extension.git
2. Open `chrome://extensions` (or `vivaldi://extensions`... browser just has to be chromium-based)
3. Enable "Developer mode"
4. Click on "Load unpacked" and select the project folder


