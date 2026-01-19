<script lang="ts">
    import {
      Card,
      CardContent,
      CardDescription,
      CardFooter,
      CardHeader,
      CardTitle
    } from "$lib/components/ui/card";
    import Button from "@/components/ui/button/button.svelte";
    import * as Table from "@/components/ui/table/";

    import { Input } from "$lib/components/ui/input";
    import type { Slot, User } from "@prisma/client";
    
    import { getFlash } from "sveltekit-flash-message";
    import { page } from "$app/stores";
    import { createRender, createTable, Render, Subscribe } from "svelte-headless-table";
    import { addPagination } from "svelte-headless-table/plugins";

    import { participants, subscribe_slot, unsubscribe_slot, attendees } from '$lib/stores';
    import { writable } from 'svelte/store';
    
    import ParticipantManagement from "./ParticipantManagement.svelte";
  
    const flash = getFlash(page, {
        clearOnNavigate: true,
        clearAfterMs: 10,
        clearArray: true,
    });

    export let slot: Slot;
    export let owner: User;
    export let user: User;
    export let participants_list: User[];
    export let attendees_list: User[];
    export let all_users: User[] = [];

    let current_slot = slot;

    $: {
        if (typeof current_slot.starts_at === 'string') {
            current_slot.starts_at = new Date(current_slot.starts_at);
        }
        if (typeof current_slot.ends_at === 'string') {
            current_slot.ends_at = new Date(current_slot.ends_at);
        }
    }

    let isResponsible = false;
    let isExpanded = false;
    $: isResponsible = Boolean((slot as any)?.responsibles?.some((r: User) => r.id === user.id));
    $: canManage = user.root || user.id === slot.owner_id || isResponsible;

    $: {
        participants.set(participants_list);
        attendees.set(attendees_list);
    }

    $: participants_count = $participants?.length;
    $: subscribed = $participants?.some(participant => participant.id === user.id);

    // Check if signup is blocked
    $: slot_type = (current_slot as any).slot_type;
    $: isBlocked = slot_type === 'EVENEMENT' || slot_type === 'FERMETURE';

    async function handle_subscribe(user_id: string, slot_id: string) {
        if (!user_id || !slot_id) return;
        const result = subscribed
            ? await unsubscribe_slot(user_id, slot_id)
            : await subscribe_slot(user_id, slot_id);

        if (result.success) {
            $flash = {
                type: "success",
                message: `Votre ${!subscribed ? "désinscription" : "inscription"} a bien été prise en compte.`,
            };
        }
    }

    let searchQuery = "";
    let allParticipants: User[] = [];
    let filteredParticipantsStore = writable<User[]>([]);

    // Get initial participants
    participants.subscribe((p) => {
        allParticipants = p || [];
        updateFiltered();
    });

    // Update filtered results when search changes
    function updateFiltered() {
        if (searchQuery.trim() === "") {
            filteredParticipantsStore.set(allParticipants);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = allParticipants.filter((user) => {
                return (
                    user.first_name.toLowerCase().includes(query) ||
                    user.last_name.toLowerCase().includes(query) ||
                    user.email.toLowerCase().includes(query) ||
                    (user.churros_uid && user.churros_uid.toLowerCase().includes(query))
                );
            });
            filteredParticipantsStore.set(filtered);
        }
    }

    $: searchQuery, updateFiltered();

    const table = createTable(filteredParticipantsStore, {
        page: addPagination({
            initialPageSize: 4,
        }),
    });

    const responsibleIds = new Set((slot as any).responsibles?.map((u: User) => u.id) || []);

    const columns = table.createColumns([
        table.column({
            accessor: ({ id, first_name, last_name }) => {
                const name = `${first_name} ${last_name}`;
                return responsibleIds.has(id) ? `${name} 🏅` : name;
            },
            header: "Nom",
        }),
        table.column({
            accessor: ({ id }) => id,
            header: "Présent",
            cell: ({ value }) => {
                const isPresent = $attendees?.some(a => a.id === value);
                return isPresent ? "✅" : "❌";
            }
        }),
        table.column({
            accessor: "cotisant_as",
            header: "AS",
            cell: ({ value }) => {
                return value ? "✅" : "❌";
            },
        }),
        table.column({
            accessor: "cotisant_grinp",
            header: "Gr'INP",
            cell: ({ value }) => {
                return value ? "✅" : "❌";
            },
        }),
        table.column({
            accessor: ({ id }) => id,
            header: "Modifier",
            cell: ({ value }) => {
                return createRender(ParticipantManagement, { id: value, slot_id: slot.id, unsubscribe_slot: unsubscribe_slot });
            },
        }),
    ]);

    const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
        table.createViewModel(columns);

    const { hasNextPage, hasPreviousPage, pageIndex, pageCount } =
        pluginStates.page;

    // Add user search functionality
    let addUserSearchQuery = "";
    let filteredAvailableUsersStore = writable<User[]>([]);
    let showAddMemberPanel = false;

    function updateAvailableUsers() {
        if (!all_users) return;
        
        const currentParticipantIds = new Set(allParticipants.map(p => p.id));
        let availableUsers = all_users.filter(u => !currentParticipantIds.has(u.id));

        if (addUserSearchQuery.trim() === "") {
            filteredAvailableUsersStore.set(availableUsers);
        } else {
            const query = addUserSearchQuery.toLowerCase();
            const filtered = availableUsers.filter((user) => {
                return (
                    user.first_name.toLowerCase().includes(query) ||
                    user.last_name.toLowerCase().includes(query) ||
                    user.email.toLowerCase().includes(query) ||
                    (user.churros_uid && user.churros_uid.toLowerCase().includes(query))
                );
            });
            filteredAvailableUsersStore.set(filtered);
        }
    }

    $: addUserSearchQuery, updateAvailableUsers();
    $: allParticipants, updateAvailableUsers();

    // Capacity edit controls
    let showCapacityEdit = false;
    let capacityInput: number | string = 0;

    function openCapacityEdit() {
        capacityInput = current_slot.capacity ?? 0;
        showCapacityEdit = true;
    }

    async function saveCapacity() {
        const value = typeof capacityInput === 'string' ? parseInt(capacityInput, 10) : capacityInput;
        if (!Number.isFinite(value)) return;
        try {
            const res = await fetch('/api/slots/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slot_id: slot.id, capacity: value })
            });
            if (res.status === 200) {
                window.location.reload();
            }
        } catch (e) {
            console.error(e);
        }
    }
