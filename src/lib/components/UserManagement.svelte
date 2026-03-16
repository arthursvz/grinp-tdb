<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import Ellipsis from "lucide-svelte/icons/ellipsis";
    import * as DropdownMenu from "./ui/dropdown-menu";
    import UserStatsDialog from "./UserStatsDialog.svelte";
    
    // Imports pour la mise à jour sans rechargement
    import { invalidateAll } from "$app/navigation";
    import { toast } from "svelte-sonner";

    export let id: string;

    // Fonction générique pour gérer les appels API sans recharger la page
    async function handleAction(url: string, body: object, successMsg: string) {
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                toast.success(successMsg);
                // C'est ici que la magie opère : on rafraîchit les données de la page 
                // sans faire de flash blanc/rechargement complet
                await invalidateAll(); 
            } else {
                toast.error("Une erreur est survenue côté serveur.");
            }
        } catch (e) {
            toast.error("Erreur de connexion.");
        }
    }

    async function promote_instructor(user_id: string) {
        if (!confirm("Êtes-vous sûr de vouloir basculer le statut instructeur de ce membre ?")) return;
        await handleAction(`/api/users/promote_instructor`, { user_id }, "Statut instructeur mis à jour !");
    }

    async function delete_user(user_id: string) {
        if (!confirm("Supprimer définitivement cet utilisateur ?")) return;
        await handleAction(`/api/users/delete`, { user_id }, "Utilisateur supprimé !");
    }

    async function toggle_cotisant_as(user_id: string) {
        await handleAction(`/api/users/toggle_cotisant_as`, { user_id }, "Cotisation AS mise à jour !");
    }

    async function toggle_cotisant_grinp(user_id: string) {
        await handleAction(`/api/users/toggle_cotisant_grinp`, { user_id }, "Cotisation Gr'INP mise à jour !");
    }

    async function toggle_admin(user_id: string) {
        if (!confirm("Êtes-vous sûr de vouloir basculer le statut administrateur de ce membre ?")) return;
        await handleAction(`/api/users/toggle_admin`, { user_id }, "Statut administrateur mis à jour !");
    }

    function copyId() {
        navigator.clipboard.writeText(id);
        toast.info("ID copié dans le presse-papier");
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

    <DropdownMenu.Content align="end">
        <DropdownMenu.Group>
            <DropdownMenu.Label>Actions</DropdownMenu.Label>
            <DropdownMenu.Item on:click={copyId}>
                Copier l'identifiant
            </DropdownMenu.Item>
        </DropdownMenu.Group>

        <DropdownMenu.Separator />

        <DropdownMenu.Group>
            <DropdownMenu.Item on:click={() => promote_instructor(id)}>
                Modifier instructor
            </DropdownMenu.Item>

            <DropdownMenu.Item on:click={() => toggle_admin(id)}>
                Modifier root
            </DropdownMenu.Item>

            <DropdownMenu.Item on:click={() => toggle_cotisant_as(id)}>
                Modifier cotisant AS
            </DropdownMenu.Item>

            <DropdownMenu.Item on:click={() => toggle_cotisant_grinp(id)}>
                Modifier cotisant Gr'INP
            </DropdownMenu.Item>

            <DropdownMenu.Separator />

            <DropdownMenu.Item on:click={() => delete_user(id)} class="text-red-600">
                Supprimer l'utilisateur
            </DropdownMenu.Item>
        </DropdownMenu.Group>
    </DropdownMenu.Content>
</DropdownMenu.Root>

<UserStatsDialog user_id={id} />
