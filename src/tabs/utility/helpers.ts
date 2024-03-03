import { IDBPDatabase, openDB } from "idb";
import { DB_NAME, OBJECT_STORE_NAME } from "./constants";

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
