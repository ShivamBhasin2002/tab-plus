import styled from "styled-components";
import { useTabsStore } from "../utility/stateHooks";
import Tab from "./tab";
import { COLORS } from "../utility/constants";

const TabGroupWrapper = styled.div`
  background-color: ${COLORS.SECONDARY}10;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const TabGroup = ({ category }: { category: string }) => {
  const { tabs, groupBy } = useTabsStore((state) => state);
  const categorizedTabs = Object.entries(tabs)
    .filter(([_key, value]) => {
      if (groupBy === "category") return value.category === category;
      if (groupBy === "date") return new Date(value.timestamp).toLocaleDateString("en-US") === category;
      if (groupBy === "tags") return value.tags.includes(category);
    })
    .map(([key]) => key);
  return (
    <TabGroupWrapper>
      {categorizedTabs.map((tabUrl) => (
        <Tab url={tabUrl} key={tabUrl} />
      ))}
    </TabGroupWrapper>
  );
};

export const SearchResultTabGroup = () => {
  const { tabs, isTagsActive, isTitleActive, searchKey } = useTabsStore((state) => state);
  const categorizedTabs = Object.entries(tabs)
    .filter(([_key, value]) => {
      if (isTitleActive && value.title?.toLocaleLowerCase().search(searchKey?.toLocaleLowerCase() ?? "") !== -1) return true;
      if (isTagsActive && value.tags.find((tag) => tag?.toLocaleLowerCase().search(searchKey?.toLocaleLowerCase() ?? "") !== -1)) return true;
      return false;
    })
    .map(([key]) => key);
  if (categorizedTabs.length === 0) return null;
  return (
    <TabGroupWrapper>
      {categorizedTabs.map((tabUrl) => (
        <Tab url={tabUrl} key={tabUrl} />
      ))}
    </TabGroupWrapper>
  );
};
