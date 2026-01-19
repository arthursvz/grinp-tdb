import { a as subscribe } from './lifecycle-CY0VpZrS.js';
import { c as create_ssr_component, v as validate_component } from './ssr-CWJ7--iU.js';
import { C as Card, a as Card_header, b as Card_title } from './card-DqQ4sgdm.js';
import { C as Card_content } from './card-content-WV6OY6qq.js';
import { C as Card_description } from './card-description-CDPf-_7c.js';
import 'clsx';
import { F as Form_field, C as Control, a as Form_label, b as Form_field_errors, c as Form_button } from './index3-rtwFZWPP.js';
import { I as Input } from './input-BkXjnz0g.js';
import { b as superForm, c as zodClient, r as registerScheme } from './index-DCHBw7tG.js';
import './stores-CaFYFvqm.js';
import './index-Ddp2AB5f.js';
import './utils-BxIOvjB_.js';
import 'tailwind-merge';
import './button-B24JzdgH.js';
import './index2-7tr__D8z.js';
import './ssr2-BVSPLo1E.js';
import './scheduler-nF4nnj9q.js';
import '@internationalized/date';
import 'tailwind-variants';
import './create-CIUFflE4.js';
import './events-QmgrkfXC.js';
import 'zod';
import './stringify-CIuySMKb.js';
import './exports-BGi7-Rnc.js';

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

export { Page as default };
//# sourceMappingURL=_page.svelte-BuF_e-qe.js.map
