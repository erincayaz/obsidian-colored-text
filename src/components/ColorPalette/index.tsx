import React, { useState } from "react";
import * as S from "./Styles";

interface ColorPickerProps {
  colors: string[];
  onModalColorClick?: (e?: any) => void;
}

const ColorPalette = ({
  colors,
  onModalColorClick = () => {},
}: ColorPickerProps) => {
  const [selected, setSelected] = useState<string>("");

  const onColorClick = (color: string) => (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setSelected(color);
    onModalColorClick(color);
  }

  return (
    <S.Row>
      {colors.map((c, i) => {
        return <S.ColorItem
          key={`${c}-${i}`}
          color={c}
          onClick={onColorClick(c)}
          disabled={c === selected}
        />
      })}
    </S.Row>
  )
}

export default ColorPalette;