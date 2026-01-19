<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import Ellipsis from "lucide-svelte/icons/ellipsis";
    import * as DropdownMenu from "./ui/dropdown-menu";
    import UserStatsDialog from "./UserStatsDialog.svelte";

    export let id: string;

    async function promote_instructor(user_id: string) {
        if (!confirm("Êtes-vous sûr de vouloir basculer le statut instructeur de ce membre ?")) return;
        const res = await fetch(`/api/users/promote_instructor`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id }),
        });
        if (res.ok) location.reload();
    }

    async function delete_user(user_id: string) {
        // Call the API to mark the user as present
        // API is /api/users/delete
        const check_attendance = await fetch(`/api/users/delete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id }),
        });
    }

    async function toggle_cotisant_as(user_id: string) {
        const res = await fetch(`/api/users/toggle_cotisant_as`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id })
        });
        if (res.ok) location.reload();
    }

    async function toggle_cotisant_grinp(user_id: string) {
        const res = await fetch(`/api/users/toggle_cotisant_grinp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id })
        });
        if (res.ok) location.reload();
    }

    async function toggle_admin(user_id: string) {
        if (!confirm("Êtes-vous sûr de vouloir basculer le statut administrateur de ce membre ?")) return;
        const res = await fetch(`/api/users/toggle_admin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id })
        });
        if (res.ok) location.reload();
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
            <!--Remove the user from the slot-->
            <DropdownMenu.Item on:click={() => promote_instructor(id)}>
            Modifier instructor
            </DropdownMenu.Item>

            <!--Toggle admin-->
            <DropdownMenu.Item on:click={() => toggle_admin(id)}>
            Modifier root
            </DropdownMenu.Item>

            <!--Toggle cotisations-->
            <DropdownMenu.Item on:click={() => toggle_cotisant_as(id)}>
            Modifier cotisant AS
            </DropdownMenu.Item>
            <DropdownMenu.Item on:click={() => toggle_cotisant_grinp(id)}>
            Modifier cotisant Gr'INP
            </DropdownMenu.Item>

            <!--Mark the user as present-->
            <DropdownMenu.Item on:click={() => delete_user(id)}>
            Supprimer l'utilisateur
            </DropdownMenu.Item>
        </DropdownMenu.Group>

    </DropdownMenu.Content>
</DropdownMenu.Root>

<UserStatsDialog user_id={id} />