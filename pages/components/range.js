import React, { useState } from "react";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import css from "../../styles/first/FirstPage.module.css";

const PrettoSlider = styled(Slider)({
  color: "white",
  height: 8,

  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 24,
    width: 24,
    backgroundColor: "white",
    boxShadow: "0px 0px 10px",
    border: "2px solid #285d91",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&:before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1.2,
    boxShadow: "0px 0px 10px",
    fontSize: 12,
    background: "unset",
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: "50% 50% 50% 0",
    backgroundColor: "#295e92",
    transformOrigin: "bottom left",
    transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
    "&:before": { display: "none" },
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
    },
    "& > *": {
      transform: "rotate(45deg)",
    },
  },
});

export default function Range({ onRadiusChange }) {
  return (
    <Box className={css.range_selector} sx={{ width: "60%" }}>
      <PrettoSlider
        onChange={onRadiusChange}
        valueLabelDisplay="auto"
        aria-label="pretto slider"
        defaultValue={1000}
        min={0}
        max={2000}
        color="secondary"
      />
    </Box>
  );
}
