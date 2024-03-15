import { create } from "zustand";
import { connectToIDB, deleteTabInDB, getIDBTransaction, updateTagInDB } from "./helpers";

type searchStateType = {
  searchKey?: string | null | undefined;
  isTitleActive?: boolean;
  isTagsActive?: boolean;
  groupBy?: "category" | "date" | "tags";
  sortBy?: "date" | "tags" | null;
  sortOrder?: "asc" | "dsc" | null;
};

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
  rawTabData: any[];
  categories: string[];
  tags: string[];
  dates: string[];
  updateTags: (url: string, tagList: string) => void;
  deleteTab: (url: string) => void;
  editCategory: (category: string) => void;
  initializeState: () => void;
  setSearchParams: (search: searchStateType) => void;
} & searchStateType;

export const useTabsStore = create<tabStateType>((set) => ({
  tabs: {},
  rawTabData: [],
  categories: [],
  tags: [],
  dates: [],
  searchKey: "",
  isTitleActive: true,
  isTagsActive: true,
  groupBy: "category",
  sortBy: null,
  sortOrder: null,
  setSearchParams: (search: searchStateType) => set({ ...search }),
  updateTags: (url, tagList) => {
    const newTags = tagList
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");
    set(({ tabs }) => {
      const currTab = tabs[url];
      currTab.tags = newTags;
      updateTagInDB({
        iconUrl: currTab.iconUrl,
        title: currTab.title,
        url,
        windowId: currTab.category,
        timestamp: currTab.timestamp,
        tags: tagList,
      });
      return tabs;
    });
  },
  deleteTab: (url) => {
    set(({ tabs, categories }) => {
      const category = tabs[url].category;
      delete tabs[url];
      const deleteCategory = !Object.values(tabs).find((tab) => tab.category === category);
      return deleteCategory ? { tabs, categories: categories.filter((t) => t !== category) } : tabs;
    });
    deleteTabInDB(url);
  },
  editCategory: (category) => {},
  initializeState: async () => {
    const db = await connectToIDB();
    const tx = getIDBTransaction(db);
    const tabsData = await tx.store.getAll();
    const categories: string[] = [];
    const dates: string[] = [];
    const tags: string[] = [];
    const tabs: tabStateType["tabs"] = {};
    tabsData.forEach((tab) => {
      const { iconUrl, title, url, windowId, timestamp, tags: storedTags } = tab;
      if (!iconUrl || !title || !url) return;
      const processedTags = storedTags
        .split(",")
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag !== "");
      const dateStr = new Date(timestamp).toLocaleDateString("en-US");
      if (!categories.includes(windowId)) categories.push(windowId);
      if (!dates.includes(dateStr)) dates.push(dateStr);
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
    set({ tabs, categories, tags, rawTabData: tabsData, dates });
  },
}));
