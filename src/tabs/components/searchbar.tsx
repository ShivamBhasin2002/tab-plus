import styled from "styled-components";
import { COLORS } from "../utility/constants";
import { useState } from "react";
import { saveAs } from "file-saver";
import { FaSortAlphaDown, FaSortAlphaUp, FaRegEye } from "react-icons/fa";
import { CiImport, CiExport } from "react-icons/ci";
import { IoLogOutOutline } from "react-icons/io5";
import { useTabsStore } from "../utility/stateHooks";
import { connectToIDB, getIDBTransaction, openTabsInNewWindow } from "../utility/helpers";

const SearchBarWrapper = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 100px;
`;

const SearchInput = styled.div<{ focused: boolean }>`
  font-family: "Segoe UI", sans-serif;
  min-width: 300px;
  width: min-content;
  position: relative;

  input {
    font-size: 100%;
    padding: 0.8em;
    outline: none;
    border: 2px solid ${COLORS.GRAY};
    background-color: transparent;
    border-top-left-radius: 15px;
    border-bottom-left-radius: 15px;
    width: 100%;
    color: ${COLORS.FONT};
    box-sizing: border-box;
  }

  label {
    font-size: 100%;
    position: absolute;
    top: 0;
    left: 0;
    padding: 0.8em;
    margin-left: 0.5em;
    pointer-events: none;
    transition: all 0.1s ease;
    color: ${COLORS.FONT}80;
    ${({ focused }) =>
      focused &&
      `
        color: ${COLORS.FONT};
        transform: translateY(-50%) scale(0.9);
        margin: 0em;
        margin-left: 1.3em;
        padding: 0.4em;
        background-color: ${COLORS.PRIMARY};
    `}
  }
`;

export const SearchByButton = styled.button<{ curved?: boolean; curvedRight?: boolean; curvedLeft?: boolean; isActive?: boolean; color?: string; activeFontColor?: string; minWidth?: string; showHoverState?: boolean }>`
  background-color: #ffffff00;
  color: ${COLORS.FONT};
  min-width: ${({ minWidth }) => minWidth ?? "80px"};
  border: none;
  border-top: ${({ color }) => color ?? COLORS.GRAY} 2px solid;
  border-bottom: ${({ color }) => color ?? COLORS.GRAY} 2px solid;
  text-align: right;
  transition: all 0.6s ease;
  text-align: center;
  cursor: pointer;
  font-weight: bold;
  padding: 0 10px;
  white-space: nowrap;
  svg.push-right {
    margin-left: 10px;
  }
  ${({ curved, curvedLeft, curvedRight, color }) => {
    if (curved)
      return `
        border-top-right-radius: 15px;
        border-bottom-right-radius: 15px;
        border-top-left-radius: 15px;
        border-bottom-left-radius: 15px;
        border-left: ${color ?? COLORS.GRAY} 2px solid;
        border-right: ${color ?? COLORS.GRAY} 2px solid;
      `;
    if (curvedLeft)
      return `
        border-top-left-radius: 15px;
        border-bottom-left-radius: 15px;
        border-left: ${color ?? COLORS.GRAY} 2px solid;
      `;
    if (curvedRight)
      return `
        border-top-right-radius: 15px;
        border-bottom-right-radius: 15px;
        border-right: ${color ?? COLORS.GRAY} 2px solid;
      `;
  }}
  ${({ isActive, color, activeFontColor }) =>
    isActive &&
    `
      background-color: ${color ?? COLORS.GRAY};
      color: ${activeFontColor ?? COLORS.PRIMARY};
    `};
  ${({ showHoverState = true }) =>
    showHoverState &&
    `
      &:hover {
        background-color: ${COLORS.TERTIARY};
        color: ${COLORS.PRIMARY};
        border-color: ${COLORS.TERTIARY};
      }
    `};
`;

export const SectionContainer = styled.div`
  display: flex;
