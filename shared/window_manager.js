async function open_collection_popup(tab = "collection")
{
    const stored = await chrome.storage.local.get("collectionWindowId");
    const id = stored.collectionWindowId;

    //See if "collectionWindowId" exists.
    if(id)
    {
        try
        {
            //CASE: window already exists, so we call it up.
            await chrome.windows.get(id);
            await chrome.windows.update(id, {focused: true});
            return;
        }
        catch 
        {
            //CASE: window does no longer exists, so we continue to create it.
        }
    }

    //Create the window popup.
    const win = await chrome.windows.create({
        url: chrome.runtime.getURL(`content/collection_popup.html?tab=${tab}`),
        type: "popup",
        left: 500, 
        top: 200, 
        width: 700, 
        height: 700
    });

    //Set the internal ID variable we tried and failed to get earlier.
    await chrome.storage.local.set({collectionWindowId: win.id});
}
