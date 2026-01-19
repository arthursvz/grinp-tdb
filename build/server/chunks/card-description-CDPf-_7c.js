import { j as compute_rest_props } from './lifecycle-CY0VpZrS.js';
import { c as create_ssr_component, s as spread, d as escape_attribute_value, f as escape_object } from './ssr-CWJ7--iU.js';
import { c as cn } from './utils-BxIOvjB_.js';

const Card_description = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `<p${spread(
    [
      {
        class: escape_attribute_value(cn("text-sm text-muted-foreground", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</p>`;
});

export { Card_description as C };
//# sourceMappingURL=card-description-CDPf-_7c.js.map
