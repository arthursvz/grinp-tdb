import { a as subscribe, j as compute_rest_props, s as setContext, f as getContext, g as get_store_value } from './lifecycle-CY0VpZrS.js';
import { c as create_ssr_component, v as validate_component, b as each, e as escape, s as spread, f as escape_object, a as add_attribute, d as escape_attribute_value } from './ssr-CWJ7--iU.js';
import { p as page } from './stores-CaFYFvqm.js';
import { C as Card, a as Card_header, b as Card_title } from './card-DqQ4sgdm.js';
import { C as Card_content } from './card-content-WV6OY6qq.js';
import { C as Card_description } from './card-description-CDPf-_7c.js';
import 'clsx';
import { A as buttonVariants, C as createCalendar, B as Button, w as withGet, a as overridable, t as toWritableStores, o as omit, v as createElHelpers, g as generateIds, D as dequal, E as isObject, G as stripValues, m as makeElement, x as disabledAttr, e as executeCallbacks, f as addMeltEventListener, k as kbd, H as isHTMLButtonElement, i as isHTMLElement, z as last, F as FIRST_LAST_KEYS, h as isElementDisabled, I as back, J as forward, K as prev, L as next, u as useEscapeKeydown, s as styleToString, d as effect, y as isElement, M as generateId, N as createHiddenInput, j as safeOnMount, q as isBrowser, O as getElementByMeltId, P as isHTMLLabelElement, Q as isHTMLInputElement, n as noop, R as toggle } from './button-B24JzdgH.js';
import { g as getFlash } from './client-C_FWtZYl.js';
import { b as superForm, c as zodClient, a as slotScheme } from './index-DCHBw7tG.js';
import './index-Ddp2AB5f.js';
import { d as derived, w as writable, a as readonly } from './index2-7tr__D8z.js';
import { c as createTable, a as addPagination } from './addPagination-Yu1BEFJ8.js';
import { e as attendees, p as participants, c as createRender, f as unsubscribe_slot, I as Icon, R as Root$1, T as Trigger, E as Ellipsis, D as Dropdown_menu_content, G as Group, a as Dropdown_menu_label, b as Dropdown_menu_item, d as Dropdown_menu_separator, g as getPositioningUpdater, h as createTypeaheadSearch, i as derivedVisible, j as usePopper, k as getPortalDestination, l as addHighlight, r as removeHighlight, m as removeScroll } from './stores2-D9kX37m3.js';
import { c as createDispatcher, a as createBitAttrs } from './events-QmgrkfXC.js';
import { r as removeUndefined, g as getOptionUpdater } from './updater-Deg4O12E.js';
import { c as cn, f as flyAndScale, a as cubicOut } from './utils-BxIOvjB_.js';
import { today, getLocalTimeZone, DateFormatter } from '@internationalized/date';
import { t as tick } from './scheduler-nF4nnj9q.js';
import { c as createLabel } from './create-CIUFflE4.js';
import './exports-BGi7-Rnc.js';
import './ssr2-BVSPLo1E.js';
import 'tailwind-variants';
import 'zod';
import './stringify-CIuySMKb.js';
import 'tailwind-merge';

