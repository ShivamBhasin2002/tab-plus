import { IDBPDatabase, openDB } from "idb";
import { DB_NAME, OBJECT_STORE_NAME } from "./constants";
import { tabObject, tabStateType } from "./stateHooks";

export const connectToIDB = () =>
  openDB(DB_NAME, 2, {
    async upgrade(db) {
      if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
        const objStore = db.createObjectStore(OBJECT_STORE_NAME, { keyPath: "url" });
        objStore.createIndex("iconUrl", "iconUrl");
        objStore.createIndex("title", "title");
        objStore.createIndex("url", "url", { unique: true });
        objStore.createIndex("windowId", "windowId");
        objStore.createIndex("timestamp", "timestamp");
        objStore.createIndex("tags", "tags");
      }
    },
  });

export const getIDBTransaction = (db: IDBPDatabase<unknown>) => {
  const tx = db.transaction(OBJECT_STORE_NAME, "readwrite");
  tx.oncomplete = () => {
    console.log("All done");
  };
  tx.onerror = (err) => {
    console.log(err);
  };
  tx.onabort = () => {
    console.log("Aborted");
  };
  return tx;
};

export const updateTagInDB = async (tab: any) => {
  const db = await connectToIDB();
  const tx = getIDBTransaction(db);
  tx.store.put(tab);
};

export const deleteTabInDB = async (url: string) => {
  const db = await connectToIDB();
  const tx = getIDBTransaction(db);
  tx.store.delete(url);
};

export const sortTabs = ({ tabs, sortBy, sortOrder }: { tabs: [key: string, value: tabObject][]; sortBy: tabStateType["sortBy"]; sortOrder: tabStateType["sortOrder"] }) => {
  if (!sortBy) return tabs;
  return tabs.sort((a, b) => {
    return sortOrder === "asc" ? a[1].timestamp - b[1].timestamp : b[1].timestamp - a[1].timestamp;
  });
};

export const openTabsInNewWindow = async (tabs: [key: string, value: tabObject][]) => {
  const { id } = await chrome.windows.create({ url: tabs[0][0] });
  tabs.forEach(([key], idx) => {
    if (idx === 0) return;
    chrome.tabs.create({
      url: key,
      windowId: id,
      active: idx === 0,
    });
  });
};

export const downloadObjectAsJson = (exportObj: any, exportName: string) => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
  const downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.id = "hello-world";
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
};