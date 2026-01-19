import { c as create_ssr_component, v as validate_component } from "../../../../chunks/ssr.js";
import { C as Card, a as Card_header, b as Card_title } from "../../../../chunks/card.js";
import { C as Card_content } from "../../../../chunks/card-content.js";
import { C as Card_description } from "../../../../chunks/card-description.js";
import "clsx";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Card, "Card").$$render(
    $$result,
    {
      class: "m-auto w-1/2 min-h-[calc(100vh-4rem)]"
    },
    {},
    {
      default: () => {
        return `${validate_component(Card_header, "CardHeader").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(Card_title, "CardTitle").$$render($$result, {}, {}, {
              default: () => {
                return `Évènements`;
              }
            })} ${validate_component(Card_description, "CardDescription").$$render($$result, {}, {}, {
              default: () => {
                return `Les évènements organisés par le club !`;
              }
            })}`;
          }
        })} <div class="relative" data-svelte-h="svelte-1669y53"><div class="absolute inset-0 flex items-center"><span class="m-4 w-full border-t"></span></div></div> ${validate_component(Card_content, "CardContent").$$render($$result, { class: "flex gap-4 pt-6" }, {}, {
          default: () => {
            return `<p class="max-w-sm" data-svelte-h="svelte-1qfwabv">Championnats de France</p>`;
          }
        })} <div class="relative" data-svelte-h="svelte-1669y53"><div class="absolute inset-0 flex items-center"><span class="m-4 w-full border-t"></span></div></div> ${validate_component(Card_content, "CardContent").$$render($$result, { class: "flex gap-4 pt-6" }, {}, {
          default: () => {
            return `<p class="max-w-sm" data-svelte-h="svelte-kda7wk">Nuit de l&#39;escalade</p>`;
          }
        })}`;
      }
    }
  )}`;
});
export {
  Page as default
};
