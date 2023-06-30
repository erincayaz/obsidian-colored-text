import styled from "styled-components";

export const Row = styled.div`
  display: flex;
  flex: 1 1 0px;
  width: 100%;
  margin: 10px 0px 10px 10px;
  justify-content: center;
`;

const BORDER_COLOR = "#ffffff";
const SELECTED_BORDER_COLOR = "#616161";
const HOVER_BRIGHTNESS = 85;

interface ColorItemProps {
  color: string;
}

export const ColorItem = styled.button<ColorItemProps>`
  background-color: ${p => p.color} !important;
  max-width: 30px;
  flex: 1 1 30px;
  flex-shrink: 1 !important;
  margin: 0 2px;
  padding: 0;
  border: 1px solid ${BORDER_COLOR};
  border-radius: 0;
  cursor: pointer;

  &:hover {
    filter: brightness(${HOVER_BRIGHTNESS}%);
  }

  &:disabled {
    filter: none;
    box-shadow: none;
    border: 1px solid ${SELECTED_BORDER_COLOR};
    cursor: default;
  }

`;
