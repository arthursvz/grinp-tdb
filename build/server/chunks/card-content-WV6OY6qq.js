import { j as compute_rest_props } from './lifecycle-CY0VpZrS.js';
import { c as create_ssr_component, s as spread, d as escape_attribute_value, f as escape_object } from './ssr-CWJ7--iU.js';
import { c as cn } from './utils-BxIOvjB_.js';

const Card_content = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `<div${spread(
    [
      {
        class: escape_attribute_value(cn("p-6 pt-0", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</div>`;
});

export { Card_content as C };
//# sourceMappingURL=card-content-WV6OY6qq.js.map
