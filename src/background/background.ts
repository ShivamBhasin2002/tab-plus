import { openDB } from "idb";

chrome.action.onClicked.addListener(() => {
  const dbName = "tab-plus";
  const objStoreName = "tabs-list";
  chrome.tabs.query({}, async (tabs) => {
    console.log("tabs", tabs);
    const db = await openDB(dbName, 2, {
      async upgrade(db) {
        if (!db.objectStoreNames.contains(objStoreName)) {
          console.log("hello");
          const objStore = db.createObjectStore(objStoreName, { keyPath: "url" });
          objStore.createIndex("iconUrl", "iconUrl");
          objStore.createIndex("title", "title");
          objStore.createIndex("url", "url", { unique: true });
          objStore.createIndex("windowId", "windowId");
          objStore.createIndex("timestamp", "timestamp");
          objStore.createIndex("tags", "tags", { multiEntry: true });
        }
      },
    });

    console.log(db.objectStoreNames);
    const tx = db.transaction(objStoreName, "readwrite");

    tx.oncomplete = () => {
      console.log("All done");
    };

    tx.onerror = (err) => {
      console.log(err);
    };

    tx.onabort = () => {
      console.log("Aborted");
    };

    const store = tx.objectStore(objStoreName);

    await Promise.all(
      tabs.map(async (tab) => {
        try {
          const existingData = await store.get(tab.url ?? "");
          if (!existingData) {
            return store.add({
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
      let querying = chrome.tabs.query({}, function (tabs) {
        tabs.forEach((tab) => {
          console.log(tab)
          if (tab.id && tab.id !== newTab.id) chrome.tabs.remove(tab.id);
        });
      });
    });
  });
});
