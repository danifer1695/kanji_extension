# Kanji Lookup browser extension

>This Chromium extension will allow you to select any text containing Kanji to get some quick information on their readings, meanings and JLPT level.

<!--Demo video / gif-->

## A little bit of background

As a long-time Japanese-learning app user (Migaku, big fan), my goal making this extension is to fill a gap I have noticed in most of the services that I've used. Many will include the functionality to scan any Japanese-language website and give you a detailed breakdown of the vocabulary contained within, but what's often lacking is information on the individual kanji those words are made up of. It will typically be up to me to go on to a different tab and look the character up by myself... let's fix that!

## Features

Using this extension that research process is simplified to simply highlighting the text containing the kanji(s) we are interested in. A handy pop-up will appear containing relevant data such as:

- **English meaning** 
- **on'yomi and kun'yomi readings**, in kana. 
- **JLPT level color coding**, a-la Migaku.
- **A save button (+)**, to save any kanji for review.
- **A collection navigator**, containing all previously saved kanji. This is accessible through the extension icon. Contents are saved locally and persist accross sessions, so no sign-up is required.

All kanji data is fetched in real time from [kanjiapi.dev].

## Installation (in development)

1. Clone this repo
2. Open `chrome://extensions` (or `vivaldi://extensions`... browser just has to be chromium-based)
3. Enable "Developer mode"
4. Click on "Load unpacked" and select the project folder


