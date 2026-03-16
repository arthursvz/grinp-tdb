<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { attendees } from "$lib/stores";
    import Ellipsis from "lucide-svelte/icons/ellipsis";
    import * as DropdownMenu from "./ui/dropdown-menu";
    
    // Imports pour la mise à jour fluide
    import { invalidateAll } from "$app/navigation";
    import { toast } from "svelte-sonner";

    export let id: string;
    export let slot_id: string;
    export let unsubscribe_slot: (uid: string, sid: string) => Promise<void>;

    async function toggle_attendance(user_id: string, slot_id: string) {
        try {
            const res = await fetch(`/api/users/attendee`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id, slot_id }),
            });

            if (res.ok) {
                const response = await res.json();
                attendees.set(response.attendees);
                
                toast.success("Présence modifiée");
                // Rafraîchit les données du serveur sans recharger la page
                await invalidateAll();
            } else {
                toast.error("Erreur lors de la modification de présence");
            }
        } catch (error) {
            console.error("Error toggling attendance", error);
            toast.error("Erreur réseau");
        }
    }

    async function toggle_responsible(user_id: string, slot_id: string) {
        try {
            const res = await fetch(`/api/slots/toggle_responsible`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id, slot_id })
            });
            
            if (res.status === 200) {
                toast.success("Statut coresponsable mis à jour");
                await invalidateAll();
            } else {
                toast.error("Action non autorisée ou erreur");
            }
        } catch (error) {
            toast.error("Erreur réseau");
        }
    }

    // On enveloppe la fonction reçue en prop pour ajouter le toast et le refresh
    async function handleUnsubscribe() {
        try {
            await unsubscribe_slot(id, slot_id);
            toast.success("Membre retiré de la séance");
            await invalidateAll();
        } catch (error) {
            toast.error("Erreur lors du retrait");
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
    
    <DropdownMenu.Content align="end">
        <DropdownMenu.Group>
            <DropdownMenu.Label>Actions</DropdownMenu.Label>
            <DropdownMenu.Item on:click={() => {
                navigator.clipboard.writeText(id);
                toast.info("ID copié");
            }}>
                Copier l'identifiant
            </DropdownMenu.Item>
        </DropdownMenu.Group>

        <DropdownMenu.Separator />

        <DropdownMenu.Group>
            <DropdownMenu.Item on:click={handleUnsubscribe}>
                Retirer de la séance
            </DropdownMenu.Item>

            <DropdownMenu.Item on:click={() => toggle_attendance(id, slot_id)}>
                Modifier la présence
            </DropdownMenu.Item>

            <DropdownMenu.Item on:click={() => toggle_responsible(id, slot_id)}>
                Coresponsable
            </DropdownMenu.Item>
        </DropdownMenu.Group>
    </DropdownMenu.Content>
</DropdownMenu.Root>
