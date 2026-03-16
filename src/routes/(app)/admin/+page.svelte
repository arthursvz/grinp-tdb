<script lang="ts">
    import {
      Card,
      CardDescription,
      CardHeader,
      CardTitle,
      CardContent
    } from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    
    // On utilise bien $lib
    import SlotTable from "$lib/components/SlotTable.svelte";
    import UserTable from "$lib/components/UserTable.svelte";
    import { slots, users } from "$lib/stores";
    
    import type { Slot, User } from "@prisma/client";

    export let data: {
        users: User[];
        slots: Slot[];
        stats: {
            betasCount: number;
            totalMembers: number;
        };
    };

    // On remplit les Stores avec les données du serveur
    $: {
        users.set(data.users);
        slots.set(data.slots);
    }

    // --- FONCTIONS DE MAINTENANCE ---
    async function resetCotisantAS() {
        if (!confirm("Réinitialiser TOUTES les cotisations AS ?")) return;
        const res = await fetch(`/api/admin/reset_cotisant_as`, { method: "POST" });
        if (res.ok) window.location.reload();
    }

    async function resetCotisantGrinp() {
        if (!confirm("Réinitialiser TOUTES les cotisations Gr'INP ?")) return;
        const res = await fetch(`/api/admin/reset_cotisant_grinp`, { method: "POST" });
        if (res.ok) window.location.reload();
    }

    async function downloadDatabase() {
        const res = await fetch(`/api/admin/download_database`, { method: "GET" });
        if (res.ok) {
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `grinp_backup_${new Date().toISOString().split('T')[0]}.sql`;
            a.click();
        }
    }

    // --- ALERTE GLOBALE ---
    async function toggleGlobalAlert() {
        const msg = prompt("Message d'alerte global (laisser vide pour désactiver) :");
        if (msg === null) return; 

        const res = await fetch(`/api/admin/alert`, {
            method: "POST",
            body: JSON.stringify({ message: msg, active: msg.length > 0 })
        });

        if (res.ok) window.location.reload();
    }
</script>

<div class="max-w-7xl mx-auto py-10 px-4 space-y-10">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-8">
        <div>
            <h1 class="text-4xl font-black italic uppercase tracking-tighter">Console Gr'INP</h1>
            <p class="text-muted-foreground">Outils de gestion du Président.</p>
        </div>
        <div class="flex flex-wrap gap-2">
            <Button on:click={downloadDatabase} variant="outline">📥 Backup SQL</Button>
            <Button on:click={toggleGlobalAlert} variant="destructive" class="font-bold shadow-md border-2 border-red-200">
                📢 Gérer l'Alerte Site
            </Button>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <a href="/admin/betas" class="block group">
            <Card class="h-full hover:border-primary transition-all cursor-pointer group-hover:shadow-lg">
                <CardHeader class="pb-2">
                    <CardTitle class="text-lg flex items-center gap-2 group-hover:text-primary transition-colors">💡 Bétas du jour</CardTitle>
                    <CardDescription>Messages d'accueil</CardDescription>
                </CardHeader>
                <CardContent>
                    <div class="text-3xl font-black">{data.stats?.betasCount || 0}</div>
                    <p class="text-xs text-muted-foreground uppercase tracking-widest mt-1">Phrases en rotation</p>
                </CardContent>
            </Card>
        </a>

        <Card>
            <CardHeader class="pb-2">
                <CardTitle class="text-lg flex items-center gap-2">👥 Communauté</CardTitle>
                <CardDescription>État des effectifs</CardDescription>
            </CardHeader>
            <CardContent>
                <div class="text-3xl font-black">{data.stats?.totalMembers || 0}</div>
                <p class="text-xs text-muted-foreground uppercase tracking-widest mt-1">Grimpeurs inscrits</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader class="pb-2">
                <CardTitle class="text-lg flex items-center gap-2">🛠️ Maintenance</CardTitle>
                <CardDescription>Réinitialisations saisonnières</CardDescription>
            </CardHeader>
            <CardContent class="flex flex-wrap gap-2">
                <Button on:click={resetCotisantAS} variant="secondary" size="sm" class="flex-1">Reset AS</Button>
                <Button on:click={resetCotisantGrinp} variant="secondary" size="sm" class="flex-1">Reset Club</Button>
            </CardContent>
        </Card>
    </div>

    <div class="space-y-6">
        <details class="group bg-card border rounded-xl overflow-hidden">
            <summary class="list-none p-6 cursor-pointer flex justify-between items-center hover:bg-muted/50 transition-colors">
                <h2 class="text-xl font-bold tracking-tight flex items-center gap-3">
                    📅 Gestion des Créneaux
                </h2>
                <span class="text-muted-foreground transition-transform group-open:rotate-180">▼</span>
            </summary>
            <div class="p-6 border-t bg-background/50">
                <SlotTable {slots} {users} />
            </div>
        </details>

        <details class="group bg-card border rounded-xl overflow-hidden">
            <summary class="list-none p-6 cursor-pointer flex justify-between items-center hover:bg-muted/50 transition-colors">
                <h2 class="text-xl font-bold tracking-tight flex items-center gap-3">
                    👥 Annuaire des Membres
                </h2>
                <span class="text-muted-foreground transition-transform group-open:rotate-180">▼</span>
            </summary>
            <div class="p-6 border-t bg-background/50">
                <UserTable {users} />
            </div>
        </details>
    </div>
</div>

<style>
    summary::-webkit-details-marker { display: none; }
</style>
