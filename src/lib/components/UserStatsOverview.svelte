<script lang="ts">
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { onMount } from "svelte";

    export let user_id: string;

    let stats: any = null;
    let loading = true;
    let error = "";

    onMount(async () => {
        if (!user_id) {
            error = "ID utilisateur manquant";
            loading = false;
            return;
        }

        try {
            const res = await fetch("/api/users/stats", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id }),
            });

            if (!res.ok) {
                error = "Impossible de charger vos statistiques";
                return;
            }

            stats = await res.json();
        } catch (err) {
            error = "Erreur lors du chargement des données";
            console.error(err);
        } finally {
            loading = false;
        }
    });

    function formatDuration(minutes: number): string {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    }
</script>

<div class="w-full">
    {#if loading}
        <Card>
            <CardContent class="flex items-center justify-center py-8">
                <div class="text-sm text-muted-foreground">Chargement de vos statistiques...</div>
            </CardContent>
        </Card>
    {:else if error}
        <Card>
            <CardContent class="flex items-center justify-center py-8">
                <div class="text-sm text-red-500">{error}</div>
            </CardContent>
        </Card>
    {:else if stats}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <!-- Inscriptions -->
            <Card>
                <CardHeader class="pb-3">
                    <CardTitle class="text-sm font-medium">Inscriptions totales</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="text-2xl font-bold">{stats.stats.totalSlotSubscriptions}</div>
                    <p class="text-xs text-muted-foreground mt-1">créneaux</p>
                </CardContent>
            </Card>

            <!-- Présences -->
            <Card>
                <CardHeader class="pb-3">
                    <CardTitle class="text-sm font-medium">Présences</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="text-2xl font-bold">{stats.stats.totalAttendances}</div>
                    <p class="text-xs text-muted-foreground mt-1">fois présent</p>
                </CardContent>
            </Card>

            <!-- Durée de grimpe -->
            <Card>
                <CardHeader class="pb-3">
                    <CardTitle class="text-sm font-medium">Durée de grimpe</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="text-2xl font-bold">{formatDuration(stats.stats.totalClimbingDuration)}</div>
                    <p class="text-xs text-muted-foreground mt-1">total</p>
                </CardContent>
            </Card>

            <!-- Créneaux ouverts (si initiateur) -->
            {#if stats.stats.slotsOpened > 0}
                <Card>
                    <CardHeader class="pb-3">
                        <CardTitle class="text-sm font-medium">Créneaux ouverts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="text-2xl font-bold">{stats.stats.slotsOpened}</div>
                        <p class="text-xs text-muted-foreground mt-1">en tant qu'initiateur</p>
                    </CardContent>
                </Card>

                <!-- Durée d'ouverture -->
                <Card>
                    <CardHeader class="pb-3">
                        <CardTitle class="text-sm font-medium">Durée d'ouverture</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="text-2xl font-bold">{formatDuration(stats.stats.totalOpenedDuration)}</div>
                        <p class="text-xs text-muted-foreground mt-1">total</p>
                    </CardContent>
                </Card>

                <!-- Participants accueillis -->
                <Card>
                    <CardHeader class="pb-3">
                        <CardTitle class="text-sm font-medium">Participants accueillis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="text-2xl font-bold">{stats.stats.totalParticipantsInOpenedSlots}</div>
                        <p class="text-xs text-muted-foreground mt-1">total</p>
                    </CardContent>
                </Card>
            {/if}
        </div>
    {/if}
</div>
