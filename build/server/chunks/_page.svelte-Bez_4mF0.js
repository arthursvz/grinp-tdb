import { c as create_ssr_component, v as validate_component } from './ssr-CWJ7--iU.js';
import { C as Card, a as Card_header, b as Card_title } from './card-DqQ4sgdm.js';
import { C as Card_content } from './card-content-WV6OY6qq.js';
import 'clsx';
import { B as Button } from './button-B24JzdgH.js';
import './lifecycle-CY0VpZrS.js';
import './utils-BxIOvjB_.js';
import 'tailwind-merge';
import './index2-7tr__D8z.js';
import './ssr2-BVSPLo1E.js';
import './scheduler-nF4nnj9q.js';
import '@internationalized/date';
import 'tailwind-variants';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let user;
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  user = data.user;
  return `${validate_component(Card, "Card").$$render(
    $$result,
    {
      class: "m-auto w-full flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]"
    },
    {},
    {
      default: () => {
        return `${validate_component(Card_header, "CardHeader").$$render($$result, { class: "w-3/4" }, {}, {
          default: () => {
            return `${validate_component(Card_title, "CardTitle").$$render($$result, { class: "pb-4" }, {}, {
              default: () => {
                return `<h1 class="text-3xl font-bold" data-svelte-h="svelte-17k339h">Bienvenue !</h1>
            sur le site du Club d&#39;Escalade de l&#39;INP Toulouse`;
              }
            })}   <p data-svelte-h="svelte-ycim7n">Le club d&#39;escalade de l&#39;INP Toulouse, rattaché à l&#39;Association
            Sportive de l&#39;INP, est ouvert à tous les passionnés de grimpe, du
            débutant au confirmé. Que vous souhaitiez apprendre à grimper,
            progresser techniquement ou participer à des compétitions, notre
            club vous propose un cadre dynamique et bien encadré.</p>`;
          }
        })} <div class="relative" data-svelte-h="svelte-eeu87j"><div class="absolute inset-0 flex items-center"><span class="m-4 w-full border-t"></span></div></div> ${validate_component(Card_content, "CardContent").$$render(
          $$result,
          {
            class: "flex flex-col items-center gap-4 pt-6 w-3/4"
          },
          {},
          {
            default: () => {
              return `<h1 class="text-xl font-bold" data-svelte-h="svelte-t9ln5k">Rejoignez-nous !</h1> <p data-svelte-h="svelte-u2cnq5">Sur ce site, vous pouvez vous inscrire facilement à nos créneaux
            d&#39;escalade et découvrir les différents événements proposés par le
            club. Rejoignez-nous pour partager votre passion et progresser
            ensemble dans une ambiance sportive et amicale.</p>  ${!user ? `${validate_component(Button, "Button").$$render($$result, { href: "/login", class: "w-1/2" }, {}, {
                default: () => {
                  return `Se connecter`;
                }
              })}` : ``}`;
            }
          }
        )}`;
      }
    }
  )}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-Bez_4mF0.js.map
