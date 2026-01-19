import { a as subscribe } from "../../chunks/lifecycle.js";
import { c as create_ssr_component, v as validate_component, f as escape } from "../../chunks/ssr.js";
import { p as page } from "../../chunks/stores.js";
import { C as Card_description } from "../../chunks/card-description.js";
import { C as Card, a as Card_header, b as Card_title } from "../../chunks/card.js";
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
export {
  Error as default
};
