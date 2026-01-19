import { s as setContext, d as getContext, c as compute_rest_props, a as subscribe, n as noop } from "../../../../chunks/lifecycle.js";
import { c as create_ssr_component, s as spread, h as escape_object, a as add_attribute, g as escape_attribute_value, v as validate_component } from "../../../../chunks/ssr.js";
import { a as superForm, b as zodClient, l as loginScheme } from "../../../../chunks/zod.js";
import { C as Card, a as Card_header, b as Card_title } from "../../../../chunks/card.js";
import { C as Card_content } from "../../../../chunks/card-content.js";
import { C as Card_description } from "../../../../chunks/card-description.js";
import { C as Card_footer } from "../../../../chunks/card-footer.js";
import { F as Form_field, C as Control, a as Form_label, b as Form_field_errors, c as Form_button } from "../../../../chunks/index3.js";
import { I as Input } from "../../../../chunks/input.js";
import "dequal";
import { t as toWritableStores, c as omit, o as overridable, A as effect, m as makeElement, z as styleToString, G as isBrowser, B as Button } from "../../../../chunks/button.js";
import { w as writable } from "../../../../chunks/index2.js";
import { c as createBitAttrs } from "../../../../chunks/events.js";
import { r as removeUndefined, g as getOptionUpdater } from "../../../../chunks/updater.js";
import { c as cn } from "../../../../chunks/utils.js";
import { p as page } from "../../../../chunks/stores.js";
import "just-clone";
import "ts-deepmerge";
import "../../../../chunks/index.js";
import "memoize-weak";
import "@exodus/schemasafe";
import { g as getFlash } from "../../../../chunks/client.js";
const defaults = {
  src: "",
  delayMs: 0,
  onLoadingStatusChange: void 0
};
const createAvatar = (props) => {
  const withDefaults = { ...defaults, ...props };
  const options = toWritableStores(omit(withDefaults, "loadingStatus", "onLoadingStatusChange"));
  const { src, delayMs } = options;
  const loadingStatusWritable = withDefaults.loadingStatus ?? writable("loading");
  const loadingStatus = overridable(loadingStatusWritable, withDefaults?.onLoadingStatusChange);
  effect([src, delayMs], ([$src, $delayMs]) => {
    if (isBrowser) {
      const image2 = new Image();
      image2.src = $src;
      image2.onload = () => {
        if (delayMs !== void 0) {
          const timerId = window.setTimeout(() => {
            loadingStatus.set("loaded");
          }, $delayMs);
          return () => window.clearTimeout(timerId);
        } else {
          loadingStatus.set("loaded");
        }
      };
      image2.onerror = () => {
        loadingStatus.set("error");
      };
    }
  });
  const image = makeElement("avatar-image", {
    stores: [src, loadingStatus],
    returned: ([$src, $loadingStatus]) => {
      const imageStyles = styleToString({
        display: $loadingStatus === "loaded" ? "block" : "none"
      });
      return {
        src: $src,
        style: imageStyles
      };
    }
  });
  const fallback = makeElement("avatar-fallback", {
    stores: [loadingStatus],
    returned: ([$loadingStatus]) => {
      return {
        style: $loadingStatus === "loaded" ? styleToString({
          display: "none"
        }) : void 0,
        hidden: $loadingStatus === "loaded" ? true : void 0
      };
    }
  });
  return {
    elements: {
      image,
      fallback
    },
    states: {
      loadingStatus
    },
    options
  };
};
function getAvatarData() {
  const NAME = "avatar";
  const PARTS = ["root", "image", "fallback"];
  return {
    NAME,
    PARTS
  };
}
function setCtx(props) {
  const { NAME, PARTS } = getAvatarData();
  const getAttrs = createBitAttrs(NAME, PARTS);
  const avatar = { ...createAvatar(removeUndefined(props)), getAttrs };
  setContext(NAME, avatar);
  return {
    ...avatar,
    updateOption: getOptionUpdater(avatar.options)
  };
}
function getImage(src = "") {
  const { NAME } = getAvatarData();
  const avatar = getContext(NAME);
  if (!src) {
    avatar.options.src.set("");
  } else {
    avatar.options.src.set(src);
  }
  return avatar;
}
function getCtx() {
  const { NAME } = getAvatarData();
  return getContext(NAME);
}
const Avatar$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["delayMs", "loadingStatus", "onLoadingStatusChange", "asChild", "el"]);
  let { delayMs = void 0 } = $$props;
  let { loadingStatus = void 0 } = $$props;
  let { onLoadingStatusChange = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { states: { loadingStatus: localLoadingStatus }, updateOption, getAttrs } = setCtx({
    src: "",
    delayMs,
    onLoadingStatusChange: ({ next }) => {
      loadingStatus = next;
      onLoadingStatusChange?.(next);
      return next;
    }
  });
  const attrs = getAttrs("root");
  if ($$props.delayMs === void 0 && $$bindings.delayMs && delayMs !== void 0) $$bindings.delayMs(delayMs);
  if ($$props.loadingStatus === void 0 && $$bindings.loadingStatus && loadingStatus !== void 0) $$bindings.loadingStatus(loadingStatus);
  if ($$props.onLoadingStatusChange === void 0 && $$bindings.onLoadingStatusChange && onLoadingStatusChange !== void 0) $$bindings.onLoadingStatusChange(onLoadingStatusChange);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  loadingStatus !== void 0 && localLoadingStatus.set(loadingStatus);
  {
    updateOption("delayMs", delayMs);
  }
  return `${asChild ? `${slots.default ? slots.default({ attrs }) : ``}` : `<div${spread([escape_object($$restProps), escape_object(attrs)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ attrs }) : ``}</div>`}`;
});
const Avatar_image$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let image;
  let builder;
  let $$restProps = compute_rest_props($$props, ["src", "alt", "asChild", "el"]);
  let $image, $$unsubscribe_image = noop, $$subscribe_image = () => ($$unsubscribe_image(), $$unsubscribe_image = subscribe(image, ($$value) => $image = $$value), image);
  let { src = void 0 } = $$props;
  let { alt = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const attrs = { "data-bits-avatar-image": "" };
  if ($$props.src === void 0 && $$bindings.src && src !== void 0) $$bindings.src(src);
  if ($$props.alt === void 0 && $$bindings.alt && alt !== void 0) $$bindings.alt(alt);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  $$subscribe_image(image = getImage(src).elements.image);
  builder = $image;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_image();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<img${spread(
    [
      escape_object(builder),
      { alt: escape_attribute_value(alt) },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", el, 0)}>`}`;
});
const Avatar_fallback$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $fallback, $$unsubscribe_fallback;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { fallback }, getAttrs } = getCtx();
  $$unsubscribe_fallback = subscribe(fallback, (value) => $fallback = value);
  const attrs = getAttrs("fallback");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  builder = $fallback;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_fallback();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<span${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</span>`}`;
});
const Avatar_fallback = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `${validate_component(Avatar_fallback$1, "AvatarPrimitive.Fallback").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)
      },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({}) : ``}`;
      }
    }
  )}`;
});
const Avatar_image = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "src", "alt"]);
  let { class: className = void 0 } = $$props;
  let { src = void 0 } = $$props;
  let { alt = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  if ($$props.src === void 0 && $$bindings.src && src !== void 0) $$bindings.src(src);
  if ($$props.alt === void 0 && $$bindings.alt && alt !== void 0) $$bindings.alt(alt);
  return `${validate_component(Avatar_image$1, "AvatarPrimitive.Image").$$render(
    $$result,
    Object.assign(
      {},
      { src },
      { alt },
      {
        class: cn("aspect-square h-full w-full", className)
      },
      $$restProps
    ),
    {},
    {}
  )}`;
});
const Avatar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "delayMs"]);
  let { class: className = void 0 } = $$props;
  let { delayMs = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  if ($$props.delayMs === void 0 && $$bindings.delayMs && delayMs !== void 0) $$bindings.delayMs(delayMs);
  return `${validate_component(Avatar$1, "AvatarPrimitive.Root").$$render(
    $$result,
    Object.assign(
      {},
      { delayMs },
      {
        class: cn("relative flex h-32 w-32 shrink-0 overflow-hidden rounded-full", className)
      },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({}) : ``}`;
      }
    }
  )}`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $formData, $$unsubscribe_formData;
  let { data } = $$props;
  const form = superForm(data.form, { validators: zodClient(loginScheme) });
  const { form: formData, enhance } = form;
  $$unsubscribe_formData = subscribe(formData, (value) => $formData = value);
  getFlash(page);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${validate_component(Card, "Card").$$render(
      $$result,
      {
        class: "m-auto w-full min-h-[calc(100vh-4rem)]"
      },
      {},
      {
        default: () => {
          return `${validate_component(Card_header, "CardHeader").$$render($$result, {}, {}, {
            default: () => {
              return `${validate_component(Card_title, "CardTitle").$$render($$result, {}, {}, {
                default: () => {
                  return `Connexion`;
                }
              })} ${validate_component(Card_description, "CardDescription").$$render($$result, {}, {}, {
                default: () => {
                  return `Entrez votre E-Mail ci dessous pour vous connecter`;
                }
              })}`;
            }
          })} <div class="relative" data-svelte-h="svelte-eeu87j"><div class="absolute inset-0 flex items-center"><span class="m-4 w-full border-t"></span></div></div> ${validate_component(Card_content, "CardContent").$$render($$result, { class: "flex max-md:flex-col gap-4 pt-6" }, {}, {
            default: () => {
              return `<form method="POST" action="?/manual" class="w-full">${validate_component(Form_field, "Form.Field").$$render($$result, { form, name: "email" }, {}, {
                default: () => {
                  return `${validate_component(Control, "Form.Control").$$render($$result, {}, {}, {
                    default: ({ attrs }) => {
                      return `${validate_component(Form_label, "Form.Label").$$render($$result, {}, {}, {
                        default: () => {
                          return `E-Mail`;
                        }
                      })} ${validate_component(Input, "Input").$$render(
                        $$result,
                        Object.assign({}, { type: "email" }, attrs, { placeholder: "nom@exemple.fr" }, { value: $formData.email }),
                        {
                          value: ($$value) => {
                            $formData.email = $$value;
                            $$settled = false;
                          }
                        },
                        {}
                      )}`;
                    }
                  })} ${validate_component(Form_field_errors, "Form.FieldErrors").$$render($$result, {}, {}, {})}`;
                }
              })} ${validate_component(Form_field, "Form.Field").$$render($$result, { form, name: "password" }, {}, {
                default: () => {
                  return `${validate_component(Control, "Form.Control").$$render($$result, {}, {}, {
                    default: ({ attrs }) => {
                      return `${validate_component(Form_label, "Form.Label").$$render($$result, {}, {}, {
                        default: () => {
                          return `Mot de passe`;
                        }
                      })} ${validate_component(Input, "Input").$$render(
                        $$result,
                        Object.assign({}, { type: "password" }, attrs, { value: $formData.password }),
                        {
                          value: ($$value) => {
                            $formData.password = $$value;
                            $$settled = false;
                          }
                        },
                        {}
                      )}`;
                    }
                  })} ${validate_component(Form_field_errors, "Form.FieldErrors").$$render($$result, {}, {}, {})}`;
                }
              })} ${validate_component(Form_button, "Form.Button").$$render($$result, { class: "w-full" }, {}, {
                default: () => {
                  return `Se connecter`;
                }
              })}</form> <div class="relative flex flex" data-svelte-h="svelte-17ivkzo"><div class="absolute inset-2 flex flex-col items-center"><span class="md:h-full md:border-l max-md:w-full max-md:border-t"></span></div> <div class="relative flex flex-col m-auto text-xs uppercase"><span class="bg-card md:py-2 max-md:px-2 text-muted-foreground">Ou</span></div></div> <form method="POST" action="?/oauth" class="w-full flex flex-col max-md:gap-4 justify-between">${validate_component(Avatar, "Avatar").$$render($$result, { class: "m-auto border-2" }, {}, {
                default: () => {
                  return `${validate_component(Avatar_image, "AvatarImage").$$render(
                    $$result,
                    {
                      src: "https://git.inpt.fr/inp-net/visual-identity/-/raw/main/favicon-color.png?ref_type=heads",
                      alt: "inp-net"
                    },
                    {},
                    {}
                  )} ${validate_component(Avatar_fallback, "AvatarFallback").$$render($$result, {}, {}, {
                    default: () => {
                      return `INP`;
                    }
                  })}`;
                }
              })} ${validate_component(Form_button, "Form.Button").$$render($$result, { class: "w-full" }, {}, {
                default: () => {
                  return `Connexion via INP Net`;
                }
              })}</form>`;
            }
          })} <div class="relative" data-svelte-h="svelte-bfgaqx"><div class="absolute inset-0 flex items-center"><span class="w-full border-t"></span></div></div> ${validate_component(Card_footer, "CardFooter").$$render($$result, { class: "p-2 flex justify-evenly gap-4" }, {}, {
            default: () => {
              return `${validate_component(Card_description, "CardDescription").$$render($$result, {}, {}, {
                default: () => {
                  return `Je n&#39;ai pas encore de compte ?`;
                }
              })} ${validate_component(Button, "Button").$$render($$result, { href: "/register", class: "px-4 py-0" }, {}, {
                default: () => {
                  return `S&#39;inscrire`;
                }
              })}`;
            }
          })}`;
        }
      }
    )}`;
  } while (!$$settled);
  $$unsubscribe_formData();
  return $$rendered;
});
export {
  Page as default
};
