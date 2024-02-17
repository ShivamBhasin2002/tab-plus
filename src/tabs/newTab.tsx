import styled from "styled-components";
import { COLORS } from "./utility/constants";
import Navbar from "./components/navbar";
import SearchBar from "./components/searchbar";
import { useTabsStore } from "./utility/stateHooks";
import { useEffect } from "react";

const Wrapper = styled.main`
  width: 100vw;
  height: 100vh;
  background-color: ${COLORS.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 104px;
  & > * {
    max-width: 1280px;
    flex-grow: 1;
  }
`;

export const NewTab = () => {
  const { initializeState } = useTabsStore((state) => state);
  useEffect(() => {
    initializeState();
  }, []);
  return (
    <Wrapper>
      <Navbar />
      <SearchBar />
    </Wrapper>
  );
};
