import { c as create_ssr_component, v as validate_component } from "../../../../chunks/ssr.js";
import { C as Card, a as Card_header, b as Card_title } from "../../../../chunks/card.js";
import "clsx";
import { C as Card_description } from "../../../../chunks/card-description.js";
import { r as readable } from "../../../../chunks/index2.js";
import { c as createTable, a as addPagination } from "../../../../chunks/addPagination.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  const table = createTable(readable(data.users), {
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
    })
  ]);
  const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } = table.createViewModel(columns);
  pluginStates.page;
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
            return `${validate_component(Card_title, "CardTitle").$$render($$result, {}, {}, {
              default: () => {
                return `Intervenant`;
              }
            })} ${validate_component(Card_description, "CardDescription").$$render($$result, {}, {}, {
              default: () => {
                return `Pannel intervenant du site`;
              }
            })}`;
          }
        })}`;
      }
    }
  )}`;
});
export {
  Page as default
};
