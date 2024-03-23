import styled from "styled-components";
import { useTabsStore } from "../utility/stateHooks";
import Tab from "./tab";
import { COLORS } from "../utility/constants";
import { openTabsInNewWindow, sortTabs } from "../utility/helpers";
import { SearchByButton } from "./searchbar";
import { IoLogOutOutline } from "react-icons/io5";

const TabGroupWrapper = styled.div`
  background-color: ${COLORS.SECONDARY}10;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  .group-label {
    font-size: large;
    font-weight: bolder;
    color: ${COLORS.FONT};
    display: flex;
    gap: 20px;
  }
`;

export const TabGroup = ({ category }: { category: string }) => {
  const { tabs, groupBy, sortBy, sortOrder } = useTabsStore((state) => state);
  const categorizedTabs = Object.entries(tabs).filter(([_key, value]) => {
    if (groupBy === "category") return value.category === category;
    if (groupBy === "date") return new Date(value.timestamp).toLocaleDateString("en-US") === category;
    if (groupBy === "tags") return value.tags.includes(category);
  });
  return (
    <TabGroupWrapper>
      <div className="group-label">
        {groupBy === "date" ? new Date(category).toLocaleDateString("en-US") : category}
        <SearchByButton
          isActive
          color={COLORS.SECONDARY}
          activeFontColor={COLORS.FONT}
          minWidth="min-content"
          curved
          onClick={() => {
            openTabsInNewWindow(categorizedTabs);
          }}
        >
          <IoLogOutOutline />
        </SearchByButton>
      </div>
      {sortTabs({ tabs: categorizedTabs, sortBy, sortOrder })
        ?.map(([key]) => key)
        ?.map((tabUrl) => (
          <Tab url={tabUrl} key={tabUrl} />
        ))}
    </TabGroupWrapper>
  );
};

export const SearchResultTabGroup = () => {
  const { tabs, isTagsActive, isTitleActive, searchKey, sortBy, sortOrder } = useTabsStore((state) => state);
  const categorizedTabs = Object.entries(tabs).filter(([_key, value]) => {
    if (isTitleActive && value.title?.toLocaleLowerCase().search(searchKey?.toLocaleLowerCase() ?? "") !== -1) return true;
    if (isTagsActive && value.tags.find((tag) => tag?.toLocaleLowerCase().search(searchKey?.toLocaleLowerCase() ?? "") !== -1)) return true;
    return false;
  });
  if (categorizedTabs.length === 0) return null;
  return (
    <TabGroupWrapper>
      {sortTabs({ tabs: categorizedTabs, sortBy, sortOrder })
        ?.map(([key]) => key)
        ?.map((tabUrl) => (
          <Tab url={tabUrl} key={tabUrl} />
        ))}
    </TabGroupWrapper>
  );
};
