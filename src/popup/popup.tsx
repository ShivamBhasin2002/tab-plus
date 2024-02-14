import styled, { keyframes } from "styled-components";
import { colors } from "../static/colors";

const SwingAnimation = keyframes`
  0% {
    -webkit-transform: rotateX(-100deg);
    transform: rotateX(-100deg);
    transform-origin: top;
    opacity: 0;
  }
  100% {
    -webkit-transform: rotateX(0deg);
    transform: rotateX(0deg);
    -webkit-transform-origin: top;
    transform-origin: top;
    opacity: 1;
  }
`;

const PopupWrapper = styled.div`
  width: 420px;
  border-radius: 12px;
  background-color: ${colors.theme.primary};
  color: ${colors.theme.font};
  animation: ${SwingAnimation} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
  position: absolute;
  top: 0;
  right: 100px;
`;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
`;

const TabPlusPopup = () => {
  return (
    <Container>
      <PopupWrapper>Tab Plus</PopupWrapper>
    </Container>
  );
};

export default TabPlusPopup;
