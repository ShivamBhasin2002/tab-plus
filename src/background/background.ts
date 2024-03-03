import { connectToIDB, getIDBTransaction } from "../tabs/utility/helpers";

chrome.action.onClicked.addListener(() => {
  chrome.tabs.query({}, async (tabs) => {
    const db = await connectToIDB();
    const tx = getIDBTransaction(db);

    await Promise.all(
      tabs.map(async (tab) => {
        try {
          const existingData = await tx.store.get(tab.url ?? "");
          if (!existingData) {
            return tx.store.put({
              iconUrl: tab.favIconUrl,
              title: tab.title,
              url: tab.url,
              windowId: tab.windowId,
              timestamp: Date.now(),
              tags: "",
            });
          }
          return null;
        } catch (error) {
          console.log(error);
        }
      })
    );

    await tx.done;

    chrome.tabs.create({}, function (newTab) {
      chrome.tabs.query({}, function (tabs) {
        tabs.forEach((tab) => {
          if (tab.id && tab.id !== newTab.id) chrome.tabs.remove(tab.id);
        });
      });
    });
  });
});
