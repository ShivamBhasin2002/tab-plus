import styled from "styled-components";
import { COLORS } from "./utility/constants";
import Navbar from "./components/navbar";
import SearchBar from "./components/searchbar";
import { useTabsStore } from "./utility/stateHooks";
import { useEffect } from "react";
import TabGroup from "./components/tabGroup";

const Wrapper = styled.main`
  width: 100vw;
  height: 100vh;
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
  const { initializeState, categories } = useTabsStore((state) => state);
  useEffect(() => {
    initializeState();
  }, []);
  return (
    <Wrapper>
      <Navbar />
      <SearchBar />
      {categories.map((category) => (
        <TabGroup category={category} />
      ))}
    </Wrapper>
  );
};
