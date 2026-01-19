<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import {
      CardContent
    } from "$lib/components/ui/card";
    import CardFooter from "@/components/ui/card/card-footer.svelte";
    import * as Table from "@/components/ui/table/";
    import type { Slot, User } from "@prisma/client";
    import { createRender, createTable, Render, Subscribe } from "svelte-headless-table";
    import { addPagination } from "svelte-headless-table/plugins";
    import type { Writable } from "svelte/store";
    import SlotManagement from "./SlotManagement.svelte";

    export let slots: Writable<Slot[]>;
    export let users: Writable<User[]>;

    const table = createTable(slots, {
        page: addPagination({
            initialPageSize: 5,
        }),
    });

    const columns = table.createColumns([
        table.column({
            accessor: ({ id }) => id.substring(0, 8) + "...",
            header: "ID",
        }),
        table.column({
            accessor: "name",
            header: "Nom",
        }),
        table.column({
            accessor: ({ description }) => description?.substring(0, 20) + "...",
            header: "Description",
        }),
        table.column({
            // Format the date to be more readable
            accessor: ({ starts_at }) => new Date(starts_at).toLocaleString(),
            header: "Début",
        }),
        table.column({
            accessor: ({ ends_at }) => new Date(ends_at).toLocaleString(),
            header: "Fin",
        }),
        table.column({
            accessor: "capacity",
            header: "Jauge",
        }),
        table.column({
            accessor: ({ owner_id }) => {
                const user = $users.find((user) => user.id === owner_id);
                return user?.first_name + " " + user?.last_name;
            },
            header: "Responsable",
        }),
        table.column({
            accessor: ({ id }) => id,
            header: "Modifier",
            cell: ({ value }) => {
                return createRender(SlotManagement, { id: value });
            },
        }),
    ]);

    const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
        table.createViewModel(columns);

    const { hasNextPage, hasPreviousPage, pageIndex, pageCount } =
        pluginStates.page;
</script>

<CardContent class="flex flex-col gap-4 pt-6">

    <h2 class="text-base font-semibold">Créneaux :</h2>

    <div class="rounded-md border w-full">
        <Table.Root {...$tableAttrs}>
            <Table.Header>
                {#each $headerRows as headerRow}
                    <Subscribe rowAttrs={headerRow.attrs()}>
                        <Table.Row>
                            {#each headerRow.cells as cell (cell.id)}
                                <Subscribe
                                    attrs={cell.attrs()}
                                    let:attrs
                                    props={cell.props()}
                                >
                                    <Table.Head {...attrs}>
                                        <Render of={cell.render()} />
                                    </Table.Head>
                                </Subscribe>
                            {/each}
                        </Table.Row>
                    </Subscribe>
                {/each}
            </Table.Header>
            <Table.Body {...$tableBodyAttrs}>
                {#each $pageRows as row (row.id)}
                    <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
                        <Table.Row {...rowAttrs}>
                            {#each row.cells as cell (cell.id)}
                                <Subscribe attrs={cell.attrs()} let:attrs>
                                    <Table.Cell {...attrs}>
                                        <Render of={cell.render()} />
                                    </Table.Cell>
                                </Subscribe>
                            {/each}
                        </Table.Row>
                    </Subscribe>
                {/each}
            </Table.Body>
        </Table.Root>
    </div>
</CardContent>

<div class="relative">
    <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t" />
    </div>
</div>

<CardFooter>
    <div class="flex items-center justify-end space-x-4 py-4">
        <Button
            variant="outline"
            size="sm"
            on:click={() => ($pageIndex = $pageIndex - 1)}
            disabled={!$hasPreviousPage}>Previous</Button
        >
        <span class="text-gray-500"
            >Page {$pageIndex + 1} / {$pageCount}</span
        >
        <Button
            variant="outline"
            size="sm"
            disabled={!$hasNextPage}
            on:click={() => ($pageIndex = $pageIndex + 1)}>Next</Button
        >
    </div>
</CardFooter>