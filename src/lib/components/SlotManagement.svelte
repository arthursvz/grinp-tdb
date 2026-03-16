<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { invalidateAll } from "$app/navigation";
    import { toast } from "svelte-sonner";
    import type { User } from "@prisma/client";

    export let id: string;
    export let users: User[] = [];
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

    let showDialog = false;
    let editMode = false;
    let loading = false;
    let name = "";
    let description = "";
    let capacity: number | string | undefined = undefined;
    let slot_type: string = "CRENEAU";
    let starts_at: string = ""; 
    let ends_at: string = "";   
    let originalStartsAt: Date | null = null;
    let ownerId = "";
    let responsiblesIds: string[] = [];
    let ownerQuery = "";
    let responsiblesQuery = "";
    let ownerUser: User | null = null;
    let responsibles: User[] = [];
    let attendees: User[] = [];
    let participants: User[] = [];

    const slotTypeOptions = [
        { value: "CRENEAU", label: "Créneau" },
        { value: "EVENEMENT", label: "Évènement" },
        { value: "FERMETURE", label: "Fermeture" }
    ];

    const adminBypassLabel = "Admin bypass";
    const showEditBypassBadge =
        rootBypassEditDetails || rootBypassEditCapacity || rootBypassEditResponsibles || rootBypassEditType;
    const showDeleteBypassBadge = rootBypassDelete;

    const fieldIds = {
        name: `slot-name-${id}`,
        description: `slot-description-${id}`,
        capacity: `slot-capacity-${id}`,
        starts: `slot-start-${id}`,
        ends: `slot-end-${id}`,
        slotType: `slot-type-${id}`
    };

    async function delete_slot(slot_id: string) {
        if (!confirm("Supprimer définitivement ce créneau ?")) return;
        try {
            const res = await fetch(`/api/slots/delete`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slot_id }),
            });
            if (res.ok) {
                toast.success("Créneau supprimé");
                await invalidateAll();
            }
        } catch (e) {
            toast.error("Erreur réseau");
        }
    }

    const formatUserName = (user: User) => `${user.first_name} ${user.last_name}`;
    const formatUserList = (list: User[]) => (list?.length ? list.map(formatUserName).join(", ") : "-");
    const matchUser = (user: User, query: string) =>
        `${user.first_name} ${user.last_name} ${user.email ?? ""}`.toLowerCase().includes(query.toLowerCase());

    $: ownerResults = ownerQuery.trim()
        ? users.filter((user) => matchUser(user, ownerQuery)).slice(0, 8)
        : [];
    $: responsiblesResults = responsiblesQuery.trim()
        ? users
              .filter((user) => matchUser(user, responsiblesQuery))
              .filter((user) => !responsiblesIds.includes(user.id))
              .slice(0, 8)
        : [];
    $: selectedOwner = ownerId ? users.find((user) => user.id === ownerId) ?? null : null;
    $: selectedResponsibles = responsiblesIds
        .map((id) => users.find((user) => user.id === id))
        .filter(Boolean) as User[];

    async function open_dialog(slot_id: string, mode: "view" | "edit") {
        loading = true;
        try {
            const res = await fetch(`/api/slots/get`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slot_id })
            });
            if (res.status === 200) {
                const data = await res.json();
                const slot = data.slot;
                name = slot.name || "";
                description = slot.description || "";
                capacity = slot.capacity ?? "";
                slot_type = slot.slot_type || "CRENEAU";
                ownerUser = slot.owner ?? null;
                responsibles = slot.responsibles ?? [];
                attendees = slot.attendees ?? [];
                participants = slot.participants ?? [];
                ownerId = slot.owner?.id ?? "";
                responsiblesIds = responsibles.map((u) => u.id);
                ownerQuery = "";
                responsiblesQuery = "";
                
                if (slot.starts_at) {
                    originalStartsAt = new Date(slot.starts_at);
                    starts_at = originalStartsAt.toISOString().slice(11, 16);
                }
                if (slot.ends_at) {
                    const originalEndsAt = new Date(slot.ends_at);
                    ends_at = originalEndsAt.toISOString().slice(11, 16);
                }
                editMode = mode === "edit";
                showDialog = true;
            }
        } finally {
            loading = false;
        }
    }

    async function save_edit(slot_id: string) {
        if (!starts_at || !ends_at) return toast.error("Horaires manquants");
        loading = true;
        const todayStr = originalStartsAt ? originalStartsAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

        const payload = {
            slot_id: slot_id,
            today: todayStr,
            form: {
                title: name,
                description: description || "",
                capacity: typeof capacity === "string" ? parseInt(capacity, 10) : capacity,
                slot_type: slot_type, // Inclus dans le form pour Zod
                date: { starts_at, ends_at }
            }
        };

        try {
            const res = await fetch(`/api/slots/update`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                toast.success("Mis à jour avec succès");
            } else {
                toast.error("Erreur de validation");
            }
        } finally {
            loading = false;
        }
    }

    async function save_relations(slot_id: string) {
        if (!canEditResponsibles) return;
        const payload = {
            slot_id,
            owner_id: ownerId || null,
            responsibles_ids: responsiblesIds,
        };

        try {
            const res = await fetch(`/api/slots/update_relations`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                toast.error("Erreur de mise à jour des relations");
            }
        } catch (e) {
            toast.error("Erreur réseau");
        }
    }

    async function save_all(slot_id: string) {
        if (canEditDetails || canEditCapacity || canEditType) {
            await save_edit(slot_id);
        }
        if (canEditResponsibles) {
            await save_relations(slot_id);
        }
        showDialog = false;
        await invalidateAll();
    }