</script>

{#if canManage}
    <Card class="flex flex-col justify-between w-full">
        <div class="p-4 cursor-pointer hover:bg-black hover:bg-opacity-5 transition-colors" on:click={() => (isExpanded = !isExpanded)} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && (isExpanded = !isExpanded)}>
            <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2 flex-1">
                    <div class="font-semibold text-lg">Gérer : "{current_slot.name}"</div>
                    {#if slot_type === 'EVENEMENT'}
                        <span class="text-xs font-semibold px-2 py-1 rounded bg-green-100 text-green-800">Évènement</span>
                    {:else if slot_type === 'FERMETURE'}
                        <span class="text-xs font-semibold px-2 py-1 rounded bg-red-100 text-red-800">Fermeture</span>
                    {/if}
                </div>
                <span class="text-lg">{isExpanded ? '▼' : '▶'}</span>
            </div>
            <div class="text-sm text-muted-foreground">
                {#if current_slot.starts_at && current_slot.ends_at}
                    {current_slot.starts_at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - {current_slot.ends_at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                {/if}
            </div>
        </div>

        {#if isExpanded}
            <CardContent class="flex flex-col gap-4 pt-6">
                <div class="flex items-center justify-between">
                    <span>Liste des participants :</span>
                    <div class="flex items-center gap-2">
                        <Button size="sm" on:click={() => showAddMemberPanel = !showAddMemberPanel}>
                            {#if showAddMemberPanel}Fermer l'ajout{:else}Ajouter un membre{/if}
                        </Button>
                        <Button size="sm" variant="outline" on:click={openCapacityEdit}>
                            Modifier la jauge
                        </Button>
                    </div>
                </div>

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

            {#if showAddMemberPanel}
            <div class="flex flex-col gap-2 mt-4">
                <span class="font-semibold">Ajouter un participant :</span>
                <Input
                    type="text"
                    placeholder="Rechercher un utilisateur à ajouter..."
                    bind:value={addUserSearchQuery}
                    class="max-w-xs"
                />
                <div class="max-h-48 overflow-y-auto border rounded p-2 flex flex-col gap-2">
                    {#if $filteredAvailableUsersStore.length > 0}
                        {#each $filteredAvailableUsersStore as availableUser (availableUser.id)}
                            <button
                                class="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-left"
                                on:click={() => handle_subscribe(availableUser.id, slot.id)}
                            >
                                <span>{availableUser.first_name} {availableUser.last_name}</span>
                                <span class="text-sm text-gray-500">{availableUser.email}</span>
                            </button>
                        {/each}
                    {:else}
                        <span class="text-gray-500 text-sm">Aucun utilisateur disponible</span>
                    {/if}
                </div>
            </div>
            {/if}

            {#if showCapacityEdit}
            <div class="flex items-end gap-2 mt-4">
                <div class="grid gap-1">
                    <span class="font-semibold">Modifier la jauge</span>
                    <Input type="number" bind:value={capacityInput} class="w-32" />
                </div>
                <div class="flex gap-2">
                    <Button variant="outline" on:click={() => { showCapacityEdit = false; }}>Annuler</Button>
                    <Button on:click={saveCapacity}>Enregistrer</Button>
                </div>
            </div>
            {/if}
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
        {/if}
    </Card>
{:else}
    <Card class="flex flex-col justify-between w-full">
        <div class="p-4 cursor-pointer hover:bg-black hover:bg-opacity-5 transition-colors" on:click={() => (isExpanded = !isExpanded)} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && (isExpanded = !isExpanded)}>
            <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2 flex-1">
                    <div class="font-semibold text-lg">{current_slot.name}</div>
                    {#if slot_type === 'EVENEMENT'}
                        <span class="text-xs font-semibold px-2 py-1 rounded bg-green-100 text-green-800">Évènement</span>
                    {:else if slot_type === 'FERMETURE'}
                        <span class="text-xs font-semibold px-2 py-1 rounded bg-red-100 text-red-800">Fermeture</span>
                    {/if}
                </div>
                <span class="text-lg">{isExpanded ? '▼' : '▶'}</span>
            </div>
            <div class="text-sm text-muted-foreground">
                Encadré par {owner.first_name}
                {owner.last_name}
            </div>
            <div class="text-sm text-muted-foreground">
                {#if current_slot.starts_at && current_slot.ends_at}
                    {#if current_slot.starts_at.getDate() === current_slot.ends_at.getDate()}
                        Le {current_slot.starts_at.toLocaleDateString()} de {current_slot.starts_at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} à {current_slot.ends_at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.
                    {:else}
                        Du {current_slot.starts_at.toLocaleDateString()} à {current_slot.starts_at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} au {current_slot.ends_at.toLocaleDateString()} à {current_slot.ends_at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.
                    {/if}
                {/if}
            </div>
        </div>

        {#if isExpanded}
        <div class="relative">
            <div class="absolute inset-0 flex items-center">
                <span class="w-full border-t" />
            </div>
        </div>

        <CardContent
            class="flex flex-col gap-4 pt-6 h-full text-balance w-full"
        >
            {current_slot.description}
        </CardContent>

        <div class="relative">
            <div class="absolute inset-0 flex items-center">
                <span class="w-full border-t" />
            </div>
        </div>

        <CardFooter class="p-2 flex justify-between">
            <CardDescription>
                {participants_count > 0
                    ? participants_count + " participants"
                    : "Aucun participant"}
            </CardDescription>

            <Button 
                class="px-4 py-0" 
                disabled={isBlocked && !user.root}
                on:click={() => handle_subscribe(user.id, slot.id)}
            >
                {#if isBlocked}
                    Inscriptions fermées
                {:else if !subscribed}
                    S'inscrire
                {:else}
                    Se désinscrire
                {/if}
            </Button>
        </CardFooter>
        {/if}
    </Card>
{/if}
