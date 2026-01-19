<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import Ellipsis from "lucide-svelte/icons/ellipsis";
    import * as DropdownMenu from "./ui/dropdown-menu";

    export let id: string;

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
        </DropdownMenu.Group>

    </DropdownMenu.Content>
</DropdownMenu.Root>