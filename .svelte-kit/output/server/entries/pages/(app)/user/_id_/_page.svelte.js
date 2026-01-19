import { c as create_ssr_component, v as validate_component, f as escape, e as each } from "../../../../../chunks/ssr.js";
import { C as Card_description } from "../../../../../chunks/card-description.js";
import { C as Card_footer } from "../../../../../chunks/card-footer.js";
import { C as Card, a as Card_header, b as Card_title } from "../../../../../chunks/card.js";
import { C as Card_content } from "../../../../../chunks/card-content.js";
const CompactSlot = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { slot } = $$props;
  let { owner } = $$props;
  if ($$props.slot === void 0 && $$bindings.slot && slot !== void 0) $$bindings.slot(slot);
  if ($$props.owner === void 0 && $$bindings.owner && owner !== void 0) $$bindings.owner(owner);
  return `${validate_component(Card, "Card").$$render(
    $$result,
    {
      class: "p-0 flex justify-around items-center"
    },
    {},
    {
      default: () => {
        return `${validate_component(Card_header, "CardHeader").$$render($$result, { class: "p-2" }, {}, {
          default: () => {
            return `${validate_component(Card_title, "CardTitle").$$render($$result, {}, {}, {
              default: () => {
                return `${escape(slot.name)}, #${escape(slot.id)}`;
              }
            })} ${validate_component(Card_description, "CardDescription").$$render($$result, {}, {}, {
              default: () => {
                return `${escape(slot.description?.substring(0, 40) + "...")}`;
              }
            })}`;
          }
        })} ${validate_component(Card_footer, "CardFooter").$$render(
          $$result,
          {
            class: "p-2 justify-between flex flex-col items-center"
          },
          {},
          {
            default: () => {
              return `<div class="flex">${validate_component(Card_description, "CardDescription").$$render($$result, {}, {}, {
                default: () => {
                  return `Du ${escape(new Date(slot.starts_at).toLocaleDateString())} au ${escape(new Date(slot.ends_at).toLocaleDateString())}`;
                }
              })}</div> <div class="flex">${validate_component(Card_description, "CardDescription").$$render($$result, {}, {}, {
                default: () => {
                  return `Responsable: #${escape(owner?.churros_uid ?? (owner?.first_name ?? "") + owner?.last_name[0] + ".")}`;
                }
              })}</div> <div class="flex">${validate_component(Card_description, "CardDescription").$$render($$result, {}, {}, {
                default: () => {
                  return `Jauge: ${escape(slot.capacity)}`;
                }
              })}</div>`;
            }
          }
        )}`;
      }
    }
  )}`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  return `${validate_component(Card, "Card").$$render(
    $$result,
    {
      class: "m-auto w-full min-h-[calc(100vh-4rem)]"
    },
    {},
    {
      default: () => {
        return `${validate_component(Card_header, "CardHeader").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(Card_title, "CardTitle").$$render($$result, { class: "flex justify-between" }, {}, {
              default: () => {
                return `<span>${escape(data.user.first_name)} ${escape(data.user.last_name)}</span><span>#${escape(data.user.churros_uid)}</span>`;
              }
            })}`;
          }
        })} <div class="relative" data-svelte-h="svelte-1669y53"><div class="absolute inset-0 flex items-center"><span class="m-4 w-full border-t"></span></div></div> ${validate_component(Card_content, "CardContent").$$render(
          $$result,
          {
            class: "flex flex-col gap-4 pt-6 items-center"
          },
          {},
          {
            default: () => {
              return `${each(data.slots, (slot) => {
                return `<div class="w-3/4">${validate_component(CompactSlot, "CompactSlot").$$render(
                  $$result,
                  {
                    slot,
                    owner: data.users.find((user) => user.id === slot.owner_id)
                  },
                  {},
                  {}
                )} </div>`;
              })}`;
            }
          }
        )}`;
      }
    }
  )}`;
});
export {
  Page as default
};
