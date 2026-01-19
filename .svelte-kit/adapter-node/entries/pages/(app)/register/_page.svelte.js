import { a as subscribe } from "../../../../chunks/lifecycle.js";
import { c as create_ssr_component, v as validate_component } from "../../../../chunks/ssr.js";
import { C as Card, a as Card_header, b as Card_title } from "../../../../chunks/card.js";
import { C as Card_content } from "../../../../chunks/card-content.js";
import { C as Card_description } from "../../../../chunks/card-description.js";
import "clsx";
import { F as Form_field, C as Control, a as Form_label, b as Form_field_errors, c as Form_button } from "../../../../chunks/index3.js";
import { I as Input } from "../../../../chunks/input.js";
import { a as superForm, b as zodClient, d as registerScheme } from "../../../../chunks/zod.js";
import "../../../../chunks/stores.js";
import "just-clone";
import "ts-deepmerge";
import "../../../../chunks/index.js";
import "memoize-weak";
import "@exodus/schemasafe";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $formData, $$unsubscribe_formData;
  let { data } = $$props;
  const form = superForm(data.form, { validators: zodClient(registerScheme) });
  const { form: formData, enhance } = form;
  $$unsubscribe_formData = subscribe(formData, (value) => $formData = value);
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
                  return `Inscription`;
                }
              })} ${validate_component(Card_description, "CardDescription").$$render($$result, {}, {}, {
                default: () => {
                  return `Veuillez renseigner les informations ci-dessous pour vous inscrire`;
                }
              })}`;
            }
          })} <div class="relative" data-svelte-h="svelte-eeu87j"><div class="absolute inset-0 flex items-center"><span class="m-4 w-full border-t"></span></div></div> ${validate_component(Card_content, "CardContent").$$render($$result, { class: "pt-6" }, {}, {
            default: () => {
              return `<form method="POST" action="?/manual" class="w-full"><div class="flex gap-4">${validate_component(Form_field, "Form.Field").$$render(
                $$result,
                {
                  form,
                  name: "first_name",
                  class: "w-full"
                },
                {},
                {
                  default: () => {
                    return `${validate_component(Control, "Form.Control").$$render($$result, {}, {}, {
                      default: ({ attrs }) => {
                        return `${validate_component(Form_label, "Form.Label").$$render($$result, {}, {}, {
                          default: () => {
                            return `Prénom`;
                          }
                        })} ${validate_component(Input, "Input").$$render(
                          $$result,
                          Object.assign({}, { type: "text" }, attrs, { placeholder: "John" }, { value: $formData.first_name }),
                          {
                            value: ($$value) => {
                              $formData.first_name = $$value;
                              $$settled = false;
                            }
                          },
                          {}
                        )}`;
                      }
                    })} ${validate_component(Form_field_errors, "Form.FieldErrors").$$render($$result, {}, {}, {})}`;
                  }
                }
              )} ${validate_component(Form_field, "Form.Field").$$render($$result, { form, name: "last_name", class: "w-full" }, {}, {
                default: () => {
                  return `${validate_component(Control, "Form.Control").$$render($$result, {}, {}, {
                    default: ({ attrs }) => {
                      return `${validate_component(Form_label, "Form.Label").$$render($$result, {}, {}, {
                        default: () => {
                          return `Nom`;
                        }
                      })} ${validate_component(Input, "Input").$$render(
                        $$result,
                        Object.assign({}, { type: "text" }, attrs, { placeholder: "Doe" }, { value: $formData.last_name }),
                        {
                          value: ($$value) => {
                            $formData.last_name = $$value;
                            $$settled = false;
                          }
                        },
                        {}
                      )}`;
                    }
                  })} ${validate_component(Form_field_errors, "Form.FieldErrors").$$render($$result, {}, {}, {})}`;
                }
              })}</div> ${validate_component(Form_field, "Form.Field").$$render($$result, { form, name: "email" }, {}, {
                default: () => {
                  return `${validate_component(Control, "Form.Control").$$render($$result, {}, {}, {
                    default: ({ attrs }) => {
                      return `${validate_component(Form_label, "Form.Label").$$render($$result, {}, {}, {
                        default: () => {
                          return `E-Mail`;
                        }
                      })} ${validate_component(Input, "Input").$$render(
                        $$result,
                        Object.assign({}, { type: "email" }, attrs, { placeholder: "john.doe@exemple.fr" }, { value: $formData.email }),
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
              })} <div class="flex max-md:flex-col gap-4">${validate_component(Form_field, "Form.Field").$$render($$result, { form, name: "password", class: "w-full" }, {}, {
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
              })} ${validate_component(Form_field, "Form.Field").$$render(
                $$result,
                {
                  form,
                  name: "confirmPassword",
                  class: "w-full"
                },
                {},
                {
                  default: () => {
                    return `${validate_component(Control, "Form.Control").$$render($$result, {}, {}, {
                      default: ({ attrs }) => {
                        return `${validate_component(Form_label, "Form.Label").$$render($$result, {}, {}, {
                          default: () => {
                            return `Confirmation mot de passe`;
                          }
                        })} ${validate_component(Input, "Input").$$render(
                          $$result,
                          Object.assign({}, { type: "password" }, attrs, { value: $formData.confirmPassword }),
                          {
                            value: ($$value) => {
                              $formData.confirmPassword = $$value;
                              $$settled = false;
                            }
                          },
                          {}
                        )}`;
                      }
                    })} ${validate_component(Form_field_errors, "Form.FieldErrors").$$render($$result, {}, {}, {})}`;
                  }
                }
              )}</div> ${validate_component(Form_button, "Form.Button").$$render($$result, { class: "w-full" }, {}, {
                default: () => {
                  return `S&#39;inscrire`;
                }
              })}</form>`;
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
