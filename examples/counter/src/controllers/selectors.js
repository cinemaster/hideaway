import { generateSelector } from "hideaway";

export const getCounter = (state) => {
  return generateSelector(state, {
    path: ["counter"],
  });
};
