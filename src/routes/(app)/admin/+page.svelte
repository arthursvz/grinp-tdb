<script lang="ts">
    import {
      Card,
      CardDescription,
      CardHeader,
      CardTitle
    } from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import SlotTable from "@/components/SlotTable.svelte";
    import UserTable from "@/components/UserTable.svelte";
    import { slots, users } from "@/stores";
    import type { Slot, User } from "@prisma/client";

    export let data: {
        users: User[];
        slots: Slot[];
    };

    $: {
        users.set(data.users);
        slots.set(data.slots);
    }

    async function resetCotisantAS() {
        if (!confirm("Êtes-vous sûr de vouloir réinitialiser TOUTES les cotisations AS ?")) return;
        const res = await fetch(`/api/admin/reset_cotisant_as`, { method: "POST" });
        if (res.ok) {
            alert("Cotisations AS réinitialisées");
            window.location.reload();
        } else {
            alert("Erreur lors de la réinitialisation");
        }
    }

    async function resetCotisantGrinp() {
        if (!confirm("Êtes-vous sûr de vouloir réinitialiser TOUTES les cotisations Gr'INP ?")) return;
        const res = await fetch(`/api/admin/reset_cotisant_grinp`, { method: "POST" });
        if (res.ok) {
            alert("Cotisations Gr'INP réinitialisées");
            window.location.reload();
        } else {
            alert("Erreur lors de la réinitialisation");
        }
    }

    async function resetDatabase() {
        if (!confirm("⚠️ ATTENTION: Cela va SUPPRIMER TOUTES les données de la base ! Êtes-vous absolument sûr ?")) return;
        if (!confirm("DERNIÈRE CONFIRMATION: Cette action est irréversible !")) return;
        
        const res = await fetch(`/api/admin/reset_database`, { method: "POST" });
        if (res.ok) {
            alert("Base de données réinitialisée");
            window.location.reload();
        } else {
            alert("Erreur lors de la réinitialisation");
        }
    }

    async function downloadDatabase() {
        const res = await fetch(`/api/admin/download_database`, { method: "GET" });
        if (res.ok) {
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `grinp_backup_${new Date().toISOString().split('T')[0]}.sql`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } else {
            alert("Erreur lors du téléchargement de la base");
        }
    }
</script>

<Card class="m-auto w-full min-h-[calc(100vh-4rem)]">
    <CardHeader>
        <CardTitle>Admin</CardTitle>
        <CardDescription>Pannel admin du site</CardDescription>
        
        <div class="flex flex-wrap gap-2 pt-4">
            <Button on:click={resetCotisantAS} variant="outline">
                Réinitialiser cotisations AS
            </Button>
            <Button on:click={resetCotisantGrinp} variant="outline">
                Réinitialiser cotisations Gr'INP
            </Button>
            <Button on:click={downloadDatabase} variant="outline">
                Télécharger la base
            </Button>
            <Button on:click={resetDatabase} variant="destructive">
                Réinitialiser la base complète
            </Button>
        </div>
    </CardHeader>

    <div class="relative">
        <div class="absolute inset-0 flex items-center">
            <span class="m-4 w-full border-t" />
        </div>
    </div>

    <UserTable {users} />

    <div class="relative">
        <div class="absolute inset-0 flex items-center">
            <span class="m-4 w-full border-t" />
        </div>
    </div>

    <SlotTable {slots} {users} />
</Card>