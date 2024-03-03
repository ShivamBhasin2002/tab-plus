import styled from "styled-components";
import { useTabsStore } from "../utility/stateHooks";
import { COLORS } from "../utility/constants";

const TabWrapper = styled.div`
  color: ${COLORS.FONT};
`;

const Tab = ({ url }: { url: string }) => {
  const { tabs } = useTabsStore((state) => state);
  return <TabWrapper>{url}</TabWrapper>;
};

export default Tab;
