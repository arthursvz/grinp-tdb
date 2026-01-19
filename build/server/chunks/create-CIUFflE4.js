import { m as makeElement, f as addMeltEventListener } from './button-B24JzdgH.js';

function createLabel() {
  const root = makeElement("label", {
    action: (node) => {
      const mouseDown = addMeltEventListener(node, "mousedown", (e) => {
        if (!e.defaultPrevented && e.detail > 1) {
          e.preventDefault();
        }
      });
      return {
        destroy: mouseDown
      };
    }
  });
  return {
    elements: {
      root
    }
  };
}

export { createLabel as c };
//# sourceMappingURL=create-CIUFflE4.js.map
