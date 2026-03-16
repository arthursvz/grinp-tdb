<script lang="ts">
    import {
        Card,
        CardContent,
        CardHeader,
        CardTitle,
        CardDescription,
        CardFooter
    } from "$lib/components/ui/card";

    import Button from "@/components/ui/button/button.svelte";
    import * as Table from "@/components/ui/table/";
    import { Input } from "$lib/components/ui/input";

    import type { Slot, User } from "@prisma/client";
    import { page } from "$app/stores";

    // Imports pour la fluidité (Zéro-Reload)
    import { invalidateAll } from "$app/navigation";
    import { toast } from "svelte-sonner";

    import {
        createRender,
        createTable,
        Render,
        Subscribe
    } from "svelte-headless-table";
    import { addPagination } from "svelte-headless-table/plugins";

    import {
        subscribe_slot,
        unsubscribe_slot
    } from "$lib/stores";

    import { writable } from "svelte/store";
    import ParticipantManagement from "./ParticipantManagement.svelte";

    /* ------------------------------------------------------------------ */
    /* Props */
    /* ------------------------------------------------------------------ */

    export let slot: Slot;
    export let owner: User;
    export let user: User;
    export let participants_list: User[] = [];
    export let attendees_list: User[] = [];
    export let all_users: User[] = [];

    /* ------------------------------------------------------------------ */
    /* État */
    /* ------------------------------------------------------------------ */

    let current_slot: Slot = slot;
    let isExpanded = false;

    // Conversion des dates
    $: {
        if (typeof current_slot.starts_at === "string") current_slot.starts_at = new Date(current_slot.starts_at);
        if (typeof current_slot.ends_at === "string") current_slot.ends_at = new Date(current_slot.ends_at);
    }

    /**
     * Extrait l'heure brute (UTC) pour l'API et l'affichage
     */
    function formatTimeUTC(date: Date) {
        if (!date) return "";
        const h = date.getUTCHours().toString().padStart(2, '0');
        const m = date.getUTCMinutes().toString().padStart(2, '0');
        return `${h}:${m}`;
    }

    $: timeRange = (current_slot.starts_at && current_slot.ends_at)
        ? `${formatTimeUTC(current_slot.starts_at)} - ${formatTimeUTC(current_slot.ends_at)}`
        : "";

    /* ------------------------------------------------------------------ */
    /* Permissions */
    /* ------------------------------------------------------------------ */

    $: isResponsible = Boolean((slot as any)?.responsibles?.some((r: User) => r.id === user.id));
    $: canManage = user.root || (user.instructor && (user.id === slot.owner_id || isResponsible));
    $: rootBypassManage = user.root && !(user.instructor && (user.id === slot.owner_id || isResponsible));
    const adminBypassLabel = "A";

    /* ------------------------------------------------------------------ */
    /* Inscriptions */
    /* ------------------------------------------------------------------ */

    $: participants_count = participants_list?.length ?? 0;
    $: subscribed = participants_list?.some((p) => p.id === user.id) ?? false;
    $: slot_type = (current_slot as any)?.slot_type ?? null;
    $: isBlocked = slot_type === "FERMETURE";

    async function handle_subscribe(user_id: string, slot_id: string) {
        if (!user_id || !slot_id) return;

        const isSelf = user_id === user.id;
        const result = isSelf
            ? (subscribed ? await unsubscribe_slot(user_id, slot_id) : await subscribe_slot(user_id, slot_id))
            : await subscribe_slot(user_id, slot_id);

        if (result?.success) {
            participants_list = result.participants ?? participants_list;
            toast.success(isSelf ? (subscribed ? "Désinscription réussie" : "Inscription réussie !") : "Membre ajouté");
            await invalidateAll();
        } else {
            toast.error("Action impossible (complet ou erreur)");
        }
    }

    /* ------------------------------------------------------------------ */
    /* Table Participants */
    /* ------------------------------------------------------------------ */

    let searchQuery = "";
    const filteredStore = writable<User[]>([]);

    function updateFiltered() {
        const list = participants_list || [];
        if (!searchQuery.trim()) {
            filteredStore.set(list);
        } else {
            const q = searchQuery.toLowerCase();
            filteredStore.set(list.filter(u =>
                u.first_name.toLowerCase().includes(q) || u.last_name.toLowerCase().includes(q)
            ));
        }
    }

    $: searchQuery, participants_list, updateFiltered();

    const table = createTable(filteredStore, {
        page: addPagination({ initialPageSize: 4 })
    });

    const columns = table.createColumns([
        table.column({
            header: "Nom",
            accessor: (u) => {
                const isRes = (slot as any)?.responsibles?.some((r: any) => r.id === u.id);
                return isRes ? `${u.first_name} ${u.last_name} 🏅` : `${u.first_name} ${u.last_name}`;
            }
        }),
        table.column({
            header: "Présent",
            accessor: ({ id }) => id,
            cell: ({ value }) => attendees_list.some(a => a.id === value) ? "✅" : "❌"
        }),
        table.column({ header: "AS", accessor: "cotisant_as", cell: ({ value }) => value ? "✅" : "❌" }),
        table.column({ header: "Gr'INP", accessor: "cotisant_grinp", cell: ({ value }) => value ? "✅" : "❌" }),
        table.column({
            header: "Action",
            accessor: ({ id }) => id,
            cell: ({ value }) => createRender(ParticipantManagement, {
                id: value,
                slot_id: slot.id,
                unsubscribe_slot
            })
        })
    ]);

    const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } = table.createViewModel(columns);
    const { hasNextPage, hasPreviousPage, pageIndex, pageCount } = pluginStates.page;

    /* ------------------------------------------------------------------ */
    /* Administration Logic */
    /* ------------------------------------------------------------------ */

    let addUserSearchQuery = "";
    let showAddMemberPanel = false;
    const availableUsersStore = writable<User[]>([]);

    function updateAvailable() {
        const pIds = new Set(participants_list.map(p => p.id));
        let avail = all_users.filter(u => !pIds.has(u.id));
        if (addUserSearchQuery.trim()) {
            const q = addUserSearchQuery.toLowerCase();
            avail = avail.filter(u => u.first_name.toLowerCase().includes(q) || u.last_name.toLowerCase().includes(q));
        }
        availableUsersStore.set(avail);
    }
    $: addUserSearchQuery, participants_list, updateAvailable();

    let showCapacityEdit = false;
    let capacityInput: number | string = slot.capacity;

    async function saveCapacity() {
        const val = typeof capacityInput === "string" ? parseInt(capacityInput, 10) : capacityInput;

        if (isNaN(val)) {
            toast.error("Entrez un nombre valide");
            return;
        }

        // Construction du payload complet pour valider le slotScheme du serveur
        const payload = {
            slot_id: slot.id,
            today: new Date(current_slot.starts_at).toISOString().split('T')[0],
            form: {
                title: current_slot.name,
                description: current_slot.description || "",
                capacity: val,
                slot_type: (current_slot as any).slot_type, // <--- LIGNE AJOUTÉE ICI
                date: {
                    starts_at: formatTimeUTC(current_slot.starts_at),
                    ends_at: formatTimeUTC(current_slot.ends_at)
                }
            }
        };

        try {
            const res = await fetch("/api/slots/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                toast.success("Capacité mise à jour");
                showCapacityEdit = false;
                await invalidateAll();
            } else {
                toast.error("Erreur de validation serveur");
            }
        } catch (e) {
            toast.error("Erreur réseau");
        }
    }
