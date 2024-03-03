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

const TabGroup = ({ category }: { category: string }) => {
  const { tabs } = useTabsStore((state) => state);
  const categorizedTabs = Object.entries(tabs)
    .filter(([_key, value]) => value.category === category)
    .map(([key]) => key);
  return (
    <TabGroupWrapper>
      {categorizedTabs.map((tabUrl) => (
        <Tab url={tabUrl} key={tabUrl} />
      ))}
    </TabGroupWrapper>
  );
};

export default TabGroup;
