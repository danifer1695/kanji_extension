//auth token is saved in chrome.storage.local

//auth token is saved in chrome.storage.local
export const AUTH_KEY = "auth_token";

export async function get_token()
{
    const result = await chrome.storage.local.get(AUTH_KEY);
    return result[AUTH_KEY] || null;
}

export async function set_token(token)
{
    await chrome.storage.local.set({[AUTH_KEY]: token});
}

export async function clear_token()
{
    await chrome.storage.local.remove(AUTH_KEY);
}
