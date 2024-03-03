import { create } from "zustand";
import { connectToIDB, getIDBTransaction } from "./helpers";

type tabStateType = {
  tabs: Record<
    string,
    {
      iconUrl: string;
      tags: string[];
      timestamp: number;
      title: string;
      category: number | string;
    }
  >;
  categories: string[];
  tags: string[];
  updateTags: (url: string, tagList: string) => void;
  deleteTab: (url: string) => void;
  editCategory: (category: string) => void;
  initializeState: () => void;
};

export const useTabsStore = create<tabStateType>((set) => ({
  tabs: {},
  categories: [],
  tags: [],
  updateTags: (url, tagList) => {
    const newTags = tagList.split(",").map((tag) => tag.trim());
    set(({ tabs }) => {
      tabs[url].tags = newTags;
      return tabs;
    });
  },
  deleteTab: (url) => {},
  editCategory: (category) => {},
  initializeState: async () => {
    const db = await connectToIDB();
    const tx = getIDBTransaction(db);
    const tabsData = await tx.store.getAll();
    const categories: string[] = [];
    const tags: string[] = [];
    const tabs: tabStateType["tabs"] = {};
    tabsData.forEach((tab) => {
      const { iconUrl, title, url, windowId, timestamp, tags: storedTags } = tab;
      if (!iconUrl || !title || !url) return;
      const processedTags = storedTags.split(",").map((tag: string) => tag.trim());
      if (!categories.includes(windowId)) categories.push(windowId);
      processedTags.forEach((tag: string) => {
        if (tag && !tags.includes(tag)) tags.push(tag);
      });
      tabs[url] = {
        category: windowId,
        iconUrl,
        title,
        timestamp,
        tags: processedTags,
      };
    });
    set({ tabs, categories, tags });
  },
}));