function getOptions(el) {
  return Array.from(el.querySelectorAll('[role="option"]:not([data-disabled])')).filter((el2) => isHTMLElement(el2));
}
function createClickOutsideIgnore(meltId) {
  return (e) => {
    const target = e.target;
    const triggerEl = getElementByMeltId(meltId);
    if (!triggerEl || !isElement(target))
      return false;
    const id = triggerEl.id;
    if (isHTMLLabelElement(target) && id === target.htmlFor) {
      return true;
    }
    if (target.closest(`label[for="${id}"]`)) {
      return true;
    }
    return false;
  };
}
const INTERACTION_KEYS = [kbd.ARROW_LEFT, kbd.ESCAPE, kbd.ARROW_RIGHT, kbd.SHIFT, kbd.CAPS_LOCK, kbd.CONTROL, kbd.ALT, kbd.META, kbd.ENTER, kbd.F1, kbd.F2, kbd.F3, kbd.F4, kbd.F5, kbd.F6, kbd.F7, kbd.F8, kbd.F9, kbd.F10, kbd.F11, kbd.F12];
const defaults = {
  positioning: {
    placement: "bottom",
    sameWidth: true
  },
  scrollAlignment: "nearest",
  loop: true,
  defaultOpen: false,
  closeOnOutsideClick: true,
  preventScroll: true,
  closeOnEscape: true,
  forceVisible: false,
  portal: void 0,
  builder: "listbox",
  disabled: false,
  required: false,
  name: void 0,
  typeahead: true,
  highlightOnHover: true,
  onOutsideClick: void 0
};
const listboxIdParts = ["trigger", "menu", "label"];
function createListbox(props) {
  const withDefaults = { ...defaults, ...props };
  const activeTrigger = withGet(writable(null));
  const highlightedItem = withGet(writable(null));
  const selectedWritable = withDefaults.selected ?? writable(withDefaults.defaultSelected);
  const selected = overridable(selectedWritable, withDefaults?.onSelectedChange);
  const highlighted = derived(highlightedItem, ($highlightedItem) => $highlightedItem ? getOptionProps($highlightedItem) : void 0);
  const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
  const open = overridable(openWritable, withDefaults?.onOpenChange);
  const options = toWritableStores({
    ...omit(withDefaults, "open", "defaultOpen", "builder", "ids"),
    multiple: withDefaults.multiple ?? false
  });
  const { scrollAlignment, loop, closeOnOutsideClick, closeOnEscape, preventScroll, portal, forceVisible, positioning, multiple, arrowSize, disabled, required, typeahead, name: nameProp, highlightOnHover, onOutsideClick } = options;
  const { name, selector } = createElHelpers(withDefaults.builder);
  const ids = toWritableStores({ ...generateIds(listboxIdParts), ...withDefaults.ids });
  const { handleTypeaheadSearch } = createTypeaheadSearch({
    onMatch: (element) => {
      highlightedItem.set(element);
      element.scrollIntoView({ block: scrollAlignment.get() });
    },
    getCurrentItem() {
      return highlightedItem.get();
    }
  });
  function getOptionProps(el) {
    const value = el.getAttribute("data-value");
    const label2 = el.getAttribute("data-label");
    const disabled2 = el.hasAttribute("data-disabled");
    return {
      value: value ? JSON.parse(value) : value,
      label: label2 ?? el.textContent ?? void 0,
      disabled: disabled2 ? true : false
    };
  }
  const setOption = (newOption) => {
    selected.update(($option) => {
      const $multiple = multiple.get();
      if ($multiple) {
        const optionArr = Array.isArray($option) ? [...$option] : [];
        return toggle(newOption, optionArr, (itemA, itemB) => dequal(itemA.value, itemB.value));
      }
      return newOption;
    });
  };
  function selectItem(item) {
    const props2 = getOptionProps(item);
    setOption(props2);
  }
  async function openMenu() {
    open.set(true);
    const triggerEl = document.getElementById(ids.trigger.get());
    if (!triggerEl)
      return;
    if (triggerEl !== activeTrigger.get())
      activeTrigger.set(triggerEl);
    await tick();
    const menuElement = document.getElementById(ids.menu.get());
    if (!isHTMLElement(menuElement))
      return;
    const selectedItem = menuElement.querySelector("[aria-selected=true]");
    if (!isHTMLElement(selectedItem))
      return;
    highlightedItem.set(selectedItem);
  }
  function closeMenu() {
    open.set(false);
    highlightedItem.set(null);
  }
  const isVisible = derivedVisible({ open, forceVisible, activeTrigger });
  const isSelected = derived([selected], ([$selected]) => {
    return (value) => {
      if (Array.isArray($selected)) {
        return $selected.some((o) => dequal(o.value, value));
      }
      if (isObject(value)) {
        return dequal($selected?.value, stripValues(value, void 0));
      }
      return dequal($selected?.value, value);
    };
  });
  const isHighlighted = derived([highlighted], ([$value]) => {
    return (item) => {
      return dequal($value?.value, item);
    };
  });
  const trigger = makeElement(name("trigger"), {
    stores: [open, highlightedItem, disabled, ids.menu, ids.trigger, ids.label],
    returned: ([$open, $highlightedItem, $disabled, $menuId, $triggerId, $labelId]) => {
      return {
        "aria-activedescendant": $highlightedItem?.id,
        "aria-autocomplete": "list",
        "aria-controls": $menuId,
        "aria-expanded": $open,
        "aria-labelledby": $labelId,
        // autocomplete: 'off',
        id: $triggerId,
        role: "combobox",
        disabled: disabledAttr($disabled),
        type: withDefaults.builder === "select" ? "button" : void 0
      };
    },
    action: (node) => {
      const isInput = isHTMLInputElement(node);
      const unsubscribe = executeCallbacks(
        addMeltEventListener(node, "click", () => {
          node.focus();
          const $open = open.get();
          if ($open) {
            closeMenu();
          } else {
            openMenu();
          }
        }),
        // Handle all input key events including typing, meta, and navigation.
        addMeltEventListener(node, "keydown", (e) => {
          const $open = open.get();
          if (!$open) {
            if (INTERACTION_KEYS.includes(e.key)) {
              return;
            }
            if (e.key === kbd.TAB) {
              return;
            }
            if (e.key === kbd.BACKSPACE && isInput && node.value === "") {
              return;
            }
            if (e.key === kbd.SPACE && isHTMLButtonElement(node)) {
              return;
            }
            openMenu();
            tick().then(() => {
              const $selectedItem = selected.get();
              if ($selectedItem)
                return;
              const menuEl = document.getElementById(ids.menu.get());
              if (!isHTMLElement(menuEl))
                return;
              const enabledItems = Array.from(menuEl.querySelectorAll(`${selector("item")}:not([data-disabled]):not([data-hidden])`)).filter((item) => isHTMLElement(item));
              if (!enabledItems.length)
                return;
              if (e.key === kbd.ARROW_DOWN) {
                highlightedItem.set(enabledItems[0]);
                enabledItems[0].scrollIntoView({ block: scrollAlignment.get() });
              } else if (e.key === kbd.ARROW_UP) {
                highlightedItem.set(last(enabledItems));
                last(enabledItems).scrollIntoView({ block: scrollAlignment.get() });
              }
            });
          }
          if (e.key === kbd.TAB) {
            closeMenu();
            return;
          }
          if (e.key === kbd.ENTER && !e.isComposing || e.key === kbd.SPACE && isHTMLButtonElement(node)) {
            e.preventDefault();
            const $highlightedItem = highlightedItem.get();
            if ($highlightedItem) {
              selectItem($highlightedItem);
            }
            if (!multiple.get()) {
              closeMenu();
            }
          }
          if (e.key === kbd.ARROW_UP && e.altKey) {
            closeMenu();
          }
          if (FIRST_LAST_KEYS.includes(e.key)) {
            e.preventDefault();
            const menuElement = document.getElementById(ids.menu.get());
            if (!isHTMLElement(menuElement))
              return;
            const itemElements = getOptions(menuElement);
            if (!itemElements.length)
              return;
            const candidateNodes = itemElements.filter((opt) => !isElementDisabled(opt) && opt.dataset.hidden === void 0);
            const $currentItem = highlightedItem.get();
            const currentIndex = $currentItem ? candidateNodes.indexOf($currentItem) : -1;
            const $loop = loop.get();
            const $scrollAlignment = scrollAlignment.get();
            let nextItem;
            switch (e.key) {
              case kbd.ARROW_DOWN:
                nextItem = next(candidateNodes, currentIndex, $loop);
                break;
              case kbd.ARROW_UP:
                nextItem = prev(candidateNodes, currentIndex, $loop);
                break;
              case kbd.PAGE_DOWN:
                nextItem = forward(candidateNodes, currentIndex, 10, $loop);
                break;
              case kbd.PAGE_UP:
                nextItem = back(candidateNodes, currentIndex, 10, $loop);
                break;
              case kbd.HOME:
                nextItem = candidateNodes[0];
                break;
              case kbd.END:
                nextItem = last(candidateNodes);
                break;
              default:
                return;
            }
            highlightedItem.set(nextItem);
            nextItem?.scrollIntoView({ block: $scrollAlignment });
          } else if (typeahead.get()) {
            const menuEl = document.getElementById(ids.menu.get());
            if (!isHTMLElement(menuEl))
              return;
            handleTypeaheadSearch(e.key, getOptions(menuEl));
          }
        })
      );
      let unsubEscapeKeydown = noop;
      const escape2 = useEscapeKeydown(node, {
        handler: closeMenu,
        enabled: derived([open, closeOnEscape], ([$open, $closeOnEscape]) => {
          return $open && $closeOnEscape;
        })
      });
      if (escape2 && escape2.destroy) {
        unsubEscapeKeydown = escape2.destroy;
      }
      return {
        destroy() {
          unsubscribe();
          unsubEscapeKeydown();
        }
      };
    }
  });
  const menu = makeElement(name("menu"), {
    stores: [isVisible, ids.menu],
    returned: ([$isVisible, $menuId]) => {
      return {
        hidden: $isVisible ? void 0 : true,
        id: $menuId,
        role: "listbox",
        style: styleToString({ display: $isVisible ? void 0 : "none" })
      };
    },
    action: (node) => {
      let unsubPopper = noop;
      const unsubscribe = executeCallbacks(
        // Bind the popper portal to the input element.
        effect([isVisible, portal, closeOnOutsideClick, positioning, activeTrigger], ([$isVisible, $portal, $closeOnOutsideClick, $positioning, $activeTrigger]) => {
          unsubPopper();
          if (!$isVisible || !$activeTrigger)
            return;
          tick().then(() => {
            unsubPopper();
            const ignoreHandler = createClickOutsideIgnore(ids.trigger.get());
            unsubPopper = usePopper(node, {
              anchorElement: $activeTrigger,
              open,
              options: {
                floating: $positioning,
                focusTrap: null,
                modal: {
                  closeOnInteractOutside: $closeOnOutsideClick,
                  onClose: closeMenu,
                  open: $isVisible,
                  shouldCloseOnInteractOutside: (e) => {
                    onOutsideClick.get()?.(e);
                    if (e.defaultPrevented)
                      return false;
                    const target = e.target;
                    if (!isElement(target))
                      return false;
                    if (target === $activeTrigger || $activeTrigger.contains(target)) {
                      return false;
                    }
                    if (ignoreHandler(e))
                      return false;
                    return true;
                  }
                },
                escapeKeydown: null,
                portal: getPortalDestination(node, $portal)
              }
            }).destroy;
          });
        })
      );
      return {
        destroy: () => {
          unsubscribe();
          unsubPopper();
        }
      };
    }
  });
  const { elements: { root: labelBuilder } } = createLabel();
  const { action: labelAction } = get_store_value(labelBuilder);
  const label = makeElement(name("label"), {
    stores: [ids.label, ids.trigger],
    returned: ([$labelId, $triggerId]) => {
      return {
        id: $labelId,
        for: $triggerId
      };
    },
    action: labelAction
  });
  const option = makeElement(name("option"), {
    stores: [isSelected],
    returned: ([$isSelected]) => (props2) => {
      const selected2 = $isSelected(props2.value);
      return {
        "data-value": JSON.stringify(props2.value),
        "data-label": props2.label,
        "data-disabled": disabledAttr(props2.disabled),
        "aria-disabled": props2.disabled ? true : void 0,
        "aria-selected": selected2,
        "data-selected": selected2 ? "" : void 0,
        id: generateId(),
        role: "option"
      };
    },
    action: (node) => {
      const unsubscribe = executeCallbacks(addMeltEventListener(node, "click", (e) => {
        if (isElementDisabled(node)) {
          e.preventDefault();
          return;
        }
        selectItem(node);
        if (!multiple.get()) {
          closeMenu();
        }
      }), effect(highlightOnHover, ($highlightOnHover) => {
        if (!$highlightOnHover)
          return;
        const unsub = executeCallbacks(addMeltEventListener(node, "mouseover", () => {
          highlightedItem.set(node);
        }), addMeltEventListener(node, "mouseleave", () => {
          highlightedItem.set(null);
        }));
        return unsub;
      }));
      return { destroy: unsubscribe };
    }
  });
  const group = makeElement(name("group"), {
    returned: () => {
      return (groupId) => ({
        role: "group",
        "aria-labelledby": groupId
      });
    }
  });
  const groupLabel = makeElement(name("group-label"), {
    returned: () => {
      return (groupId) => ({
        id: groupId
      });
    }
  });
  const hiddenInput = createHiddenInput({
    value: derived([selected], ([$selected]) => {
      const value = Array.isArray($selected) ? $selected.map((o) => o.value) : $selected?.value;
      return typeof value === "string" ? value : JSON.stringify(value);
    }),
    name: readonly(nameProp),
    required,
    prefix: withDefaults.builder
  });
  const arrow = makeElement(name("arrow"), {
    stores: arrowSize,
    returned: ($arrowSize) => ({
      "data-arrow": true,
      style: styleToString({
        position: "absolute",
        width: `var(--arrow-size, ${$arrowSize}px)`,
        height: `var(--arrow-size, ${$arrowSize}px)`
      })
    })
  });
  safeOnMount(() => {
    if (!isBrowser)
      return;
    const menuEl = document.getElementById(ids.menu.get());
    const triggerEl = document.getElementById(ids.trigger.get());
    if (triggerEl) {
      activeTrigger.set(triggerEl);
    }
    if (!menuEl)
      return;
    const selectedEl = menuEl.querySelector("[data-selected]");
    if (!isHTMLElement(selectedEl))
      return;
  });
  effect([highlightedItem], ([$highlightedItem]) => {
    if (!isBrowser)
      return;
    const menuElement = document.getElementById(ids.menu.get());
    if (!isHTMLElement(menuElement))
      return;
    getOptions(menuElement).forEach((node) => {
      if (node === $highlightedItem) {
        addHighlight(node);
      } else {
        removeHighlight(node);
      }
    });
  });
  effect([open], ([$open]) => {
    if (!isBrowser)
      return;
    let unsubScroll = noop;
    if (preventScroll.get() && $open) {
      unsubScroll = removeScroll();
    }
    return () => {
      unsubScroll();
    };
  });
  return {
    ids,
    elements: {
      trigger,
      group,
      option,
      menu,
      groupLabel,
      label,
      hiddenInput,
      arrow
    },
    states: {
      open,
      selected,
      highlighted,
      highlightedItem
    },
    helpers: {
      isSelected,
      isHighlighted,
      closeMenu
    },
    options
  };
}
function createSelect(props) {
  const listbox = createListbox({ ...props, builder: "select" });
  const selectedLabel = derived(listbox.states.selected, ($selected) => {
    if (Array.isArray($selected)) {
      return $selected.map((o) => o.label).join(", ");
    }
    return $selected?.label ?? "";
  });
  return {
    ...listbox,
    elements: {
      ...listbox.elements
    },
    states: {
      ...listbox.states,
      selectedLabel
    }
  };
}
function arraysAreEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  return arr1.every((value, index) => value === arr2[index]);
}
function getCalendarData() {
  const NAME = "calendar";
  const PARTS = [
    "root",
    "prev-button",
    "next-button",
    "heading",
    "grid",
    "day",
    "header",
    "grid-head",
    "head-cell",
    "grid-body",
    "cell",
    "grid-row"
  ];
  return { NAME, PARTS };
}
function setCtx$1(props) {
  const { NAME, PARTS } = getCalendarData();
  const getCalendarAttrs = createBitAttrs(NAME, PARTS);
  const calendar = { ...createCalendar(removeUndefined(props)), getCalendarAttrs };
  setContext(NAME, calendar);
  return {
    ...calendar,
    updateOption: getOptionUpdater(calendar.options)
  };
}
function getCtx$1() {
  const { NAME } = getCalendarData();
  const ctx = getContext(NAME);
  return ctx;
}
const Calendar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, [
    "placeholder",
    "onPlaceholderChange",
    "value",
    "onValueChange",
    "preventDeselect",
    "minValue",
    "maxValue",
    "pagedNavigation",
    "weekStartsOn",
    "locale",
    "isDateUnavailable",
    "isDateDisabled",
    "disabled",
    "readonly",
    "fixedWeeks",
    "calendarLabel",
    "weekdayFormat",
    "multiple",
    "asChild",
    "id",
    "numberOfMonths",
    "initialFocus",
    "el"
  ]);
  let $localMonths, $$unsubscribe_localMonths;
  let $calendar, $$unsubscribe_calendar;
  let $weekdays, $$unsubscribe_weekdays;
  let { placeholder = void 0 } = $$props;
  let { onPlaceholderChange = void 0 } = $$props;
  let { value = void 0 } = $$props;
  let { onValueChange = void 0 } = $$props;
  let { preventDeselect = void 0 } = $$props;
  let { minValue = void 0 } = $$props;
  let { maxValue = void 0 } = $$props;
  let { pagedNavigation = void 0 } = $$props;
  let { weekStartsOn = void 0 } = $$props;
  let { locale = void 0 } = $$props;
  let { isDateUnavailable = void 0 } = $$props;
  let { isDateDisabled = void 0 } = $$props;
  let { disabled = void 0 } = $$props;
  let { readonly: readonly2 = void 0 } = $$props;
  let { fixedWeeks = void 0 } = $$props;
  let { calendarLabel = void 0 } = $$props;
  let { weekdayFormat = void 0 } = $$props;
  let { multiple = false } = $$props;
  let { asChild = false } = $$props;
  let { id = void 0 } = $$props;
  let { numberOfMonths = void 0 } = $$props;
  let { initialFocus = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { calendar }, states: { value: localValue, placeholder: localPlaceholder, months: localMonths, weekdays }, updateOption, ids, getCalendarAttrs } = setCtx$1({
    defaultPlaceholder: placeholder,
    defaultValue: value,
    preventDeselect,
    minValue,
    maxValue,
    pagedNavigation,
    weekStartsOn,
    locale,
    isDateUnavailable,
    isDateDisabled,
    disabled,
    readonly: readonly2,
    fixedWeeks,
    calendarLabel,
    weekdayFormat,
    multiple,
    numberOfMonths,
    onPlaceholderChange: ({ next: next2 }) => {
      if (placeholder !== next2) {
        onPlaceholderChange?.(next2);
        placeholder = next2;
      }
      return next2;
    },
    onValueChange: ({ next: next2 }) => {
      if (Array.isArray(next2)) {
        if (!Array.isArray(value) || !arraysAreEqual(value, next2)) {
          onValueChange?.(next2);
          value = next2;
          return next2;
        }
        return next2;
      }
      if (value !== next2) {
        onValueChange?.(next2);
        value = next2;
      }
      return next2;
    }
  });
  $$unsubscribe_calendar = subscribe(calendar, (value2) => $calendar = value2);
  $$unsubscribe_localMonths = subscribe(localMonths, (value2) => $localMonths = value2);
  $$unsubscribe_weekdays = subscribe(weekdays, (value2) => $weekdays = value2);
  const attrs = getCalendarAttrs("root");
  createDispatcher();
  let months = $localMonths;
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0) $$bindings.placeholder(placeholder);
  if ($$props.onPlaceholderChange === void 0 && $$bindings.onPlaceholderChange && onPlaceholderChange !== void 0) $$bindings.onPlaceholderChange(onPlaceholderChange);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.onValueChange === void 0 && $$bindings.onValueChange && onValueChange !== void 0) $$bindings.onValueChange(onValueChange);
  if ($$props.preventDeselect === void 0 && $$bindings.preventDeselect && preventDeselect !== void 0) $$bindings.preventDeselect(preventDeselect);
  if ($$props.minValue === void 0 && $$bindings.minValue && minValue !== void 0) $$bindings.minValue(minValue);
  if ($$props.maxValue === void 0 && $$bindings.maxValue && maxValue !== void 0) $$bindings.maxValue(maxValue);
  if ($$props.pagedNavigation === void 0 && $$bindings.pagedNavigation && pagedNavigation !== void 0) $$bindings.pagedNavigation(pagedNavigation);
  if ($$props.weekStartsOn === void 0 && $$bindings.weekStartsOn && weekStartsOn !== void 0) $$bindings.weekStartsOn(weekStartsOn);
  if ($$props.locale === void 0 && $$bindings.locale && locale !== void 0) $$bindings.locale(locale);
  if ($$props.isDateUnavailable === void 0 && $$bindings.isDateUnavailable && isDateUnavailable !== void 0) $$bindings.isDateUnavailable(isDateUnavailable);
  if ($$props.isDateDisabled === void 0 && $$bindings.isDateDisabled && isDateDisabled !== void 0) $$bindings.isDateDisabled(isDateDisabled);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);
  if ($$props.readonly === void 0 && $$bindings.readonly && readonly2 !== void 0) $$bindings.readonly(readonly2);
  if ($$props.fixedWeeks === void 0 && $$bindings.fixedWeeks && fixedWeeks !== void 0) $$bindings.fixedWeeks(fixedWeeks);
  if ($$props.calendarLabel === void 0 && $$bindings.calendarLabel && calendarLabel !== void 0) $$bindings.calendarLabel(calendarLabel);
  if ($$props.weekdayFormat === void 0 && $$bindings.weekdayFormat && weekdayFormat !== void 0) $$bindings.weekdayFormat(weekdayFormat);
  if ($$props.multiple === void 0 && $$bindings.multiple && multiple !== void 0) $$bindings.multiple(multiple);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
  if ($$props.numberOfMonths === void 0 && $$bindings.numberOfMonths && numberOfMonths !== void 0) $$bindings.numberOfMonths(numberOfMonths);
  if ($$props.initialFocus === void 0 && $$bindings.initialFocus && initialFocus !== void 0) $$bindings.initialFocus(initialFocus);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  {
    if (id) {
      ids.calendar.set(id);
    }
  }
  value !== void 0 && localValue.set(Array.isArray(value) ? [...value] : value);
  placeholder !== void 0 && localPlaceholder.set(placeholder);
  {
    updateOption("preventDeselect", preventDeselect);
  }
  {
    updateOption("minValue", minValue);
  }
  {
    updateOption("maxValue", maxValue);
  }
  {
    updateOption("pagedNavigation", pagedNavigation);
  }
  {
    updateOption("weekStartsOn", weekStartsOn);
  }
  {
    updateOption("locale", locale);
  }
  {
    updateOption("isDateUnavailable", isDateUnavailable);
  }
  {
    updateOption("isDateDisabled", isDateDisabled);
  }
  {
    updateOption("disabled", disabled);
  }
  {
    updateOption("readonly", readonly2);
  }
  {
    updateOption("fixedWeeks", fixedWeeks);
  }
  {
    updateOption("calendarLabel", calendarLabel);
  }
  {
    updateOption("weekdayFormat", weekdayFormat);
  }
  {
    updateOption("numberOfMonths", numberOfMonths);
  }
  builder = $calendar;
  {
    Object.assign(builder, attrs);
  }
  months = $localMonths;
  $$unsubscribe_localMonths();
  $$unsubscribe_calendar();
  $$unsubscribe_weekdays();
  return `${asChild ? `${slots.default ? slots.default({ months, weekdays: $weekdays, builder }) : ``}` : `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ months, weekdays: $weekdays, builder }) : ``}</div>`}`;
});
const Calendar_day$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let disabled;
  let unavailable;
  let selected;
  let $$restProps = compute_rest_props($$props, ["date", "month", "asChild", "el"]);
  let $isDateSelected, $$unsubscribe_isDateSelected;
  let $isDateUnavailable, $$unsubscribe_isDateUnavailable;
  let $isDateDisabled, $$unsubscribe_isDateDisabled;
  let $cell, $$unsubscribe_cell;
  let { date } = $$props;
  let { month } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { cell }, helpers: { isDateDisabled, isDateUnavailable, isDateSelected }, getCalendarAttrs } = getCtx$1();
  $$unsubscribe_cell = subscribe(cell, (value) => $cell = value);
  $$unsubscribe_isDateDisabled = subscribe(isDateDisabled, (value) => $isDateDisabled = value);
  $$unsubscribe_isDateUnavailable = subscribe(isDateUnavailable, (value) => $isDateUnavailable = value);
  $$unsubscribe_isDateSelected = subscribe(isDateSelected, (value) => $isDateSelected = value);
  const attrs = getCalendarAttrs("day");
  createDispatcher();
  if ($$props.date === void 0 && $$bindings.date && date !== void 0) $$bindings.date(date);
  if ($$props.month === void 0 && $$bindings.month && month !== void 0) $$bindings.month(month);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  builder = $cell(date, month);
  {
    Object.assign(builder, attrs);
  }
  disabled = $isDateDisabled(date);
  unavailable = $isDateUnavailable(date);
  selected = $isDateSelected(date);
  $$unsubscribe_isDateSelected();
  $$unsubscribe_isDateUnavailable();
  $$unsubscribe_isDateDisabled();
  $$unsubscribe_cell();
  return `${asChild ? `${slots.default ? slots.default({ builder, disabled, unavailable, selected }) : ``}` : `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder, disabled, unavailable, selected }) : ` ${escape(date.day)} `}</div>`}`;
});
const Calendar_grid$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $grid, $$unsubscribe_grid;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { grid }, getCalendarAttrs } = getCtx$1();
  $$unsubscribe_grid = subscribe(grid, (value) => $grid = value);
  const attrs = getCalendarAttrs("grid");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  builder = $grid;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_grid();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<table${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</table>`}`;
});
const Calendar_grid_body$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { getCalendarAttrs } = getCtx$1();
  const attrs = getCalendarAttrs("grid-body");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  return `${asChild ? `${slots.default ? slots.default({ attrs }) : ``}` : `<tbody${spread([escape_object($$restProps), escape_object(attrs)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ attrs }) : ``}</tbody>`}`;
});
const Calendar_cell$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let attrs;
  let $$restProps = compute_rest_props($$props, ["date", "asChild", "el"]);
  let $isDateDisabled, $$unsubscribe_isDateDisabled;
  let $isDateUnavailable, $$unsubscribe_isDateUnavailable;
  let { date } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { helpers: { isDateDisabled, isDateUnavailable }, getCalendarAttrs } = getCtx$1();
  $$unsubscribe_isDateDisabled = subscribe(isDateDisabled, (value) => $isDateDisabled = value);
  $$unsubscribe_isDateUnavailable = subscribe(isDateUnavailable, (value) => $isDateUnavailable = value);
  if ($$props.date === void 0 && $$bindings.date && date !== void 0) $$bindings.date(date);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  attrs = {
    ...getCalendarAttrs("cell"),
    "aria-disabled": $isDateDisabled(date) || $isDateUnavailable(date),
    "data-disabled": $isDateDisabled(date) ? "" : void 0,
    role: "gridcell"
  };
  $$unsubscribe_isDateDisabled();
  $$unsubscribe_isDateUnavailable();
  return `${asChild ? `${slots.default ? slots.default({ attrs }) : ``}` : `<td${spread([escape_object($$restProps), escape_object(attrs)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ attrs }) : ``}</td>`}`;
});
const Calendar_grid_head$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { getCalendarAttrs } = getCtx$1();
  const attrs = {
    ...getCalendarAttrs("grid-head"),
    "aria-hidden": true
  };
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  return `${asChild ? `${slots.default ? slots.default({ attrs }) : ``}` : `<thead${spread([escape_object($$restProps), escape_object(attrs)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ attrs }) : ``}</thead>`}`;
});
const Calendar_head_cell$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { getCalendarAttrs } = getCtx$1();
  const attrs = getCalendarAttrs("head-cell");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  return `${asChild ? `${slots.default ? slots.default({ attrs }) : ``}` : `<th${spread([escape_object($$restProps), escape_object(attrs)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ attrs }) : ``}</th>`}`;
});
const Calendar_grid_row$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { getCalendarAttrs } = getCtx$1();
  const attrs = getCalendarAttrs("grid-row");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  return `${asChild ? `${slots.default ? slots.default({ attrs }) : ``}` : `<tr${spread([escape_object($$restProps), escape_object(attrs)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ attrs }) : ``}</tr>`}`;
});
const Calendar_header$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { getCalendarAttrs } = getCtx$1();
  const attrs = getCalendarAttrs("header");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  return `${asChild ? `${slots.default ? slots.default({ attrs }) : ``}` : `<header${spread([escape_object($$restProps), escape_object(attrs)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ attrs }) : ``}</header>`}`;
});
const Calendar_heading$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $heading, $$unsubscribe_heading;
  let $headingValue, $$unsubscribe_headingValue;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { heading }, states: { headingValue }, getCalendarAttrs } = getCtx$1();
  $$unsubscribe_heading = subscribe(heading, (value) => $heading = value);
  $$unsubscribe_headingValue = subscribe(headingValue, (value) => $headingValue = value);
  const attrs = getCalendarAttrs("heading");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  builder = $heading;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_heading();
  $$unsubscribe_headingValue();
  return `${asChild ? `${slots.default ? slots.default({ builder, headingValue: $headingValue }) : ``}` : `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder, headingValue: $headingValue }) : ` ${escape($headingValue)} `}</div>`}`;
});
function getSelectData() {
  const NAME = "select";
  const GROUP_NAME = "select-group";
  const ITEM_NAME = "select-item";
  const PARTS = [
    "arrow",
    "content",
    "group",
    "item",
    "indicator",
    "input",
    "label",
    "trigger",
    "value"
  ];
  return {
    NAME,
    GROUP_NAME,
    ITEM_NAME,
    PARTS
  };
}
function getCtx() {
  const { NAME } = getSelectData();
  return getContext(NAME);
}
function setCtx(props) {
  const { NAME, PARTS } = getSelectData();
  const getAttrs = createBitAttrs(NAME, PARTS);
  const select = {
    ...createSelect({ ...removeUndefined(props), forceVisible: true }),
    getAttrs
  };
  setContext(NAME, select);
  return {
    ...select,
    updateOption: getOptionUpdater(select.options)
  };
}
function setItemCtx(value) {
  const { ITEM_NAME } = getSelectData();
  const select = getCtx();
  setContext(ITEM_NAME, value);
  return select;
}
function getItemIndicator() {
  const { ITEM_NAME } = getSelectData();
  const { helpers: { isSelected }, getAttrs } = getCtx();
  const value = getContext(ITEM_NAME);
  return {
    value,
    isSelected,
    getAttrs
  };
}
function updatePositioning(props) {
  const defaultPlacement = {
    side: "bottom",
    align: "center",
    sameWidth: true
  };
  const withDefaults = { ...defaultPlacement, ...props };
  const { options: { positioning } } = getCtx();
  const updater = getPositioningUpdater(positioning);
  updater(withDefaults);
}
const Select = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $idValues, $$unsubscribe_idValues;
  let { required = void 0 } = $$props;
  let { disabled = void 0 } = $$props;
  let { preventScroll = void 0 } = $$props;
  let { loop = void 0 } = $$props;
  let { closeOnEscape = void 0 } = $$props;
  let { closeOnOutsideClick = void 0 } = $$props;
  let { portal = void 0 } = $$props;
  let { name = void 0 } = $$props;
  let { multiple = false } = $$props;
  let { selected = void 0 } = $$props;
  let { onSelectedChange = void 0 } = $$props;
  let { open = void 0 } = $$props;
  let { onOpenChange = void 0 } = $$props;
  let { items = [] } = $$props;
  let { onOutsideClick = void 0 } = $$props;
  let { typeahead = void 0 } = $$props;
  const { states: { open: localOpen, selected: localSelected }, updateOption, ids } = setCtx({
    required,
    disabled,
    preventScroll,
    loop,
    closeOnEscape,
    closeOnOutsideClick,
    portal,
    name,
    onOutsideClick,
    multiple,
    forceVisible: true,
    defaultSelected: Array.isArray(selected) ? [...selected] : selected,
    defaultOpen: open,
    onSelectedChange: ({ next: next2 }) => {
      if (Array.isArray(next2)) {
        if (!Array.isArray(selected) || !arraysAreEqual(selected, next2)) {
          onSelectedChange?.(next2);
          selected = next2;
          return next2;
        }
        return next2;
      }
      if (selected !== next2) {
        onSelectedChange?.(next2);
        selected = next2;
      }
      return next2;
    },
    onOpenChange: ({ next: next2 }) => {
      if (open !== next2) {
        onOpenChange?.(next2);
        open = next2;
      }
      return next2;
    },
    items,
    typeahead
  });
  const idValues = derived([ids.menu, ids.trigger, ids.label], ([$menuId, $triggerId, $labelId]) => ({
    menu: $menuId,
    trigger: $triggerId,
    label: $labelId
  }));
  $$unsubscribe_idValues = subscribe(idValues, (value) => $idValues = value);
  if ($$props.required === void 0 && $$bindings.required && required !== void 0) $$bindings.required(required);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);
  if ($$props.preventScroll === void 0 && $$bindings.preventScroll && preventScroll !== void 0) $$bindings.preventScroll(preventScroll);
  if ($$props.loop === void 0 && $$bindings.loop && loop !== void 0) $$bindings.loop(loop);
  if ($$props.closeOnEscape === void 0 && $$bindings.closeOnEscape && closeOnEscape !== void 0) $$bindings.closeOnEscape(closeOnEscape);
  if ($$props.closeOnOutsideClick === void 0 && $$bindings.closeOnOutsideClick && closeOnOutsideClick !== void 0) $$bindings.closeOnOutsideClick(closeOnOutsideClick);
  if ($$props.portal === void 0 && $$bindings.portal && portal !== void 0) $$bindings.portal(portal);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0) $$bindings.name(name);
  if ($$props.multiple === void 0 && $$bindings.multiple && multiple !== void 0) $$bindings.multiple(multiple);
  if ($$props.selected === void 0 && $$bindings.selected && selected !== void 0) $$bindings.selected(selected);
  if ($$props.onSelectedChange === void 0 && $$bindings.onSelectedChange && onSelectedChange !== void 0) $$bindings.onSelectedChange(onSelectedChange);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0) $$bindings.open(open);
  if ($$props.onOpenChange === void 0 && $$bindings.onOpenChange && onOpenChange !== void 0) $$bindings.onOpenChange(onOpenChange);
  if ($$props.items === void 0 && $$bindings.items && items !== void 0) $$bindings.items(items);
  if ($$props.onOutsideClick === void 0 && $$bindings.onOutsideClick && onOutsideClick !== void 0) $$bindings.onOutsideClick(onOutsideClick);
  if ($$props.typeahead === void 0 && $$bindings.typeahead && typeahead !== void 0) $$bindings.typeahead(typeahead);
  open !== void 0 && localOpen.set(open);
  selected !== void 0 && localSelected.set(Array.isArray(selected) ? [...selected] : selected);
  {
    updateOption("required", required);
  }
  {
    updateOption("disabled", disabled);
  }
  {
    updateOption("preventScroll", preventScroll);
  }
  {
    updateOption("loop", loop);
  }
  {
    updateOption("closeOnEscape", closeOnEscape);
  }
  {
    updateOption("closeOnOutsideClick", closeOnOutsideClick);
  }
  {
    updateOption("portal", portal);
  }
  {
    updateOption("name", name);
  }
  {
    updateOption("multiple", multiple);
  }
  {
    updateOption("onOutsideClick", onOutsideClick);
  }
  {
    updateOption("typeahead", typeahead);
  }
  $$unsubscribe_idValues();
  return `${slots.default ? slots.default({ ids: $idValues }) : ``}`;
});
const Select_content$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, [
    "transition",
    "transitionConfig",
    "inTransition",
    "inTransitionConfig",
    "outTransition",
    "outTransitionConfig",
    "asChild",
    "id",
    "side",
    "align",
    "sideOffset",
    "alignOffset",
    "collisionPadding",
    "avoidCollisions",
    "collisionBoundary",
    "sameWidth",
    "fitViewport",
    "strategy",
    "overlap",
    "el"
  ]);
  let $open, $$unsubscribe_open;
  let $menu, $$unsubscribe_menu;
  let { transition = void 0 } = $$props;
  let { transitionConfig = void 0 } = $$props;
  let { inTransition = void 0 } = $$props;
  let { inTransitionConfig = void 0 } = $$props;
  let { outTransition = void 0 } = $$props;
  let { outTransitionConfig = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { id = void 0 } = $$props;
  let { side = "bottom" } = $$props;
  let { align = "center" } = $$props;
  let { sideOffset = 0 } = $$props;
  let { alignOffset = 0 } = $$props;
  let { collisionPadding = 8 } = $$props;
  let { avoidCollisions = true } = $$props;
  let { collisionBoundary = void 0 } = $$props;
  let { sameWidth = true } = $$props;
  let { fitViewport = false } = $$props;
  let { strategy = "absolute" } = $$props;
  let { overlap = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { menu }, states: { open }, ids, getAttrs } = getCtx();
  $$unsubscribe_menu = subscribe(menu, (value) => $menu = value);
  $$unsubscribe_open = subscribe(open, (value) => $open = value);
  createDispatcher();
  const attrs = getAttrs("content");
  if ($$props.transition === void 0 && $$bindings.transition && transition !== void 0) $$bindings.transition(transition);
  if ($$props.transitionConfig === void 0 && $$bindings.transitionConfig && transitionConfig !== void 0) $$bindings.transitionConfig(transitionConfig);
  if ($$props.inTransition === void 0 && $$bindings.inTransition && inTransition !== void 0) $$bindings.inTransition(inTransition);
  if ($$props.inTransitionConfig === void 0 && $$bindings.inTransitionConfig && inTransitionConfig !== void 0) $$bindings.inTransitionConfig(inTransitionConfig);
  if ($$props.outTransition === void 0 && $$bindings.outTransition && outTransition !== void 0) $$bindings.outTransition(outTransition);
  if ($$props.outTransitionConfig === void 0 && $$bindings.outTransitionConfig && outTransitionConfig !== void 0) $$bindings.outTransitionConfig(outTransitionConfig);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
  if ($$props.side === void 0 && $$bindings.side && side !== void 0) $$bindings.side(side);
  if ($$props.align === void 0 && $$bindings.align && align !== void 0) $$bindings.align(align);
  if ($$props.sideOffset === void 0 && $$bindings.sideOffset && sideOffset !== void 0) $$bindings.sideOffset(sideOffset);
  if ($$props.alignOffset === void 0 && $$bindings.alignOffset && alignOffset !== void 0) $$bindings.alignOffset(alignOffset);
  if ($$props.collisionPadding === void 0 && $$bindings.collisionPadding && collisionPadding !== void 0) $$bindings.collisionPadding(collisionPadding);
  if ($$props.avoidCollisions === void 0 && $$bindings.avoidCollisions && avoidCollisions !== void 0) $$bindings.avoidCollisions(avoidCollisions);
  if ($$props.collisionBoundary === void 0 && $$bindings.collisionBoundary && collisionBoundary !== void 0) $$bindings.collisionBoundary(collisionBoundary);
  if ($$props.sameWidth === void 0 && $$bindings.sameWidth && sameWidth !== void 0) $$bindings.sameWidth(sameWidth);
  if ($$props.fitViewport === void 0 && $$bindings.fitViewport && fitViewport !== void 0) $$bindings.fitViewport(fitViewport);
  if ($$props.strategy === void 0 && $$bindings.strategy && strategy !== void 0) $$bindings.strategy(strategy);
  if ($$props.overlap === void 0 && $$bindings.overlap && overlap !== void 0) $$bindings.overlap(overlap);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  {
    if (id) {
      ids.menu.set(id);
    }
  }
  builder = $menu;
  {
    Object.assign(builder, attrs);
  }
  {
    if ($open) {
      updatePositioning({
        side,
        align,
        sideOffset,
        alignOffset,
        collisionPadding,
        avoidCollisions,
        collisionBoundary,
        sameWidth,
        fitViewport,
        strategy,
        overlap
      });
    }
  }
  $$unsubscribe_open();
  $$unsubscribe_menu();
  return ` ${asChild && $open ? `${slots.default ? slots.default({ builder }) : ``}` : `${transition && $open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : `${inTransition && outTransition && $open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : `${inTransition && $open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : `${outTransition && $open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : `${$open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : ``}`}`}`}`}`}`;
});
const Select_item$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let isSelected;
  let $$restProps = compute_rest_props($$props, ["value", "disabled", "label", "asChild", "el"]);
  let $isSelectedStore, $$unsubscribe_isSelectedStore;
  let $item, $$unsubscribe_item;
  let { value } = $$props;
  let { disabled = void 0 } = $$props;
  let { label = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { option: item }, helpers: { isSelected: isSelectedStore }, getAttrs } = setItemCtx(value);
  $$unsubscribe_item = subscribe(item, (value2) => $item = value2);
  $$unsubscribe_isSelectedStore = subscribe(isSelectedStore, (value2) => $isSelectedStore = value2);
  createDispatcher();
  const attrs = getAttrs("item");
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0) $$bindings.label(label);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  builder = $item({ value, disabled, label });
  {
    Object.assign(builder, attrs);
  }
  isSelected = $isSelectedStore(value);
  $$unsubscribe_isSelectedStore();
  $$unsubscribe_item();
  return ` ${asChild ? `${slots.default ? slots.default({ builder, isSelected }) : ``}` : `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder, isSelected }) : ` ${escape(label || value)} `}</div>`}`;
});
const Select_item_indicator = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $isSelected, $$unsubscribe_isSelected;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { isSelected, value, getAttrs } = getItemIndicator();
  $$unsubscribe_isSelected = subscribe(isSelected, (value2) => $isSelected = value2);
  const attrs = getAttrs("indicator");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  $$unsubscribe_isSelected();
  return `${asChild ? `${slots.default ? slots.default({ attrs, isSelected: $isSelected(value) }) : ``}` : `<div${spread([escape_object($$restProps), escape_object(attrs)], {})}${add_attribute("this", el, 0)}>${$isSelected(value) ? `${slots.default ? slots.default({ attrs, isSelected: $isSelected(value) }) : ``}` : ``}</div>`}`;
});
const Select_trigger$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "id", "el"]);
  let $trigger, $$unsubscribe_trigger;
  let { asChild = false } = $$props;
  let { id = void 0 } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { trigger }, ids, getAttrs } = getCtx();
  $$unsubscribe_trigger = subscribe(trigger, (value) => $trigger = value);
  createDispatcher();
  const attrs = getAttrs("trigger");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  {
    if (id) {
      ids.trigger.set(id);
    }
  }
  builder = $trigger;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_trigger();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<button${spread([escape_object(builder), { type: "button" }, escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</button>`}`;
});
const Select_value = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let label;
  let $$restProps = compute_rest_props($$props, ["placeholder", "asChild", "el"]);
  let $selectedLabel, $$unsubscribe_selectedLabel;
  let { placeholder = "" } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { states: { selectedLabel }, getAttrs } = getCtx();
  $$unsubscribe_selectedLabel = subscribe(selectedLabel, (value) => $selectedLabel = value);
  const attrs = getAttrs("value");
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0) $$bindings.placeholder(placeholder);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  label = $selectedLabel;
  $$unsubscribe_selectedLabel();
  return `${asChild ? `${slots.default ? slots.default({ label, attrs }) : ``}` : `<span${spread(
    [
      escape_object($$restProps),
      escape_object(attrs),
      {
        "data-placeholder": escape_attribute_value(!label ? "" : void 0)
      }
    ],
    {}
  )}${add_attribute("this", el, 0)}>${escape(label || placeholder)}</span>`}`;
});
const Check = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [["path", { "d": "M20 6 9 17l-5-5" }]];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "check" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const ParticipantManagement = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { id } = $$props;
  let { slot_id } = $$props;
  let { unsubscribe_slot: unsubscribe_slot2 } = $$props;
  if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
  if ($$props.slot_id === void 0 && $$bindings.slot_id && slot_id !== void 0) $$bindings.slot_id(slot_id);
  if ($$props.unsubscribe_slot === void 0 && $$bindings.unsubscribe_slot && unsubscribe_slot2 !== void 0) $$bindings.unsubscribe_slot(unsubscribe_slot2);
  return `${validate_component(Root$1, "DropdownMenu.Root").$$render($$result, {}, {}, {
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
                  return `Retirer de la séance`;
                }
              })}  ${validate_component(Dropdown_menu_item, "DropdownMenu.Item").$$render($$result, {}, {}, {
                default: () => {
                  return `Modifier la présence`;
                }
              })}  ${validate_component(Dropdown_menu_item, "DropdownMenu.Item").$$render($$result, {}, {}, {
                default: () => {
                  return `Coresponsable`;
                }
              })}`;
            }
          })}`;
        }
      })}`;
    }
  })}`;
});
let searchQuery = "";
const SingleSlotCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let canManage;
  let slot_type;
  let $attendees, $$unsubscribe_attendees;
  let $$unsubscribe_flash;
  let $participants, $$unsubscribe_participants;
  let $$unsubscribe_tableAttrs;
  let $$unsubscribe_headerRows;
  let $$unsubscribe_tableBodyAttrs;
  let $$unsubscribe_pageRows;
  let $$unsubscribe_filteredAvailableUsersStore;
  let $$unsubscribe_pageIndex;
  let $$unsubscribe_hasPreviousPage;
  let $$unsubscribe_pageCount;
  let $$unsubscribe_hasNextPage;
  $$unsubscribe_attendees = subscribe(attendees, (value) => $attendees = value);
  $$unsubscribe_participants = subscribe(participants, (value) => $participants = value);
  const flash = getFlash(page);
  $$unsubscribe_flash = subscribe(flash, (value) => value);
  let { slot } = $$props;
  let { owner } = $$props;
  let { user } = $$props;
  let { participants_list } = $$props;
  let { attendees_list } = $$props;
  let { all_users = [] } = $$props;
  let current_slot = slot;
  let isResponsible = false;
  let allParticipants = [];
  let filteredParticipantsStore = writable([]);
  participants.subscribe((p) => {
    allParticipants = p || [];
    updateFiltered();
  });
  function updateFiltered() {
    if (searchQuery.trim() === "") {
      filteredParticipantsStore.set(allParticipants);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = allParticipants.filter((user2) => {
        return user2.first_name.toLowerCase().includes(query) || user2.last_name.toLowerCase().includes(query) || user2.email.toLowerCase().includes(query) || user2.churros_uid && user2.churros_uid.toLowerCase().includes(query);
      });
      filteredParticipantsStore.set(filtered);
    }
  }
  const table = createTable(filteredParticipantsStore, {
    page: addPagination({ initialPageSize: 4 })
  });
  const responsibleIds = new Set(slot.responsibles?.map((u) => u.id) || []);
  const columns = table.createColumns([
    table.column({
      accessor: ({ id, first_name, last_name }) => {
        const name = `${first_name} ${last_name}`;
        return responsibleIds.has(id) ? `${name} 🏅` : name;
      },
      header: "Nom"
    }),
    table.column({
      accessor: ({ id }) => id,
      header: "Présent",
      cell: ({ value }) => {
        const isPresent = $attendees?.some((a) => a.id === value);
        return isPresent ? "✅" : "❌";
      }
    }),
    table.column({
      accessor: "cotisant_as",
      header: "AS",
      cell: ({ value }) => {
        return value ? "✅" : "❌";
      }
    }),
    table.column({
      accessor: "cotisant_grinp",
      header: "Gr'INP",
      cell: ({ value }) => {
        return value ? "✅" : "❌";
      }
    }),
    table.column({
      accessor: ({ id }) => id,
      header: "Modifier",
      cell: ({ value }) => {
        return createRender(ParticipantManagement, {
          id: value,
          slot_id: slot.id,
          unsubscribe_slot
        });
      }
    })
  ]);
  const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } = table.createViewModel(columns);
  $$unsubscribe_headerRows = subscribe(headerRows, (value) => value);
  $$unsubscribe_pageRows = subscribe(pageRows, (value) => value);
  $$unsubscribe_tableAttrs = subscribe(tableAttrs, (value) => value);
  $$unsubscribe_tableBodyAttrs = subscribe(tableBodyAttrs, (value) => value);
  const { hasNextPage, hasPreviousPage, pageIndex, pageCount } = pluginStates.page;
  $$unsubscribe_hasNextPage = subscribe(hasNextPage, (value) => value);
  $$unsubscribe_hasPreviousPage = subscribe(hasPreviousPage, (value) => value);
  $$unsubscribe_pageIndex = subscribe(pageIndex, (value) => value);
  $$unsubscribe_pageCount = subscribe(pageCount, (value) => value);
  let addUserSearchQuery = "";
  let filteredAvailableUsersStore = writable([]);
  $$unsubscribe_filteredAvailableUsersStore = subscribe(filteredAvailableUsersStore, (value) => value);
  function updateAvailableUsers() {
    if (!all_users) return;
    const currentParticipantIds = new Set(allParticipants.map((p) => p.id));
    let availableUsers = all_users.filter((u) => !currentParticipantIds.has(u.id));
    if (addUserSearchQuery.trim() === "") {
      filteredAvailableUsersStore.set(availableUsers);
    } else {
      const query = addUserSearchQuery.toLowerCase();
      const filtered = availableUsers.filter((user2) => {
        return user2.first_name.toLowerCase().includes(query) || user2.last_name.toLowerCase().includes(query) || user2.email.toLowerCase().includes(query) || user2.churros_uid && user2.churros_uid.toLowerCase().includes(query);
      });
      filteredAvailableUsersStore.set(filtered);
    }
  }
  if ($$props.slot === void 0 && $$bindings.slot && slot !== void 0) $$bindings.slot(slot);
  if ($$props.owner === void 0 && $$bindings.owner && owner !== void 0) $$bindings.owner(owner);
  if ($$props.user === void 0 && $$bindings.user && user !== void 0) $$bindings.user(user);
  if ($$props.participants_list === void 0 && $$bindings.participants_list && participants_list !== void 0) $$bindings.participants_list(participants_list);
  if ($$props.attendees_list === void 0 && $$bindings.attendees_list && attendees_list !== void 0) $$bindings.attendees_list(attendees_list);
  if ($$props.all_users === void 0 && $$bindings.all_users && all_users !== void 0) $$bindings.all_users(all_users);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      {
        if (typeof current_slot.starts_at === "string") {
          current_slot.starts_at = new Date(current_slot.starts_at);
        }
        if (typeof current_slot.ends_at === "string") {
          current_slot.ends_at = new Date(current_slot.ends_at);
        }
      }
    }
    isResponsible = Boolean(slot?.responsibles?.some((r) => r.id === user.id));
    canManage = user.root || user.id === slot.owner_id || isResponsible;
    {
      {
        participants.set(participants_list);
        attendees.set(attendees_list);
      }
    }
    $participants?.length;
    $participants?.some((participant) => participant.id === user.id);
    slot_type = current_slot.slot_type;
    {
      updateFiltered();
    }
    {
      updateAvailableUsers();
    }
    {
      updateAvailableUsers();
    }
    $$rendered = `${canManage ? `${validate_component(Card, "Card").$$render(
      $$result,
      {
        class: "flex flex-col justify-between w-full"
      },
      {},
      {
        default: () => {
          return `<div class="p-4 cursor-pointer hover:bg-black hover:bg-opacity-5 transition-colors" role="button" tabindex="0"><div class="flex items-center justify-between gap-2"><div class="flex items-center gap-2 flex-1"><div class="font-semibold text-lg">Gérer : &quot;${escape(current_slot.name)}&quot;</div> ${slot_type === "EVENEMENT" ? `<span class="text-xs font-semibold px-2 py-1 rounded bg-green-100 text-green-800" data-svelte-h="svelte-7snusz">Évènement</span>` : `${slot_type === "FERMETURE" ? `<span class="text-xs font-semibold px-2 py-1 rounded bg-red-100 text-red-800" data-svelte-h="svelte-s3vb0g">Fermeture</span>` : ``}`}</div> <span class="text-lg">${escape("▶")}</span></div> <div class="text-sm text-muted-foreground">${current_slot.starts_at && current_slot.ends_at ? `${escape(current_slot.starts_at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))} - ${escape(current_slot.ends_at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))}` : ``}</div></div> ${``}`;
        }
      }
    )}` : `${validate_component(Card, "Card").$$render(
      $$result,
      {
        class: "flex flex-col justify-between w-full"
      },
      {},
      {
        default: () => {
          return `<div class="p-4 cursor-pointer hover:bg-black hover:bg-opacity-5 transition-colors" role="button" tabindex="0"><div class="flex items-center justify-between gap-2"><div class="flex items-center gap-2 flex-1"><div class="font-semibold text-lg">${escape(current_slot.name)}</div> ${slot_type === "EVENEMENT" ? `<span class="text-xs font-semibold px-2 py-1 rounded bg-green-100 text-green-800" data-svelte-h="svelte-7snusz">Évènement</span>` : `${slot_type === "FERMETURE" ? `<span class="text-xs font-semibold px-2 py-1 rounded bg-red-100 text-red-800" data-svelte-h="svelte-s3vb0g">Fermeture</span>` : ``}`}</div> <span class="text-lg">${escape("▶")}</span></div> <div class="text-sm text-muted-foreground">Encadré par ${escape(owner.first_name)} ${escape(owner.last_name)}</div> <div class="text-sm text-muted-foreground">${current_slot.starts_at && current_slot.ends_at ? `${current_slot.starts_at.getDate() === current_slot.ends_at.getDate() ? `Le ${escape(current_slot.starts_at.toLocaleDateString())} de ${escape(current_slot.starts_at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))} à ${escape(current_slot.ends_at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))}.` : `Du ${escape(current_slot.starts_at.toLocaleDateString())} à ${escape(current_slot.starts_at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))} au ${escape(current_slot.ends_at.toLocaleDateString())} à ${escape(current_slot.ends_at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))}.`}` : ``}</div></div> ${``}`;
        }
      }
    )}`}`;
  } while (!$$settled);
  $$unsubscribe_attendees();
  $$unsubscribe_flash();
  $$unsubscribe_participants();
  $$unsubscribe_tableAttrs();
  $$unsubscribe_headerRows();
  $$unsubscribe_tableBodyAttrs();
  $$unsubscribe_pageRows();
  $$unsubscribe_filteredAvailableUsersStore();
  $$unsubscribe_pageIndex();
  $$unsubscribe_hasPreviousPage();
  $$unsubscribe_pageCount();
  $$unsubscribe_hasNextPage();
  return $$rendered;
});
const SlotCard = create_ssr_component(($$result, $$props, $$bindings, slots$1) => {
  let user;
  let slots;
  let canCreateMore;
  let hasClosureSlot;
  let $$unsubscribe_flash;
  let $$unsubscribe_formData;
  const flash = getFlash(page);
  $$unsubscribe_flash = subscribe(flash, (value) => value);
  let { data } = $$props;
  let { slotDate } = $$props;
  const form = superForm(data.form, {
    validators: zodClient(slotScheme),
    dataType: "json"
  });
  const { form: formData, enhance } = form;
  $$unsubscribe_formData = subscribe(formData, (value) => value);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  if ($$props.slotDate === void 0 && $$bindings.slotDate && slotDate !== void 0) $$bindings.slotDate(slotDate);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    user = data.user;
    slots = data.slots || [];
    canCreateMore = slots.length < 3 && (user.instructor || user.root);
    hasClosureSlot = slots.some((s) => s.slot.slot_type === "FERMETURE");
    $$rendered = `${slots.length > 0 ? ` ${each(slots, (slotData) => {
      return `${validate_component(SingleSlotCard, "SingleSlotCard").$$render(
        $$result,
        {
          slot: slotData.slot,
          owner: slotData.owner,
          user,
          participants_list: slotData.participants_list,
          attendees_list: slotData.attendees_list,
          all_users: data.all_users
        },
        {},
        {}
      )}`;
    })}  ${canCreateMore && !hasClosureSlot ? `${validate_component(Card, "Card").$$render(
      $$result,
      {
        class: "flex flex-col justify-between w-full"
      },
      {},
      {
        default: () => {
          return `<div class="p-4 cursor-pointer hover:bg-black hover:bg-opacity-5 transition-colors" role="button" tabindex="0"><div class="flex items-center justify-between"><div class="font-semibold text-lg" data-svelte-h="svelte-1dqjyb1">Créer un autre créneau</div> <span class="text-lg">${escape("▶")}</span></div></div> ${``}`;
        }
      }
    )}` : ``}` : `${user.instructor || user.root ? ` ${validate_component(Card, "Card").$$render(
      $$result,
      {
        class: "flex flex-col justify-between w-full"
      },
      {},
      {
        default: () => {
          return `<div class="p-4 cursor-pointer hover:bg-black hover:bg-opacity-5 transition-colors" role="button" tabindex="0"><div class="flex items-center justify-between"><div class="font-semibold text-lg" data-svelte-h="svelte-1qouwj0">Créer un créneau</div> <span class="text-lg">${escape("▶")}</span></div></div> ${``}`;
        }
      }
    )}` : `${validate_component(Card, "Card").$$render(
      $$result,
      {
        class: "flex flex-col justify-between w-full"
      },
      {},
      {
        default: () => {
          return `${validate_component(Card_header, "CardHeader").$$render($$result, { class: "p-4" }, {}, {
            default: () => {
              return `${validate_component(Card_title, "CardTitle").$$render($$result, {}, {}, {
                default: () => {
                  return `Aucun créneau`;
                }
              })} <p class="text-sm text-muted-foreground" data-svelte-h="svelte-1fxvbyz">Il n&#39;y a pas de créneau pour le moment.</p>`;
            }
          })}`;
        }
      }
    )}`}`}`;
  } while (!$$settled);
  $$unsubscribe_flash();
  $$unsubscribe_formData();
  return $$rendered;
});
const Calendar_cell = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["date", "class"]);
  let { date } = $$props;
  let { class: className = void 0 } = $$props;
  if ($$props.date === void 0 && $$bindings.date && date !== void 0) $$bindings.date(date);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `${validate_component(Calendar_cell$1, "CalendarPrimitive.Cell").$$render(
    $$result,
    Object.assign(
      {},
      { date },
      {
        class: cn("[&:has([data-selected])]:bg-accent [&:has([data-selected][data-outside-month])]:bg-accent/50 relative h-9 w-9 p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([data-selected])]:rounded-md", className)
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
const Calendar_day = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["date", "month", "class", "updateSlotExists"]);
  let { date } = $$props;
  let { month } = $$props;
  let { class: className = void 0 } = $$props;
  let slot_exists = false;
  let slot_types = [];
  async function updateSlotExists() {
    const result = await checkDate(date);
    slot_exists = result.exists;
    slot_types = result.slot_types || [];
  }
  async function checkDate(date2) {
    let startOfDay = date2.toDate(getLocalTimeZone());
    startOfDay.setHours(0, 0, 0, 0);
    let endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);
    let exists = await fetch("/api/slots/exists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startOfDay, endOfDay })
    });
    if (exists.status == 200) {
      return exists.json().then((data) => {
        return {
          exists: data.exists,
          slot_types: data.slot_types || []
        };
      });
    } else {
      return { exists: false, slot_types: [] };
    }
  }
  if ($$props.date === void 0 && $$bindings.date && date !== void 0) $$bindings.date(date);
  if ($$props.month === void 0 && $$bindings.month && month !== void 0) $$bindings.month(month);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  if ($$props.updateSlotExists === void 0 && $$bindings.updateSlotExists && updateSlotExists !== void 0) $$bindings.updateSlotExists(updateSlotExists);
  {
    if (date) {
      updateSlotExists();
    }
  }
  return ` ${validate_component(Calendar_day$1, "CalendarPrimitive.Day").$$render(
    $$result,
    Object.assign(
      {},
      { date },
      { month },
      {
        class: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal relative",
          "[&[data-today]:not([data-selected])]:bg-accent [&[data-today]:not([data-selected])]:text-accent-foreground",
          // Selected
          "data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:hover:bg-primary data-[selected]:hover:text-primary-foreground data-[selected]:focus:bg-primary data-[selected]:focus:text-primary-foreground data-[selected]:opacity-100",
          // Disabled
          "data-[disabled]:text-muted-foreground data-[disabled]:opacity-50",
          // Unavailable
          "data-[unavailable]:text-destructive-foreground data-[unavailable]:line-through",
          // Outside months
          "data-[outside-month]:text-muted-foreground [&[data-outside-month][data-selected]]:bg-accent/50 [&[data-outside-month][data-selected]]:text-muted-foreground data-[outside-month]:pointer-events-none data-[outside-month]:opacity-50 [&[data-outside-month][data-selected]]:opacity-30",
          slot_exists ? "day-button" : "",
          className
        )
      },
      $$restProps
    ),
    {},
    {
      default: ({ selected, disabled, unavailable, builder }) => {
        return `${slots.default ? slots.default({ selected, disabled, unavailable, builder }) : ` ${escape(date.day)} `} <style data-svelte-h="svelte-7oukzt">.day-button {
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			align-items: center;
			gap: 0.15rem;
		}
		.day-button::after {
			content: "";
			display: flex;
			gap: 0.15rem;
		}</style> ${slot_exists && slot_types.length > 0 ? `<div class="flex justify-center gap-0.5 mt-0.5">${each(slot_types, (slot_type) => {
          return `<div class="${[
            "h-1 w-1 rounded-full",
            (slot_type === "CRENEAU" ? "bg-primary" : "") + " " + (slot_type === "EVENEMENT" ? "bg-green-500" : "") + " " + (slot_type === "FERMETURE" ? "bg-red-500" : "")
          ].join(" ").trim()}"></div>`;
        })}</div>` : ``}`;
      }
    }
  )}`;
});
const Calendar_grid_body = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `${validate_component(Calendar_grid_body$1, "CalendarPrimitive.GridBody").$$render($$result, Object.assign({}, { class: cn(className) }, $$restProps), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Calendar_grid_head = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `${validate_component(Calendar_grid_head$1, "CalendarPrimitive.GridHead").$$render($$result, Object.assign({}, { class: cn(className) }, $$restProps), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Calendar_grid_row = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `${validate_component(Calendar_grid_row$1, "CalendarPrimitive.GridRow").$$render($$result, Object.assign({}, { class: cn("flex", className) }, $$restProps), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Calendar_grid = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `${validate_component(Calendar_grid$1, "CalendarPrimitive.Grid").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn("w-full border-collapse space-y-1", className)
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
const Calendar_head_cell = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `${validate_component(Calendar_head_cell$1, "CalendarPrimitive.HeadCell").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn("text-muted-foreground w-9 rounded-md text-[0.8rem] font-normal", className)
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
const Calendar_header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `${validate_component(Calendar_header$1, "CalendarPrimitive.Header").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn("relative flex w-full items-center justify-between pt-1", className)
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
const Calendar_heading = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `${validate_component(Calendar_heading$1, "CalendarPrimitive.Heading").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn("text-sm font-medium", className)
      },
      $$restProps
    ),
    {},
    {
      default: ({ headingValue }) => {
        return `${slots.default ? slots.default({ headingValue }) : ` ${escape(headingValue)} `}`;
      }
    }
  )}`;
});
const Calendar_months = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `<div${spread(
    [
      {
        class: escape_attribute_value(cn("mt-4 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</div>`;
});
const Select_item = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "value", "label", "disabled"]);
  let { class: className = void 0 } = $$props;
  let { value } = $$props;
  let { label = void 0 } = $$props;
  let { disabled = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0) $$bindings.label(label);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);
  return `${validate_component(Select_item$1, "SelectPrimitive.Item").$$render(
    $$result,
    Object.assign(
      {},
      { value },
      { disabled },
      { label },
      {
        class: cn("data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)
      },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `<span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">${validate_component(Select_item_indicator, "SelectPrimitive.ItemIndicator").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(Check, "Check").$$render($$result, { class: "h-4 w-4" }, {}, {})}`;
          }
        })}</span> ${slots.default ? slots.default({}) : ` ${escape(label || value)} `}`;
      }
    }
  )}`;
});
function scale(node, { delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 } = {}) {
  const style = getComputedStyle(node);
  const target_opacity = +style.opacity;
  const transform = style.transform === "none" ? "" : style.transform;
  const sd = 1 - start;
  const od = target_opacity * (1 - opacity);
  return {
    delay,
    duration,
    easing,
    css: (_t, u) => `
			transform: ${transform} scale(${1 - sd * u});
			opacity: ${target_opacity - od * u}
		`
  };
}
const Select_content = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "sideOffset",
    "inTransition",
    "inTransitionConfig",
    "outTransition",
    "outTransitionConfig",
    "class"
  ]);
  let { sideOffset = 4 } = $$props;
  let { inTransition = flyAndScale } = $$props;
  let { inTransitionConfig = void 0 } = $$props;
  let { outTransition = scale } = $$props;
  let { outTransitionConfig = { start: 0.95, opacity: 0, duration: 50 } } = $$props;
  let { class: className = void 0 } = $$props;
  if ($$props.sideOffset === void 0 && $$bindings.sideOffset && sideOffset !== void 0) $$bindings.sideOffset(sideOffset);
  if ($$props.inTransition === void 0 && $$bindings.inTransition && inTransition !== void 0) $$bindings.inTransition(inTransition);
  if ($$props.inTransitionConfig === void 0 && $$bindings.inTransitionConfig && inTransitionConfig !== void 0) $$bindings.inTransitionConfig(inTransitionConfig);
  if ($$props.outTransition === void 0 && $$bindings.outTransition && outTransition !== void 0) $$bindings.outTransition(outTransition);
  if ($$props.outTransitionConfig === void 0 && $$bindings.outTransitionConfig && outTransitionConfig !== void 0) $$bindings.outTransitionConfig(outTransitionConfig);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `${validate_component(Select_content$1, "SelectPrimitive.Content").$$render(
    $$result,
    Object.assign(
      {},
      { inTransition },
      { inTransitionConfig },
      { outTransition },
      { outTransitionConfig },
      { sideOffset },
      {
        class: cn("bg-popover text-popover-foreground relative z-50 min-w-[8rem] overflow-hidden rounded-md border shadow-md outline-none", className)
      },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `<div class="w-full p-1">${slots.default ? slots.default({}) : ``}</div>`;
      }
    }
  )}`;
});
const Chevron_down = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [["path", { "d": "m6 9 6 6 6-6" }]];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "chevron-down" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Select_trigger = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `${validate_component(Select_trigger$1, "SelectPrimitive.Trigger").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn("border-input bg-background ring-offset-background focus-visible:ring-ring aria-[invalid]:border-destructive data-[placeholder]:[&>span]:text-muted-foreground flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className)
      },
      $$restProps
    ),
    {},
    {
      default: ({ builder }) => {
        return `${slots.default ? slots.default({ builder }) : ``} <div>${validate_component(Chevron_down, "ChevronDown").$$render($$result, { class: "h-4 w-4 opacity-50" }, {}, {})}</div>`;
      }
    }
  )}`;
});
const Root = Select;
const Value = Select_value;
const Calendar_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let defaultYear;
  let defaultMonth;
  let $$restProps = compute_rest_props($$props, ["value", "placeholder", "weekdayFormat", "class"]);
  let { value = void 0 } = $$props;
  let { placeholder = today(getLocalTimeZone()) } = $$props;
  let { weekdayFormat = "short" } = $$props;
  const monthOptions = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Decembre"
  ].map((month, i) => ({ value: i + 1, label: month }));
  const monthFmt = new DateFormatter("fr-FR", { month: "long" });
  const yearOptions = Array.from({ length: 10 }, (_, i) => ({
    label: String(
      /* @__PURE__ */ (/* @__PURE__ */ new Date()).getFullYear() + i
    ),
    value: /* @__PURE__ */ (/* @__PURE__ */ new Date()).getFullYear() + i
  }));
  let { class: className = void 0 } = $$props;
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0) $$bindings.placeholder(placeholder);
  if ($$props.weekdayFormat === void 0 && $$bindings.weekdayFormat && weekdayFormat !== void 0) $$bindings.weekdayFormat(weekdayFormat);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    defaultYear = placeholder ? {
      value: placeholder.year,
      label: String(placeholder.year)
    } : void 0;
    defaultMonth = placeholder ? {
      value: placeholder.month,
      label: monthFmt.format(placeholder.toDate(getLocalTimeZone())).toString().split("").map((c, i) => i === 0 ? c.toUpperCase() : c).join("")
    } : void 0;
    $$rendered = `${validate_component(Calendar, "CalendarPrimitive.Root").$$render(
      $$result,
      Object.assign(
        {},
        { weekdayFormat },
        {
          class: cn("rounded-md border p-3", className)
        },
        $$restProps,
        { value },
        { placeholder }
      ),
      {
        value: ($$value) => {
          value = $$value;
          $$settled = false;
        },
        placeholder: ($$value) => {
          placeholder = $$value;
          $$settled = false;
        }
      },
      {
        default: ({ months, weekdays }) => {
          return `${validate_component(Calendar_header, "Calendar.Header").$$render($$result, { class: "flex flex-col items-center" }, {}, {
            default: () => {
              return `${validate_component(Calendar_heading, "Calendar.Heading").$$render(
                $$result,
                {
                  class: "flex w-full items-center justify-between gap-2"
                },
                {},
                {
                  default: () => {
                    return `${validate_component(Root, "Select.Root").$$render(
                      $$result,
                      {
                        selected: defaultMonth,
                        items: monthOptions,
                        onSelectedChange: (v) => {
                          if (!v || !placeholder) return;
                          if (v.value === placeholder?.month) return;
                          placeholder = placeholder.set({ month: v.value });
                        }
                      },
                      {},
                      {
                        default: () => {
                          return `${validate_component(Select_trigger, "Select.Trigger").$$render(
                            $$result,
                            {
                              "aria-label": "Select month",
                              class: "w-[60%]"
                            },
                            {},
                            {
                              default: () => {
                                return `${validate_component(Value, "Select.Value").$$render($$result, { placeholder: "Select month" }, {}, {})}`;
                              }
                            }
                          )} ${validate_component(Select_content, "Select.Content").$$render($$result, { class: "max-h-[200px] overflow-y-auto" }, {}, {
                            default: () => {
                              return `${each(monthOptions, ({ value: value2, label }) => {
                                return `${validate_component(Select_item, "Select.Item").$$render($$result, { value: value2, label }, {}, {
                                  default: () => {
                                    return `${escape(label)} `;
                                  }
                                })}`;
                              })}`;
                            }
                          })}`;
                        }
                      }
                    )} ${validate_component(Root, "Select.Root").$$render(
                      $$result,
                      {
                        selected: defaultYear,
                        items: yearOptions,
                        onSelectedChange: (v) => {
                          if (!v || !placeholder) return;
                          if (v.value === placeholder?.year) return;
                          placeholder = placeholder.set({ year: v.value });
                        }
                      },
                      {},
                      {
                        default: () => {
                          return `${validate_component(Select_trigger, "Select.Trigger").$$render(
                            $$result,
                            {
                              "aria-label": "Select year",
                              class: "w-[40%]"
                            },
                            {},
                            {
                              default: () => {
                                return `${validate_component(Value, "Select.Value").$$render($$result, { placeholder: "Select year" }, {}, {})}`;
                              }
                            }
                          )} ${validate_component(Select_content, "Select.Content").$$render($$result, { class: "max-h-[200px] overflow-y-auto" }, {}, {
                            default: () => {
                              return `${each(yearOptions, ({ value: value2, label }) => {
                                return `${validate_component(Select_item, "Select.Item").$$render($$result, { value: value2, label }, {}, {
                                  default: () => {
                                    return `${escape(label)} `;
                                  }
                                })}`;
                              })}`;
                            }
                          })}`;
                        }
                      }
                    )}`;
                  }
                }
              )}`;
            }
          })} ${validate_component(Calendar_months, "Calendar.Months").$$render(
            $$result,
            {
              class: "mx-auto text-center items-center"
            },
            {},
            {
              default: () => {
                return `${each(months, (month) => {
                  return `${validate_component(Calendar_grid, "Calendar.Grid").$$render($$result, {}, {}, {
                    default: () => {
                      return `${validate_component(Calendar_grid_head, "Calendar.GridHead").$$render($$result, {}, {}, {
                        default: () => {
                          return `${validate_component(Calendar_grid_row, "Calendar.GridRow").$$render($$result, { class: "flex justify-center" }, {}, {
                            default: () => {
                              return `${each(weekdays, (weekday) => {
                                return `${validate_component(Calendar_head_cell, "Calendar.HeadCell").$$render($$result, {}, {}, {
                                  default: () => {
                                    return `${escape(weekday.slice(0, 2))} `;
                                  }
                                })}`;
                              })} `;
                            }
                          })} `;
                        }
                      })} ${validate_component(Calendar_grid_body, "Calendar.GridBody").$$render($$result, {}, {}, {
                        default: () => {
                          return `${each(month.weeks, (weekDates) => {
                            return `${validate_component(Calendar_grid_row, "Calendar.GridRow").$$render($$result, { class: "mt-2 w-full justify-center" }, {}, {
                              default: () => {
                                return `${each(weekDates, (date) => {
                                  return `${validate_component(Calendar_cell, "Calendar.Cell").$$render($$result, { date }, {}, {
                                    default: () => {
                                      return `${validate_component(Calendar_day, "Calendar.Day").$$render($$result, { date, month: month.value }, {}, {})} `;
                                    }
                                  })}`;
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
            }
          )}`;
        }
      }
    )}`;
  } while (!$$settled);
  return $$rendered;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value2) => value2);
  let value;
  let { data } = $$props;
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
                  return `Calendrier`;
                }
              })} ${validate_component(Card_description, "CardDescription").$$render($$result, {}, {}, {
                default: () => {
                  return `Le calendrier permettant de s&#39;inscrire aux différents créneaux et
            évènements.`;
                }
              })}`;
            }
          })} <div class="relative" data-svelte-h="svelte-eeu87j"><div class="absolute inset-0 flex items-center"><span class="m-4 w-full border-t"></span></div></div> ${validate_component(Card_content, "CardContent").$$render($$result, { class: "flex max-sm:flex-col gap-4 pt-6" }, {}, {
            default: () => {
              return `${validate_component(Calendar_1, "Calendar").$$render(
                $$result,
                {
                  initialFocus: true,
                  numberOfMonths: 1,
                  weekStartsOn: 1,
                  class: "rounded-md border md:w-1/2",
                  value
                },
                {
                  value: ($$value) => {
                    value = $$value;
                    $$settled = false;
                  }
                },
                {}
              )} <div class="relative" data-svelte-h="svelte-1sbigvq"><div class="absolute inset-0 flex sm:flex-col items-center"><span class="sm:h-full sm:border-l w-full border-t"></span></div></div> <div class="flex flex-col gap-4 w-full md:w-1/2">${validate_component(SlotCard, "SlotCard").$$render($$result, { data, slotDate: value?.toString() }, {}, {})}</div>`;
            }
          })}`;
        }
      }
    )}`;
  } while (!$$settled);
  $$unsubscribe_page();
  return $$rendered;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-CsrAs_X0.js.map