</script>

<div class="flex items-center gap-2">
    <Button type="button" variant="secondary" size="sm" on:click={() => open_dialog(id, "view")}>Voir</Button>
    {#if canWrite || canEditDetails || canEditCapacity || canEditResponsibles || canEditType}
        <div class="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" on:click={() => open_dialog(id, "edit")}>Modifier</Button>
            {#if showEditBypassBadge}
                <div class="inline-flex w-fit items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                    {adminBypassLabel}
                </div>
            {/if}
        </div>
    {/if}
</div>

{#if showDialog}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" on:click={() => (showDialog = false)}>
        <div class="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-background border shadow-lg" on:click|stopPropagation>
            <div class="flex items-center justify-between border-b px-6 py-4">
                <div>
                    <h3 class="text-lg font-bold">Créneau</h3>
                    <p class="text-xs text-muted-foreground">{name || "-"}</p>
                </div>
                <div class="flex items-center gap-2">
                    {#if canWrite || canEditDetails || canEditCapacity || canEditResponsibles || canEditType}
                        <div class="flex items-center gap-2">
                            <Button type="button" variant="ghost" size="sm" on:click={() => (editMode = !editMode)}>Modifier</Button>
                            {#if showEditBypassBadge}
                                <div class="inline-flex w-fit items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                                    {adminBypassLabel}
                                </div>
                            {/if}
                        </div>
                        {#if canDelete}
                            <div class="flex items-center gap-2">
                                <Button type="button" variant="destructive" size="sm" on:click={() => delete_slot(id)}>Supprimer</Button>
                                {#if showDeleteBypassBadge}
                                    <div class="inline-flex w-fit items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                                        {adminBypassLabel}
                                    </div>
                                {/if}
                            </div>
                        {/if}
                    {/if}
                    <Button type="button" variant="ghost" on:click={() => (showDialog = false)}>Fermer</Button>
                </div>
            </div>

            <div class="space-y-4 px-6 py-4">
                <div class="grid gap-3 md:grid-cols-2 text-sm">
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Créateur</p>
                        <p>{ownerUser ? formatUserName(ownerUser) : "-"}</p>
                    </div>
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Responsables</p>
                        <p>{formatUserList(responsibles)}</p>
                    </div>
                </div>
                <div class="grid gap-3 md:grid-cols-2 text-sm">
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Inscrits</p>
                        <p>{formatUserList(participants)}</p>
                    </div>
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Présents</p>
                        <p>{formatUserList(attendees)}</p>
                    </div>
                </div>

                <div class="grid gap-3 md:grid-cols-2">
                    <Input type="text" placeholder="Nom" bind:value={name} disabled={!editMode || !canEditDetails} />
                    <Input type="number" min="1" placeholder="Jauge" bind:value={capacity} disabled={!editMode || !canEditCapacity} />
                    <Input type="time" bind:value={starts_at} disabled={!editMode || !canEditDetails} />
                    <Input type="time" bind:value={ends_at} disabled={!editMode || !canEditDetails} />
                    <div>
                        <select bind:value={slot_type} class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" disabled={!editMode || !canEditType}>
                            {#each slotTypeOptions as option}
                                <option value={option.value}>{option.label}</option>
                            {/each}
                        </select>
                    </div>
                </div>
                <Input type="text" placeholder="Description" bind:value={description} disabled={!editMode || !canEditDetails} />

                {#if (canEditDetails || canEditCapacity || canEditType || canEditResponsibles) && editMode}
                    <div class="grid gap-4 md:grid-cols-2">
                        <div class="space-y-2">
                            <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Créateur</p>
                            <Input type="text" placeholder="Rechercher un créateur" bind:value={ownerQuery} disabled={!canEditResponsibles} />
                            {#if ownerQuery.trim() && canEditResponsibles}
                                <div class="rounded-md border p-2 text-sm space-y-1">
                                    {#each ownerResults as user}
                                        <button
                                            type="button"
                                            class="w-full text-left hover:bg-muted/60 rounded px-2 py-1"
                                            on:click={() => (ownerId = user.id)}
                                        >
                                            {formatUserName(user)}
                                        </button>
                                    {/each}
                                    {#if ownerResults.length === 0}
                                        <p class="text-xs text-muted-foreground">Aucun resultat</p>
                                    {/if}
                                </div>
                            {/if}
                            <p class="text-xs text-muted-foreground">Selectionne: {selectedOwner ? formatUserName(selectedOwner) : "-"}</p>
                        </div>
                        <div class="space-y-2">
                            <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Responsables</p>
                            <Input type="text" placeholder="Rechercher un responsable" bind:value={responsiblesQuery} disabled={!canEditResponsibles} />
                            {#if responsiblesQuery.trim() && canEditResponsibles}
                                <div class="rounded-md border p-2 text-sm space-y-1">
                                    {#each responsiblesResults as user}
                                        <button
                                            type="button"
                                            class="w-full text-left hover:bg-muted/60 rounded px-2 py-1"
                                            on:click={() => {
                                                responsiblesIds = [...responsiblesIds, user.id];
                                            }}
                                        >
                                            {formatUserName(user)}
                                        </button>
                                    {/each}
                                    {#if responsiblesResults.length === 0}
                                        <p class="text-xs text-muted-foreground">Aucun resultat</p>
                                    {/if}
                                </div>
                            {/if}
                            <div class="flex flex-wrap gap-2">
                                {#each selectedResponsibles as user}
                                    <span class="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs">
                                        {formatUserName(user)}
                                        <button
                                            type="button"
                                            class="text-muted-foreground hover:text-foreground"
                                            on:click={() => (responsiblesIds = responsiblesIds.filter((id) => id !== user.id))}
                                        >
                                            x
                                        </button>
                                    </span>
                                {/each}
                                {#if selectedResponsibles.length === 0}
                                    <span class="text-xs text-muted-foreground">Aucun responsable</span>
                                {/if}
                            </div>
                        </div>
                    </div>
                {/if}

                <div class="flex gap-2 justify-end pt-2 border-t">
                    <Button variant="outline" size="sm" on:click={() => (showDialog = false)}>Annuler</Button>
                    {#if (canEditDetails || canEditCapacity || canEditType || canEditResponsibles) && editMode}
                        <div class="flex items-center gap-2">
                            <Button size="sm" disabled={loading} on:click={() => save_all(id)}>Enregistrer</Button>
                            {#if showEditBypassBadge}
                                <div class="inline-flex w-fit items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                                    {adminBypassLabel}
                                </div>
                            {/if}
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
{/if}
