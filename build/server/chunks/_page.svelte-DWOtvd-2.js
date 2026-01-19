import { c as create_ssr_component, v as validate_component, b as each, e as escape, s as spread, d as escape_attribute_value, f as escape_object, m as missing_component } from './ssr-CWJ7--iU.js';
import { C as Card, a as Card_header, b as Card_title } from './card-DqQ4sgdm.js';
import 'clsx';
import { C as Card_description } from './card-description-CDPf-_7c.js';
import { B as Button } from './button-B24JzdgH.js';
import { a as subscribe, j as compute_rest_props } from './lifecycle-CY0VpZrS.js';
import { I as Input } from './input-BkXjnz0g.js';
import { C as Card_content } from './card-content-WV6OY6qq.js';
import { C as Card_footer } from './card-footer-Cry1SJxO.js';
import { c as cn } from './utils-BxIOvjB_.js';
import { d as derivedKeys, i as isReadable, U as Undefined, c as createTable, a as addPagination } from './addPagination-Yu1BEFJ8.js';
import { u as users, s as slots, c as createRender, R as Root, T as Trigger, E as Ellipsis, D as Dropdown_menu_content, G as Group, a as Dropdown_menu_label, b as Dropdown_menu_item, d as Dropdown_menu_separator } from './stores2-D9kX37m3.js';
import { w as writable } from './index2-7tr__D8z.js';
import './ssr2-BVSPLo1E.js';
import './scheduler-nF4nnj9q.js';
import '@internationalized/date';
import 'tailwind-variants';
import 'tailwind-merge';
import './events-QmgrkfXC.js';
import './updater-Deg4O12E.js';