</script>

<Card class="w-full mb-4 overflow-hidden border shadow-sm">
    <div class="p-4 cursor-pointer hover:bg-muted/50 transition-colors" on:click={() => (isExpanded = !isExpanded)} role="button" tabindex="0">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <span class="font-bold text-lg">
                    {canManage ? '⚙️ ' : ''}"{current_slot.name}"
                    {#if canManage}
                        <span class="text-sm font-normal text-muted-foreground ml-2">({timeRange})</span>
                    {/if}
                </span>
                {#if slot_type === 'EVENEMENT'}<span class="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Évènement</span>{/if}
            </div>
            <span class="text-muted-foreground">{isExpanded ? '▼' : '▶'}</span>
        </div>
        <div class="text-sm text-muted-foreground italic">Encadré par {owner.first_name} {owner.last_name}</div>
    </div>

    {#if isExpanded}
        <CardContent class="pt-4 border-t space-y-4">
            {#if canManage}
                <div class="bg-muted/40 p-3 rounded-md space-y-3">
                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-2">
                            <span class="font-bold text-[10px] uppercase tracking-tighter text-muted-foreground">Outils de gestion</span>
                            {#if rootBypassManage}
                                <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                                    {adminBypassLabel}
                                </span>
                            {/if}
                        </div>
                        <div class="flex gap-2">
                            <div class="flex items-center gap-2">
                                <Button size="sm" variant="outline" on:click={() => showAddMemberPanel = !showAddMemberPanel}>
                                    {showAddMemberPanel ? 'Annuler' : 'Ajouter'}
                                </Button>
                                {#if rootBypassManage}
                                    <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                                        {adminBypassLabel}
                                    </span>
                                {/if}
                            </div>
                            <div class="flex items-center gap-2">
                                <Button size="sm" variant="outline" on:click={() => showCapacityEdit = !showCapacityEdit}>Jauge</Button>
                                {#if rootBypassManage}
                                    <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                                        {adminBypassLabel}
                                    </span>
                                {/if}
                            </div>
                        </div>
                    </div>

                    {#if showCapacityEdit}
                        <div class="flex gap-2 items-center bg-background p-2 rounded border shadow-sm">
                            <Input type="number" bind:value={capacityInput} class="w-20 h-8" />
                            <div class="flex items-center gap-2">
                                <Button size="sm" on:click={saveCapacity}>Enregistrer</Button>
                                {#if rootBypassManage}
                                    <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                                        {adminBypassLabel}
                                    </span>
                                {/if}
                            </div>
                        </div>
                    {/if}

                    {#if showAddMemberPanel}
                        <div class="space-y-2 bg-background p-2 rounded border shadow-sm">
                            <Input placeholder="Rechercher..." bind:value={addUserSearchQuery} class="h-8 text-sm" />
                            <div class="max-h-32 overflow-y-auto border rounded divide-y">
                                {#each $availableUsersStore as u}
                                    <button class="w-full text-left p-2 hover:bg-muted text-xs flex justify-between" on:click={() => handle_subscribe(u.id, slot.id)}>
                                        {u.first_name} {u.last_name} <span class="text-blue-600">+</span>
                                    </button>
                                {/each}
                            </div>
                        </div>
                    {/if}
                </div>

                <div class="space-y-2">
                    <div class="flex justify-between items-center">
                        <span class="text-xs font-semibold">Liste des membres</span>
                        <Input placeholder="Filtrer..." bind:value={searchQuery} class="max-w-[130px] h-7 text-[10px]" />
                    </div>

                    <div class="rounded-md border overflow-hidden bg-background">
                        <Table.Root {...$tableAttrs}>
                            <Table.Header class="bg-muted/50">
                                {#each $headerRows as headerRow}
                                    <Subscribe rowAttrs={headerRow.attrs()}><Table.Row>
                                        {#each headerRow.cells as cell (cell.id)}<Table.Head class="h-8 text-[10px] font-bold"><Render of={cell.render()}/></Table.Head>{/each}
                                    </Table.Row></Subscribe>
                                {/each}
                            </Table.Header>
                            <Table.Body {...$tableBodyAttrs}>
                                {#each $pageRows as row (row.id)}
                                    <Subscribe rowAttrs={row.attrs()} let:rowAttrs><Table.Row {...rowAttrs}>
                                        {#each row.cells as cell (cell.id)}<Table.Cell class="py-1.5 text-xs"><Render of={cell.render()}/></Table.Cell>{/each}
                                    </Table.Row></Subscribe>
                                {/each}
                            </Table.Body>
                        </Table.Root>
                    </div>

                    <div class="flex items-center justify-between py-2 border-t px-1">
                        <span class="text-[10px] text-muted-foreground italic">Page {$pageIndex + 1} / {$pageCount}</span>
                        <div class="flex gap-2">
                            <Button variant="outline" size="sm" class="h-7 text-[10px]" on:click={() => $pageIndex--} disabled={!$hasPreviousPage}>Précédent</Button>
                            <Button variant="outline" size="sm" class="h-7 text-[10px]" on:click={() => $pageIndex++} disabled={!$hasNextPage}>Suivant</Button>
                        </div>
                    </div>
                </div>
            {:else}
                <div class="space-y-3">
                    <div class="flex items-center gap-2 text-primary font-semibold text-sm">
                        <span class="px-2 py-1 bg-primary/10 rounded-md">🕒 {timeRange}</span>
                    </div>
                    <p class="text-sm leading-relaxed">{current_slot.description || "Aucune description fournie."}</p>
                </div>
            {/if}
        </CardContent>

        <CardFooter class="border-t p-3 flex justify-between items-center bg-muted/5">
            <div class="text-[11px] font-bold uppercase tracking-tight">
                {participants_count} inscrit{participants_count > 1 ? 's' : ''} sur {current_slot.capacity} places
            </div>
            <Button
                variant={subscribed ? "destructive" : "default"}
                disabled={isBlocked && !user.root}
                on:click={() => handle_subscribe(user.id, slot.id)}>
                {#if isBlocked}Fermé{:else if subscribed}Se désinscrire{:else}S'inscrire{/if}
            </Button>
            {#if isBlocked && user.root}
                <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                    {adminBypassLabel}
                </span>
            {/if}
        </CardFooter>
    {/if}
</Card>
