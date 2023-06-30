import React, { useState } from "react";
import * as S from "./Styles";

const COLOR_OPTIONS = [
  "#c00000",
  "#ff0000",
  "#ffc000",
  "#ffff00",
  "#92d050",
  "#00b050",
  "#00b0f0",
  "#0070c0",
  "#002060",
  "#7030a0"
]

interface ColorPickerProps {
  onModalColorClick?: (e?: any) => void;
}

const ColorPalette = ({
  onModalColorClick = () => {},
}: ColorPickerProps) => {
  const [selected, setSelected] = useState<string>("");

  const onColorClick = (color: string) => (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setSelected(color);
    onModalColorClick(color);
  }

  return (
    <S.Row>
      {COLOR_OPTIONS.map(c => {
        return <S.ColorItem
          key={c}
          color={c}
          onClick={onColorClick(c)}
          disabled={c === selected}
        />
      }
      )}
    </S.Row>
  )
}

export default ColorPalette;