Entitlement Database Builder
===================

## How to
1. Just install the XPI/ZIP to your browser (Found on [releases page](https://github.com/Al-Azif/entitlement-database-builder/releases))
    - Firefox: Use XPI
        - Click the XPI link found on the [releases page](https://github.com/Al-Azif/entitlement-database-builder/releases)
    - Chrome: Use ZIP
        - Download the ZIP
        - Open your extension page ([chrome://extensions](chrome://extensions))
        - Drag the ZIP to the page
2. Visit the [PlayStation Store](https://store.playstation.com)
3. Sign in
4. Click the icon that appeared in the address bar
5. Download/Submit the file

If you get a "No Session Cookie" error try going to your "Account Settings" then try again

## How do you protect my information
None of the information has data linked to your account beyond a connection that can be made between the items, the order they are in, the purchase datetime, and your IP in the server logs. I defend against this in the following ways:
- The purchase datetime is not stored.
- The submission order is randomized before being added to the database
- If a entry is already in the database it is ommited. Meaning not all items from your account are added within the randomized order of your entries.
- All logs are cleared weekly. You're IP will only remain in a whitelist for accessing the database.

## Credits
- Code is commented if it was pulled from somewhere else
- Icon by Vaadin from www.flaticon.com
- All other code is licensed by the LICENSE found in this repo