`;

const SearchBar = () => {
  const { searchKey, isTitleActive, isTagsActive, groupBy, sortBy, sortOrder, setSearchParams, categories, tabs } = useTabsStore((state) => state);
  const [isFocused, toggleFocus] = useState(false);
  return (
    <SearchBarWrapper>
      <SectionContainer>
        <SearchInput focused={isFocused || Boolean(searchKey)}>
          <input
            type="text"
            autoComplete="off"
            onFocus={() => {
              toggleFocus(true);
            }}
            onBlur={() => {
              toggleFocus(false);
            }}
            onChange={(e) => {
              setSearchParams({ searchKey: e.target.value });
            }}
          />
          <label htmlFor="name">Search</label>
        </SearchInput>
        <SearchByButton onClick={isTagsActive || !isTitleActive ? () => setSearchParams({ isTitleActive: !isTitleActive }) : () => {}} isActive={isTitleActive}>
          Title
        </SearchByButton>
        <SearchByButton curvedRight onClick={isTitleActive || !isTagsActive ? () => setSearchParams({ isTagsActive: !isTagsActive }) : () => {}} isActive={isTagsActive}>
          Tags
        </SearchByButton>
      </SectionContainer>
      <SectionContainer>
        <SearchByButton curvedLeft isActive showHoverState={false}>
          Group By:
        </SearchByButton>
        <SearchByButton
          isActive={groupBy === "category"}
          color={COLORS.SECONDARY}
          activeFontColor={COLORS.FONT}
          onClick={() => {
            setSearchParams({ groupBy: "category" });
          }}
        >
          Category
        </SearchByButton>
        <SearchByButton
          isActive={groupBy === "date"}
          color={COLORS.SECONDARY}
          activeFontColor={COLORS.FONT}
          onClick={() => {
            setSearchParams({ groupBy: "date" });
          }}
        >
          Date
        </SearchByButton>
        <SearchByButton
          isActive={groupBy === "tags"}
          curvedRight
          color={COLORS.SECONDARY}
          activeFontColor={COLORS.FONT}
          onClick={() => {
            setSearchParams({ groupBy: "tags" });
          }}
        >
          Tag
        </SearchByButton>
      </SectionContainer>
      <SectionContainer>
        <SearchByButton curvedLeft isActive showHoverState={false}>
          Sort By:
        </SearchByButton>
        <SearchByButton
          isActive={sortBy === "date"}
          color={COLORS.SECONDARY}
          activeFontColor={COLORS.FONT}
          curvedRight
          onClick={() => {
            if (sortBy === "date" && sortOrder === "asc") {
              setSearchParams({ sortOrder: "dsc" });
            } else if (sortBy === "date" && sortOrder === "dsc") {
              setSearchParams({ sortBy: null, sortOrder: null });
            } else {
              setSearchParams({ sortBy: "date", sortOrder: "asc" });
            }
          }}
        >
          Date
          {sortBy === "date" && sortOrder === "asc" && <FaSortAlphaDown className="push-right" />}
          {sortBy === "date" && sortOrder === "dsc" && <FaSortAlphaUp className="push-right" />}
        </SearchByButton>
      </SectionContainer>
      <SectionContainer>
        <SearchByButton curvedLeft isActive>
          Options:
        </SearchByButton>
        <SearchByButton isActive color={COLORS.SECONDARY} activeFontColor={COLORS.FONT} title="view tags" aria-label="view-tags" minWidth="min-content" onClick={() => {}}>
          <FaRegEye />
        </SearchByButton>
        <SearchByButton
          isActive
          color={COLORS.SECONDARY}
          activeFontColor={COLORS.FONT}
          minWidth="min-content"
          onClick={async () => {
            const db = await connectToIDB();
            const tx = getIDBTransaction(db);
            const tabsData = await tx.store.getAll();
            const blob = new Blob([JSON.stringify(tabsData)], { type: "text/plain;charset=utf-8" });
            saveAs(blob, "tab-plus-json");
          }}
        >
          <CiExport />
        </SearchByButton>
        <SearchByButton isActive color={COLORS.SECONDARY} activeFontColor={COLORS.FONT} minWidth="min-content" onClick={() => {}}>
          <CiImport />
        </SearchByButton>
        <SearchByButton
          isActive
          color={COLORS.SECONDARY}
          activeFontColor={COLORS.FONT}
          minWidth="min-content"
          curvedRight
          onClick={() => {
            categories.forEach((category) => {
              const categorizedTabs = Object.entries(tabs).filter(([_key, value]) => {
                if (groupBy === "category") return value.category === category;
                if (groupBy === "date") return new Date(value.timestamp).toLocaleDateString("en-US") === category;
                if (groupBy === "tags") return value.tags.includes(category);
              });
              openTabsInNewWindow(categorizedTabs);
            });
          }}
        >
          <IoLogOutOutline />
        </SearchByButton>
      </SectionContainer>
    </SearchBarWrapper>
  );
};

export default SearchBar;
