<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import Ellipsis from "lucide-svelte/icons/ellipsis";
    import * as DropdownMenu from "./ui/dropdown-menu";

    export let id: string;

    let showEdit = false;
    let loading = false;
    let name = "";
    let description = "";
    let capacity: number | string | undefined = undefined;
    let slot_type: string = "CRENEAU";
    let starts_at: string | undefined = undefined; // HH:MM
    let ends_at: string | undefined = undefined;   // HH:MM
    let originalStartsAt: Date | null = null;
    let originalEndsAt: Date | null = null;

    const slotTypeOptions = [
        { value: "CRENEAU", label: "Créneau" },
        { value: "EVENEMENT", label: "Évènement" },
        { value: "FERMETURE", label: "Fermeture" }
    ];

    const fieldIds = {
        name: `slot-name-${id}`,
        description: `slot-description-${id}`,
        capacity: `slot-capacity-${id}`,
        starts: `slot-start-${id}`,
        ends: `slot-end-${id}`,
        slotType: `slot-type-${id}`
    };

    async function delete_slot(slot_id: string) {
        // Call the API to mark the user as present
        // API is /api/slots/delete
        const check_attendance = await fetch(`/api/slots/delete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ slot_id }),
        });
    }

    async function open_edit(slot_id: string) {
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
                capacity = slot.capacity ?? undefined;
                slot_type = slot.slot_type || "CRENEAU";
                // Keep originals to rebuild ISO dates from HH:MM inputs
                try {
                    originalStartsAt = slot.starts_at ? new Date(slot.starts_at) : null;
                    originalEndsAt = slot.ends_at ? new Date(slot.ends_at) : null;
                    starts_at = originalStartsAt ? new Date(originalStartsAt).toISOString().slice(11,16) : undefined;
                    ends_at = originalEndsAt ? new Date(originalEndsAt).toISOString().slice(11,16) : undefined;
                } catch {}
                showEdit = true;
            }
        } catch (e) {
            console.error(e);
        } finally {
            loading = false;
        }
    }

    async function save_edit(slot_id: string) {
        loading = true;
        try {
            const res = await fetch(`/api/slots/update`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify((() => {
                    const payload: any = { slot_id };
                    if (typeof name === "string") payload.name = name;
                    if (typeof description === "string") payload.description = description;
                    if (capacity !== undefined && capacity !== null && capacity !== "") {
                        const numCap = typeof capacity === "string" ? parseInt(capacity, 10) : capacity;
                        if (!Number.isNaN(numCap)) payload.capacity = numCap;
                    }

                    function buildISOFromTime(base: Date | null, time?: string): string | undefined {
                        if (!time) return undefined;
                        const parts = time.split(":");
                        if (parts.length !== 2) return undefined;
                        const h = parseInt(parts[0], 10);
                        const m = parseInt(parts[1], 10);
                        const d = base ? new Date(base) : new Date();
                        if (!Number.isFinite(h) || !Number.isFinite(m)) return undefined;
                        d.setHours(h, m, 0, 0);
                        return d.toISOString();
                    }

                    const startsISO = buildISOFromTime(originalStartsAt, starts_at);
                    const endsISO = buildISOFromTime(originalEndsAt, ends_at);
                    if (startsISO) payload.starts_at = startsISO;
                    if (endsISO) payload.ends_at = endsISO;
                    if (slot_type && slotTypeOptions.some((o) => o.value === slot_type)) {
                        payload.slot_type = slot_type;
                    }

                    return payload;
                })())
            });
            if (res.status === 200) {
                // Reload to reflect changes in table
                window.location.reload();
            }
        } catch (e) {
            console.error(e);
        } finally {
            loading = false;
        }
    }
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger asChild let:builder>
        <Button
            variant="ghost"
            builders={[builder]}
            size="icon"
            class="relative h-8 w-8 p-0"
        >
            <span class="sr-only">Open menu</span>
            <Ellipsis class="h-4 w-4" />
        </Button>
    </DropdownMenu.Trigger>

    <DropdownMenu.Content>
        <DropdownMenu.Group>
            <DropdownMenu.Label>Actions</DropdownMenu.Label>
            <!--Copy the user UID to the clipboard-->
            <DropdownMenu.Item on:click={() => navigator.clipboard.writeText(id)}>
            Copier l'identifiant
            </DropdownMenu.Item>
        </DropdownMenu.Group>

        <DropdownMenu.Separator />

        <DropdownMenu.Group>
            <!--Delete the slot-->
            <DropdownMenu.Item on:click={() => delete_slot(id)}>
            Supprimer le créneau
            </DropdownMenu.Item>
            <DropdownMenu.Item on:click={() => open_edit(id)}>
            Modifier le créneau
            </DropdownMenu.Item>
        </DropdownMenu.Group>

    </DropdownMenu.Content>
</DropdownMenu.Root>

{#if showEdit}
<div class="mt-2 border rounded p-3 grid gap-2">
    <div class="grid gap-1">
        <label class="text-sm" for={fieldIds.name}>Nom</label>
        <Input id={fieldIds.name} type="text" bind:value={name} placeholder="Nom du créneau" />
    </div>
    <div class="grid gap-1">
        <label class="text-sm">Description</label>
        <Input type="text" bind:value={description} placeholder="Description" />
    </div>
    <div class="grid gap-1">
        <label class="text-sm">Jauge</label>
        <Input type="number" bind:value={capacity} placeholder="Capacité" />
    </div>
    <div class="grid gap-1">
        <label class="text-sm" for={fieldIds.slotType}>Type de créneau</label>
        <select id={fieldIds.slotType} bind:value={slot_type} class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            {#each slotTypeOptions as option}
                <option value={option.value}>{option.label}</option>
            {/each}
        </select>
    </div>
    <div class="grid gap-2 grid-cols-2">
        <div class="grid gap-1">
            <label class="text-sm">Début (HH:MM)</label>
            <Input type="time" bind:value={starts_at} />
        </div>
        <div class="grid gap-1">
            <label class="text-sm">Fin (HH:MM)</label>
            <Input type="time" bind:value={ends_at} />
        </div>
    </div>
    <div class="flex gap-2 justify-end pt-2">
        <Button variant="outline" on:click={() => { showEdit = false; }}>Annuler</Button>
        <Button disabled={loading} on:click={() => save_edit(id)}>Enregistrer</Button>
    </div>
</div>
{/if}