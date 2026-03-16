<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import {
      CardContent
    } from "$lib/components/ui/card";
    import * as Table from "@/components/ui/table/";
    import type { Slot, User } from "@prisma/client";
    import { createRender, createTable, Render, Subscribe } from "svelte-headless-table";
    import { writable } from "svelte/store";
    import type { Writable } from "svelte/store";
    import SlotManagement from "./SlotManagement.svelte";

    export let slots: Writable<Slot[]>;
    export let users: Writable<User[]>;
    export let canWrite = false;
    export let canEditDetails = false;
    export let canEditCapacity = false;
    export let canEditResponsibles = false;
    export let canEditType = false;
    export let canDelete = false;
    export let rootBypassEditDetails = false;
    export let rootBypassEditCapacity = false;
    export let rootBypassEditResponsibles = false;
    export let rootBypassEditType = false;
    export let rootBypassDelete = false;

    let searchQuery = "";
    let allSlots: Slot[] = [];
    let filteredSlotsStore = writable<Slot[]>([]);

    // Get initial slots
    slots.subscribe((s) => {
        allSlots = s;
        updateFiltered();
    });

    function normalize(text: string) {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    }

    function slotSearchText(slot: Slot) {
        const responsibles = (slot as any).responsibles as User[] | undefined;
        const responsiblesLabel = responsibles?.length
            ? responsibles.map((u) => `${u.first_name} ${u.last_name}`).join(" ")
            : "";
        const owner = $users.find((user) => user.id === slot.owner_id);
        const ownerLabel = owner ? `${owner.first_name} ${owner.last_name}` : "";
        return [
            slot.id,
            slot.name ?? "",
            slot.description ?? "",
            slot.slot_type ?? "",
            slot.capacity?.toString() ?? "",
            new Date(slot.starts_at).toLocaleString("fr-FR"),
            new Date(slot.ends_at).toLocaleString("fr-FR"),
            responsiblesLabel,
            ownerLabel,
        ].join(" ");
    }

    // Update filtered results when search changes
    function updateFiltered() {
        const query = normalize(searchQuery);
        if (!query) {
            filteredSlotsStore.set(allSlots);
            return;
        }

        const filtered = allSlots.filter((slot) => normalize(slotSearchText(slot)).includes(query));
        filteredSlotsStore.set(filtered);
    }

    $: searchQuery, updateFiltered();

    const table = createTable(filteredSlotsStore);

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
                // If responsibles is present, list them; else fallback to owner
                const responsibles = (slot as any).responsibles as User[] | undefined;
                if (responsibles && responsibles.length > 0) {
                    return responsibles.map(u => `${u.first_name} ${u.last_name}`).join(", ");
                }
                const user = $users.find((user) => user.id === slot.owner_id);
                return user ? `${user.first_name} ${user.last_name}` : "";
            },
            header: "Responsables",
        }),
        table.column({
            accessor: ({ id }) => id,
            header: "Actions",
            cell: ({ value }) => {
                return createRender(SlotManagement, {
                    id: value,
                    users: $users,
                    canWrite,
                    canEditDetails,
                    canEditCapacity,
                    canEditResponsibles,
                    canEditType,
                    canDelete,
                    rootBypassEditDetails,
                    rootBypassEditCapacity,
                    rootBypassEditResponsibles,
                    rootBypassEditType,
                    rootBypassDelete,
                });
            },
        }),
    ]);

    const { headerRows, rows, tableAttrs, tableBodyAttrs } =
        table.createViewModel(columns);
</script>

<CardContent class="flex flex-col gap-4 pt-6">

    <div class="flex items-center justify-between gap-4">
        <h2 class="text-base font-semibold">Créneaux :</h2>
        <Input
            type="text"
            placeholder="Rechercher sur tous les champs..."
            bind:value={searchQuery}
            class="max-w-xs"
        />
    </div>

    <div class="rounded-md border w-full max-h-[30rem] overflow-y-auto">
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
                {#each $rows as row (row.id)}
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