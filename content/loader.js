//manifest loads this file, which then pulls the real content script

import(chrome.runtime.getURL("content/lookup_panel.js"));
