import { get } from "svelte/store";
import { DimensionsStore } from "../../stores/DimensionsStore";
import { HighlightStore } from "../../stores/HighlightStore";

let holding = 0;

const HandleMouseUp = () => {
  holding -= 1;
};

export const DragHandler = (e: MouseEvent, type: string, node: HTMLElement) => {
  e.stopPropagation();
  holding = 1;
  document.addEventListener("mouseup", HandleMouseUp);

  setTimeout(() => {
    document.removeEventListener("mouseup", HandleMouseUp);

    if (holding > 0) {
      SetUpDrag();
    }
  }, 100);

  let scale, startY, startX, startW, startH, width, height;

  const SetUpDrag = () => {
    const dimensions = get(DimensionsStore);
    scale = node.getBoundingClientRect().width / node.offsetWidth;
    startY = e.clientY;
    startX = e.clientX;
    startW = dimensions.width;
    startH = dimensions.height;
    width = startW;
    height = startH;

    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("mouseup", upHandler);
  };

  const moveHandler = (e) => {
    if (type === "width") {
      width = Math.round(startW + (e.clientX - startX) * (1 / scale));
      if (width <= 0) return;
      node.style.width = `${width}px`;
      DimensionsStore.setWidth(width);
    } else {
      height = Math.round(startH + (e.clientY - startY) * (1 / scale));
      if (height <= 0) return;
      node.style.height = `${height}px`;
      DimensionsStore.setHeigth(height);
    }
    // update highlight
    HighlightStore.refresh();
  };

  const upHandler = () => {
    document.removeEventListener("mousemove", moveHandler);
    document.removeEventListener("mouseup", upHandler);
  };
};
