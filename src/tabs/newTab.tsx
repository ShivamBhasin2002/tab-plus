import styled from "styled-components";
import { COLORS } from "./utility/constants";
import SearchBar from "./components/searchbar";
import { useTabsStore } from "./utility/stateHooks";
import { useEffect } from "react";
import { SearchResultTabGroup, TabGroup } from "./components/tabGroup";

const Wrapper = styled.main`
  width: 100%;
  min-height: 100vh;
  height: fit-content;
  padding-bottom: 100px;
  background-color: ${COLORS.PRIMARY};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  & > * {
    max-width: 1280px;
    width: 100%;
  }
`;

export const NewTab = () => {
  const { initializeState, categories, dates, tags, searchKey, groupBy } = useTabsStore((state) => state);
  useEffect(() => {
    initializeState();
  }, []);
  const getMainSection = () => {
    if (searchKey) return <SearchResultTabGroup />;
    if (groupBy === "category") return categories.map((category) => <TabGroup category={category} />);
    if (groupBy === "date") return dates.map((category) => <TabGroup category={category} />);
    if (groupBy === "tags") return tags.map((category) => <TabGroup category={category} />);
  };
  return (
    <Wrapper>
      <SearchBar />
      {getMainSection()}
    </Wrapper>
  );
};
