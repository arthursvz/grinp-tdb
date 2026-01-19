import { a as subscribe } from './lifecycle-CY0VpZrS.js';
import { c as create_ssr_component, v as validate_component, e as escape } from './ssr-CWJ7--iU.js';
import { p as page } from './stores-CaFYFvqm.js';
import { C as Card_description } from './card-description-CDPf-_7c.js';
import { C as Card, a as Card_header, b as Card_title } from './card-DqQ4sgdm.js';
import './exports-BGi7-Rnc.js';
import './utils-BxIOvjB_.js';
import 'clsx';
import 'tailwind-merge';

const Error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_page();
  return `${validate_component(Card, "Card").$$render($$result, { class: "m-auto" }, {}, {
    default: () => {
      return `${validate_component(Card_header, "CardHeader").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Card_title, "CardTitle").$$render($$result, {}, {}, {
            default: () => {
              return `Error ${escape($page.status)}`;
            }
          })} ${validate_component(Card_description, "CardDescription").$$render($$result, {}, {}, {
            default: () => {
              return `${escape($page.error?.message)}`;
            }
          })}`;
        }
      })}`;
    }
  })}`;
});

export { Error as default };
//# sourceMappingURL=_error.svelte-BSoO7LJY.js.map