const Table = create_ssr_component(($$result, $$props, $$bindings, slots2) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `<div class="relative w-full overflow-auto"><table${spread(
    [
      {
        class: escape_attribute_value(cn("w-full caption-bottom text-sm", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots2.default ? slots2.default({}) : ``}</table></div>`;
});
const Table_body = create_ssr_component(($$result, $$props, $$bindings, slots2) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `<tbody${spread(
    [
      {
        class: escape_attribute_value(cn("[&_tr:last-child]:border-0", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots2.default ? slots2.default({}) : ``}</tbody>`;
});
const Table_cell = create_ssr_component(($$result, $$props, $$bindings, slots2) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `<td${spread(
    [
      {
        class: escape_attribute_value(cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots2.default ? slots2.default({}) : ``}</td>`;
});
const Table_head = create_ssr_component(($$result, $$props, $$bindings, slots2) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `<th${spread(
    [
      {
        class: escape_attribute_value(cn("text-muted-foreground h-12 px-4 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots2.default ? slots2.default({}) : ``}</th>`;
});
const Table_header = create_ssr_component(($$result, $$props, $$bindings, slots2) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return ` <thead${spread(
    [
      {
        class: escape_attribute_value(cn("[&_tr]:border-b", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots2.default ? slots2.default({}) : ``}</thead>`;
});
const Table_row = create_ssr_component(($$result, $$props, $$bindings, slots2) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `<tr${spread(
    [
      {
        class: escape_attribute_value(cn("hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots2.default ? slots2.default({}) : ``}</tr>`;
});
const Subscribe = create_ssr_component(($$result, $$props, $$bindings, slots2) => {
  let $$restProps = compute_rest_props($$props, []);
  let $values, $$unsubscribe_values;
  const values = derivedKeys($$restProps);
  $$unsubscribe_values = subscribe(values, (value) => $values = value);
  $$unsubscribe_values();
  return `${slots2.default ? slots2.default({ ...$values }) : ``}`;
});
const PropsRenderer = create_ssr_component(($$result, $$props, $$bindings, slots2) => {
  let { instance = void 0 } = $$props;
  let { config } = $$props;
  let { props = void 0 } = $$props;
  if ($$props.instance === void 0 && $$bindings.instance && instance !== void 0) $$bindings.instance(instance);
  if ($$props.config === void 0 && $$bindings.config && config !== void 0) $$bindings.config(config);
  if ($$props.props === void 0 && $$bindings.props && props !== void 0) $$bindings.props(props);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${config.children.length === 0 ? `${validate_component(config.component || missing_component, "svelte:component").$$render(
      $$result,
      Object.assign({}, props ?? {}, { this: instance }),
      {
        this: ($$value) => {
          instance = $$value;
          $$settled = false;
        }
      },
      {}
    )}` : `${validate_component(config.component || missing_component, "svelte:component").$$render(
      $$result,
      Object.assign({}, props ?? {}, { this: instance }),
      {
        this: ($$value) => {
          instance = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${each(config.children, (child) => {
            return `${validate_component(Render, "Render").$$render($$result, { of: child }, {}, {})}`;
          })}`;
        }
      }
    )}`}`;
  } while (!$$settled);
  return $$rendered;
});
const ComponentRenderer = create_ssr_component(($$result, $$props, $$bindings, slots2) => {
  let { config } = $$props;
  let instance;
  if ($$props.config === void 0 && $$bindings.config && config !== void 0) $$bindings.config(config);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${isReadable(config.props) ? `${validate_component(Subscribe, "Subscribe").$$render($$result, { props: config.props }, {}, {
      default: ({ props }) => {
        return `${validate_component(PropsRenderer, "PropsRenderer").$$render(
          $$result,
          { config, props, instance },
          {
            instance: ($$value) => {
              instance = $$value;
              $$settled = false;
            }
          },
          {}
        )}`;
      }
    })}` : `${validate_component(PropsRenderer, "PropsRenderer").$$render(
      $$result,
      { config, props: config.props, instance },
      {
        instance: ($$value) => {
          instance = $$value;
          $$settled = false;
        }
      },
      {}
    )}`}`;
  } while (!$$settled);
  return $$rendered;
});
const Render = create_ssr_component(($$result, $$props, $$bindings, slots2) => {
  let $readableConfig, $$unsubscribe_readableConfig;
  let { of: config } = $$props;
  const readableConfig = isReadable(config) ? config : Undefined;
  $$unsubscribe_readableConfig = subscribe(readableConfig, (value) => $readableConfig = value);
  if ($$props.of === void 0 && $$bindings.of && config !== void 0) $$bindings.of(config);
  $$unsubscribe_readableConfig();
  return `${isReadable(config) ? ` ${escape($readableConfig)}` : `${typeof config !== "object" ? `${escape(config)}` : `${validate_component(ComponentRenderer, "ComponentRenderer").$$render($$result, { config }, {}, {})}`}`}`;
});
const SlotManagement = create_ssr_component(($$result, $$props, $$bindings, slots2) => {
  let { id } = $$props;
  if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${validate_component(Root, "DropdownMenu.Root").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(Trigger, "DropdownMenu.Trigger").$$render($$result, { asChild: true }, {}, {
          default: ({ builder }) => {
            return `${validate_component(Button, "Button").$$render(
              $$result,
              {
                variant: "ghost",
                builders: [builder],
                size: "icon",
                class: "relative h-8 w-8 p-0"
              },
              {},
              {
                default: () => {
                  return `<span class="sr-only" data-svelte-h="svelte-rsbkxi">Open menu</span> ${validate_component(Ellipsis, "Ellipsis").$$render($$result, { class: "h-4 w-4" }, {}, {})}`;
                }
              }
            )}`;
          }
        })} ${validate_component(Dropdown_menu_content, "DropdownMenu.Content").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(Group, "DropdownMenu.Group").$$render($$result, {}, {}, {
              default: () => {
                return `${validate_component(Dropdown_menu_label, "DropdownMenu.Label").$$render($$result, {}, {}, {
                  default: () => {
                    return `Actions`;
                  }
                })}  ${validate_component(Dropdown_menu_item, "DropdownMenu.Item").$$render($$result, {}, {}, {
                  default: () => {
                    return `Copier l&#39;identifiant`;
                  }
                })}`;
              }
            })} ${validate_component(Dropdown_menu_separator, "DropdownMenu.Separator").$$render($$result, {}, {}, {})} ${validate_component(Group, "DropdownMenu.Group").$$render($$result, {}, {}, {
              default: () => {
                return ` ${validate_component(Dropdown_menu_item, "DropdownMenu.Item").$$render($$result, {}, {}, {
                  default: () => {
                    return `Supprimer le créneau`;
                  }
                })} ${validate_component(Dropdown_menu_item, "DropdownMenu.Item").$$render($$result, {}, {}, {
                  default: () => {
                    return `Modifier le créneau`;
                  }
                })}`;
              }
            })}`;
          }
        })}`;
      }
    })} ${``}`;
  } while (!$$settled);
  return $$rendered;
});
const SlotTable = create_ssr_component(($$result, $$props, $$bindings, slots$1) => {
  let $users, $$unsubscribe_users;
  let $tableAttrs, $$unsubscribe_tableAttrs;
  let $headerRows, $$unsubscribe_headerRows;
  let $tableBodyAttrs, $$unsubscribe_tableBodyAttrs;
  let $pageRows, $$unsubscribe_pageRows;
  let $pageIndex, $$unsubscribe_pageIndex;
  let $hasPreviousPage, $$unsubscribe_hasPreviousPage;
  let $pageCount, $$unsubscribe_pageCount;
  let $hasNextPage, $$unsubscribe_hasNextPage;
  let { slots: slots2 } = $$props;
  let { users: users2 } = $$props;
  $$unsubscribe_users = subscribe(users2, (value) => $users = value);
  let searchQuery = "";
  let allSlots = [];
  let filteredSlotsStore = writable([]);
  slots2.subscribe((s) => {
    allSlots = s;
    updateFiltered();
  });
  function updateFiltered() {
    if (searchQuery.trim() === "") {
      filteredSlotsStore.set(allSlots);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = allSlots.filter((slot) => {
        return slot.name && slot.name.toLowerCase().includes(query) || slot.description && slot.description.toLowerCase().includes(query);
      });
      filteredSlotsStore.set(filtered);
    }
  }
  const table = createTable(filteredSlotsStore, {
    page: addPagination({ initialPageSize: 5 })
  });
  const columns = table.createColumns([
    table.column({
      accessor: ({ id }) => id.substring(0, 8) + "...",
      header: "ID"
    }),
    table.column({ accessor: "name", header: "Nom" }),
    table.column({
      accessor: ({ description }) => description?.substring(0, 20) + "...",
      header: "Description"
    }),
    table.column({
      // Format the date to be more readable
      accessor: ({ starts_at }) => new Date(starts_at).toLocaleString(),
      header: "Début"
    }),
    table.column({
      accessor: ({ ends_at }) => new Date(ends_at).toLocaleString(),
      header: "Fin"
    }),
    table.column({ accessor: "capacity", header: "Jauge" }),
    table.column({
      accessor: "slot_type",
      header: "Type",
      cell: ({ value }) => {
        if (value === "EVENEMENT") return "Évènement";
        if (value === "FERMETURE") return "Fermeture";
        return "Créneau";
      }
    }),
    table.column({
      accessor: (slot) => {
        const responsibles = slot.responsibles;
        if (responsibles && responsibles.length > 0) {
          return responsibles.map((u) => `${u.first_name} ${u.last_name}`).join(", ");
        }
        const user = $users.find((user2) => user2.id === slot.owner_id);
        return user ? `${user.first_name} ${user.last_name}` : "";
      },
      header: "Responsables"
    }),
    table.column({
      accessor: ({ id }) => id,
      header: "Modifier",
      cell: ({ value }) => {
        return createRender(SlotManagement, { id: value });
      }
    })
  ]);
  const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } = table.createViewModel(columns);
  $$unsubscribe_headerRows = subscribe(headerRows, (value) => $headerRows = value);
  $$unsubscribe_pageRows = subscribe(pageRows, (value) => $pageRows = value);
  $$unsubscribe_tableAttrs = subscribe(tableAttrs, (value) => $tableAttrs = value);
  $$unsubscribe_tableBodyAttrs = subscribe(tableBodyAttrs, (value) => $tableBodyAttrs = value);
  const { hasNextPage, hasPreviousPage, pageIndex, pageCount } = pluginStates.page;
  $$unsubscribe_hasNextPage = subscribe(hasNextPage, (value) => $hasNextPage = value);
  $$unsubscribe_hasPreviousPage = subscribe(hasPreviousPage, (value) => $hasPreviousPage = value);
  $$unsubscribe_pageIndex = subscribe(pageIndex, (value) => $pageIndex = value);
  $$unsubscribe_pageCount = subscribe(pageCount, (value) => $pageCount = value);
  if ($$props.slots === void 0 && $$bindings.slots && slots2 !== void 0) $$bindings.slots(slots2);
  if ($$props.users === void 0 && $$bindings.users && users2 !== void 0) $$bindings.users(users2);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      updateFiltered();
    }
    $$rendered = `${validate_component(Card_content, "CardContent").$$render($$result, { class: "flex flex-col gap-4 pt-6" }, {}, {
      default: () => {
        return `<div class="flex items-center justify-between gap-4"><h2 class="text-base font-semibold" data-svelte-h="svelte-jb09ko">Créneaux :</h2> ${validate_component(Input, "Input").$$render(
          $$result,
          {
            type: "text",
            placeholder: "Rechercher par nom ou description...",
            class: "max-w-xs",
            value: searchQuery
          },
          {
            value: ($$value) => {
              searchQuery = $$value;
              $$settled = false;
            }
          },
          {}
        )}</div> <div class="rounded-md border w-full">${validate_component(Table, "Table.Root").$$render($$result, Object.assign({}, $tableAttrs), {}, {
          default: () => {
            return `${validate_component(Table_header, "Table.Header").$$render($$result, {}, {}, {
              default: () => {
                return `${each($headerRows, (headerRow) => {
                  return `${validate_component(Subscribe, "Subscribe").$$render($$result, { rowAttrs: headerRow.attrs() }, {}, {
                    default: () => {
                      return `${validate_component(Table_row, "Table.Row").$$render($$result, {}, {}, {
                        default: () => {
                          return `${each(headerRow.cells, (cell) => {
                            return `${validate_component(Subscribe, "Subscribe").$$render($$result, { attrs: cell.attrs(), props: cell.props() }, {}, {
                              default: ({ attrs }) => {
                                return `${validate_component(Table_head, "Table.Head").$$render($$result, Object.assign({}, attrs), {}, {
                                  default: () => {
                                    return `${validate_component(Render, "Render").$$render($$result, { of: cell.render() }, {}, {})} `;
                                  }
                                })} `;
                              }
                            })}`;
                          })} `;
                        }
                      })} `;
                    }
                  })}`;
                })}`;
              }
            })} ${validate_component(Table_body, "Table.Body").$$render($$result, Object.assign({}, $tableBodyAttrs), {}, {
              default: () => {
                return `${each($pageRows, (row) => {
                  return `${validate_component(Subscribe, "Subscribe").$$render($$result, { rowAttrs: row.attrs() }, {}, {
                    default: ({ rowAttrs }) => {
                      return `${validate_component(Table_row, "Table.Row").$$render($$result, Object.assign({}, rowAttrs), {}, {
                        default: () => {
                          return `${each(row.cells, (cell) => {
                            return `${validate_component(Subscribe, "Subscribe").$$render($$result, { attrs: cell.attrs() }, {}, {
                              default: ({ attrs }) => {
                                return `${validate_component(Table_cell, "Table.Cell").$$render($$result, Object.assign({}, attrs), {}, {
                                  default: () => {
                                    return `${validate_component(Render, "Render").$$render($$result, { of: cell.render() }, {}, {})} `;
                                  }
                                })} `;
                              }
                            })}`;
                          })} `;
                        }
                      })} `;
                    }
                  })}`;
                })}`;
              }
            })}`;
          }
        })}</div>`;
      }
    })} <div class="relative" data-svelte-h="svelte-hn2wyx"><div class="absolute inset-0 flex items-center"><span class="w-full border-t"></span></div></div> ${validate_component(Card_footer, "CardFooter").$$render($$result, {}, {}, {
      default: () => {
        return `<div class="flex items-center justify-end space-x-4 py-4">${validate_component(Button, "Button").$$render(
          $$result,
          {
            variant: "outline",
            size: "sm",
            disabled: !$hasPreviousPage
          },
          {},
          {
            default: () => {
              return `Previous`;
            }
          }
        )} <span class="text-gray-500">Page ${escape($pageIndex + 1)} / ${escape($pageCount)}</span> ${validate_component(Button, "Button").$$render(
          $$result,
          {
            variant: "outline",
            size: "sm",
            disabled: !$hasNextPage
          },
          {},
          {
            default: () => {
              return `Next`;
            }
          }
        )}</div>`;
      }
    })}`;
  } while (!$$settled);
  $$unsubscribe_users();
  $$unsubscribe_tableAttrs();
  $$unsubscribe_headerRows();
  $$unsubscribe_tableBodyAttrs();
  $$unsubscribe_pageRows();
  $$unsubscribe_pageIndex();
  $$unsubscribe_hasPreviousPage();
  $$unsubscribe_pageCount();
  $$unsubscribe_hasNextPage();
  return $$rendered;
});
const UserManagement = create_ssr_component(($$result, $$props, $$bindings, slots2) => {
  let { id } = $$props;
  if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
  return `${validate_component(Root, "DropdownMenu.Root").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Trigger, "DropdownMenu.Trigger").$$render($$result, { asChild: true }, {}, {
        default: ({ builder }) => {
          return `${validate_component(Button, "Button").$$render(
            $$result,
            {
              variant: "ghost",
              builders: [builder],
              size: "icon",
              class: "relative h-8 w-8 p-0"
            },
            {},
            {
              default: () => {
                return `<span class="sr-only" data-svelte-h="svelte-rsbkxi">Open menu</span> ${validate_component(Ellipsis, "Ellipsis").$$render($$result, { class: "h-4 w-4" }, {}, {})}`;
              }
            }
          )}`;
        }
      })} ${validate_component(Dropdown_menu_content, "DropdownMenu.Content").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Group, "DropdownMenu.Group").$$render($$result, {}, {}, {
            default: () => {
              return `${validate_component(Dropdown_menu_label, "DropdownMenu.Label").$$render($$result, {}, {}, {
                default: () => {
                  return `Actions`;
                }
              })}  ${validate_component(Dropdown_menu_item, "DropdownMenu.Item").$$render($$result, {}, {}, {
                default: () => {
                  return `Copier l&#39;identifiant`;
                }
              })}`;
            }
          })} ${validate_component(Dropdown_menu_separator, "DropdownMenu.Separator").$$render($$result, {}, {}, {})} ${validate_component(Group, "DropdownMenu.Group").$$render($$result, {}, {}, {
            default: () => {
              return ` ${validate_component(Dropdown_menu_item, "DropdownMenu.Item").$$render($$result, {}, {}, {
                default: () => {
                  return `Modifier instructor`;
                }
              })}  ${validate_component(Dropdown_menu_item, "DropdownMenu.Item").$$render($$result, {}, {}, {
                default: () => {
                  return `Modifier root`;
                }
              })}  ${validate_component(Dropdown_menu_item, "DropdownMenu.Item").$$render($$result, {}, {}, {
                default: () => {
                  return `Modifier cotisant AS`;
                }
              })} ${validate_component(Dropdown_menu_item, "DropdownMenu.Item").$$render($$result, {}, {}, {
                default: () => {
                  return `Modifier cotisant Gr&#39;INP`;
                }
              })}  ${validate_component(Dropdown_menu_item, "DropdownMenu.Item").$$render($$result, {}, {}, {
                default: () => {
                  return `Supprimer l&#39;utilisateur`;
                }
              })}`;
            }
          })}`;
        }
      })}`;
    }
  })}`;
});
const UserTable = create_ssr_component(($$result, $$props, $$bindings, slots2) => {
  let $tableAttrs, $$unsubscribe_tableAttrs;
  let $headerRows, $$unsubscribe_headerRows;
  let $tableBodyAttrs, $$unsubscribe_tableBodyAttrs;
  let $pageRows, $$unsubscribe_pageRows;
  let $pageIndex, $$unsubscribe_pageIndex;
  let $hasPreviousPage, $$unsubscribe_hasPreviousPage;
  let $pageCount, $$unsubscribe_pageCount;
  let $hasNextPage, $$unsubscribe_hasNextPage;
  let { users: users2 } = $$props;
  let searchQuery = "";
  let allUsers = [];
  let filteredUsersStore = writable([]);
  users2.subscribe((u) => {
    allUsers = u;
    updateFiltered();
  });
  function updateFiltered() {
    if (searchQuery.trim() === "") {
      filteredUsersStore.set(allUsers);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = allUsers.filter((user) => {
        return user.first_name.toLowerCase().includes(query) || user.last_name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query) || user.churros_uid && user.churros_uid.toLowerCase().includes(query);
      });
      filteredUsersStore.set(filtered);
    }
  }
  const table = createTable(filteredUsersStore, {
    page: addPagination({ initialPageSize: 5 })
  });
  const columns = table.createColumns([
    table.column({
      accessor: ({ id }) => id.substring(0, 8) + "...",
      header: "ID"
    }),
    table.column({
      accessor: "churros_uid",
      header: "Churros UID"
    }),
    table.column({
      accessor: "first_name",
      header: "First Name"
    }),
    table.column({
      accessor: "last_name",
      header: "Last Name"
    }),
    table.column({ accessor: "email", header: "Email" }),
    table.column({ accessor: "root", header: "Root" }),
    table.column({
      accessor: "instructor",
      header: "Instructor"
    }),
    table.column({
      accessor: "cotisant_as",
      header: "Cotisant AS"
    }),
    table.column({
      accessor: "cotisant_grinp",
      header: "Cotisant Grinp"
    }),
    table.column({
      accessor: ({ id }) => id,
      header: "Modifier",
      cell: ({ value }) => {
        return createRender(UserManagement, { id: value });
      }
    })
  ]);
  const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } = table.createViewModel(columns);
  $$unsubscribe_headerRows = subscribe(headerRows, (value) => $headerRows = value);
  $$unsubscribe_pageRows = subscribe(pageRows, (value) => $pageRows = value);
  $$unsubscribe_tableAttrs = subscribe(tableAttrs, (value) => $tableAttrs = value);
  $$unsubscribe_tableBodyAttrs = subscribe(tableBodyAttrs, (value) => $tableBodyAttrs = value);
  const { hasNextPage, hasPreviousPage, pageIndex, pageCount } = pluginStates.page;
  $$unsubscribe_hasNextPage = subscribe(hasNextPage, (value) => $hasNextPage = value);
  $$unsubscribe_hasPreviousPage = subscribe(hasPreviousPage, (value) => $hasPreviousPage = value);
  $$unsubscribe_pageIndex = subscribe(pageIndex, (value) => $pageIndex = value);
  $$unsubscribe_pageCount = subscribe(pageCount, (value) => $pageCount = value);
  if ($$props.users === void 0 && $$bindings.users && users2 !== void 0) $$bindings.users(users2);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      updateFiltered();
    }
    $$rendered = `${validate_component(Card_content, "CardContent").$$render($$result, { class: "flex flex-col gap-4 pt-6" }, {}, {
      default: () => {
        return `<div class="flex items-center justify-between gap-4"><h2 class="text-base font-semibold" data-svelte-h="svelte-oef2f9">Utilisateurs :</h2> ${validate_component(Input, "Input").$$render(
          $$result,
          {
            type: "text",
            placeholder: "Rechercher par nom, email ou Churros UID...",
            class: "max-w-xs",
            value: searchQuery
          },
          {
            value: ($$value) => {
              searchQuery = $$value;
              $$settled = false;
            }
          },
          {}
        )}</div> <div class="rounded-md border w-full">${validate_component(Table, "Table.Root").$$render($$result, Object.assign({}, $tableAttrs), {}, {
          default: () => {
            return `${validate_component(Table_header, "Table.Header").$$render($$result, {}, {}, {
              default: () => {
                return `${each($headerRows, (headerRow) => {
                  return `${validate_component(Subscribe, "Subscribe").$$render($$result, { rowAttrs: headerRow.attrs() }, {}, {
                    default: () => {
                      return `${validate_component(Table_row, "Table.Row").$$render($$result, {}, {}, {
                        default: () => {
                          return `${each(headerRow.cells, (cell) => {
                            return `${validate_component(Subscribe, "Subscribe").$$render($$result, { attrs: cell.attrs(), props: cell.props() }, {}, {
                              default: ({ attrs }) => {
                                return `${validate_component(Table_head, "Table.Head").$$render($$result, Object.assign({}, attrs), {}, {
                                  default: () => {
                                    return `${validate_component(Render, "Render").$$render($$result, { of: cell.render() }, {}, {})} `;
                                  }
                                })} `;
                              }
                            })}`;
                          })} `;
                        }
                      })} `;
                    }
                  })}`;
                })}`;
              }
            })} ${validate_component(Table_body, "Table.Body").$$render($$result, Object.assign({}, $tableBodyAttrs), {}, {
              default: () => {
                return `${each($pageRows, (row) => {
                  return `${validate_component(Subscribe, "Subscribe").$$render($$result, { rowAttrs: row.attrs() }, {}, {
                    default: ({ rowAttrs }) => {
                      return `${validate_component(Table_row, "Table.Row").$$render($$result, Object.assign({}, rowAttrs), {}, {
                        default: () => {
                          return `${each(row.cells, (cell) => {
                            return `${validate_component(Subscribe, "Subscribe").$$render($$result, { attrs: cell.attrs() }, {}, {
                              default: ({ attrs }) => {
                                return `${validate_component(Table_cell, "Table.Cell").$$render($$result, Object.assign({}, attrs), {}, {
                                  default: () => {
                                    return `${validate_component(Render, "Render").$$render($$result, { of: cell.render() }, {}, {})} `;
                                  }
                                })} `;
                              }
                            })}`;
                          })} `;
                        }
                      })} `;
                    }
                  })}`;
                })}`;
              }
            })}`;
          }
        })}</div>`;
      }
    })} <div class="relative" data-svelte-h="svelte-hn2wyx"><div class="absolute inset-0 flex items-center"><span class="w-full border-t"></span></div></div> ${validate_component(Card_footer, "CardFooter").$$render($$result, {}, {}, {
      default: () => {
        return `<div class="flex items-center justify-end space-x-4 py-4">${validate_component(Button, "Button").$$render(
          $$result,
          {
            variant: "outline",
            size: "sm",
            disabled: !$hasPreviousPage
          },
          {},
          {
            default: () => {
              return `Previous`;
            }
          }
        )} <span class="text-gray-500">Page ${escape($pageIndex + 1)} / ${escape($pageCount)}</span> ${validate_component(Button, "Button").$$render(
          $$result,
          {
            variant: "outline",
            size: "sm",
            disabled: !$hasNextPage
          },
          {},
          {
            default: () => {
              return `Next`;
            }
          }
        )}</div>`;
      }
    })}`;
  } while (!$$settled);
  $$unsubscribe_tableAttrs();
  $$unsubscribe_headerRows();
  $$unsubscribe_tableBodyAttrs();
  $$unsubscribe_pageRows();
  $$unsubscribe_pageIndex();
  $$unsubscribe_hasPreviousPage();
  $$unsubscribe_pageCount();
  $$unsubscribe_hasNextPage();
  return $$rendered;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots$1) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  {
    {
      users.set(data.users);
      slots.set(data.slots);
    }
  }
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
            return `${validate_component(Card_title, "CardTitle").$$render($$result, {}, {}, {
              default: () => {
                return `Admin`;
              }
            })} ${validate_component(Card_description, "CardDescription").$$render($$result, {}, {}, {
              default: () => {
                return `Pannel admin du site`;
              }
            })} <div class="flex flex-wrap gap-2 pt-4">${validate_component(Button, "Button").$$render($$result, { variant: "outline" }, {}, {
              default: () => {
                return `Réinitialiser cotisations AS`;
              }
            })} ${validate_component(Button, "Button").$$render($$result, { variant: "outline" }, {}, {
              default: () => {
                return `Réinitialiser cotisations Gr&#39;INP`;
              }
            })} ${validate_component(Button, "Button").$$render($$result, { variant: "outline" }, {}, {
              default: () => {
                return `Télécharger la base`;
              }
            })} ${validate_component(Button, "Button").$$render($$result, { variant: "destructive" }, {}, {
              default: () => {
                return `Réinitialiser la base complète`;
              }
            })}</div>`;
          }
        })} <div class="relative" data-svelte-h="svelte-eeu87j"><div class="absolute inset-0 flex items-center"><span class="m-4 w-full border-t"></span></div></div> ${validate_component(UserTable, "UserTable").$$render($$result, { users }, {}, {})} <div class="relative" data-svelte-h="svelte-eeu87j"><div class="absolute inset-0 flex items-center"><span class="m-4 w-full border-t"></span></div></div> ${validate_component(SlotTable, "SlotTable").$$render($$result, { slots, users }, {}, {})}`;
      }
    }
  )}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-DWOtvd-2.js.map
