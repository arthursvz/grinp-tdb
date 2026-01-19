<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as Popover from "$lib/components/ui/popover";
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
    
    export let user_id: string;
    
    let open = false;
    let loading = false;
    let stats: any = null;
    let error: string = "";
    
    async function loadStats() {
        loading = true;
        error = "";
        try {
            const res = await fetch("/api/users/stats", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id })
            });
            
            if (!res.ok) {
                error = "Impossible de charger les statistiques";
                return;
            }
            
            stats = await res.json();
        } catch (err) {
            error = "Erreur lors du chargement des données";
            console.error(err);
        } finally {
            loading = false;
        }
    }
    
    function formatDuration(minutes: number): string {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    }
</script>

<Popover.Root bind:open onOpenChange={(newOpen) => {
    if (newOpen) loadStats();
}}>
    <Popover.Trigger asChild let:builder>
        <Button
            variant="ghost"
            builders={[builder]}
            size="icon"
            class="relative h-8 w-8 p-0 ml-2"
        >
            <span class="sr-only">View stats</span>
            📊
        </Button>
    </Popover.Trigger>
    
    <Popover.Content class="w-80">
        <div class="space-y-4">
            <div class="space-y-2">
                <h4 class="font-medium leading-none">Statistiques</h4>
                <p class="text-sm text-muted-foreground">
                    Informations d'activité du membre
                </p>
            </div>
            
            {#if loading}
                <div class="flex items-center justify-center py-8">
                    <div class="text-sm text-muted-foreground">Chargement...</div>
                </div>
            {:else if error}
                <div class="text-sm text-red-500">{error}</div>
            {:else if stats}
                <div class="space-y-3 text-sm">
                    <!-- Membre info -->
                    <div class="border-b pb-3">
                        <div class="font-semibold">{stats.user.first_name} {stats.user.last_name}</div>
                        <div class="text-xs text-muted-foreground break-all">{stats.user.email}</div>
                        {#if stats.user.instructor || stats.user.root || stats.user.cotisant_as || stats.user.cotisant_grinp}
                            <div class="flex gap-1 flex-wrap mt-2">
                                {#if stats.user.instructor}
                                    <span class="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">Instructeur</span>
                                {/if}
                                {#if stats.user.root}
                                    <span class="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded">Admin</span>
                                {/if}
                                {#if stats.user.cotisant_as}
                                    <span class="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">AS</span>
                                {/if}
                                {#if stats.user.cotisant_grinp}
                                    <span class="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">Gr'INP</span>
                                {/if}
                            </div>
                        {/if}
                    </div>
                    
                    <!-- Stats participation -->
                    <div class="border-b pb-3">
                        <div class="font-semibold mb-2">Participation aux créneaux</div>
                        <div class="grid grid-cols-2 gap-2">
                            <div>
                                <div class="text-lg font-bold">{stats.stats.totalSlotSubscriptions}</div>
                                <div class="text-xs text-muted-foreground">Inscriptions</div>
                            </div>
                            <div>
                                <div class="text-lg font-bold">{stats.stats.totalAttendances}</div>
                                <div class="text-xs text-muted-foreground">Présences</div>
                            </div>
                        </div>
                        <div class="mt-2">
                            <div class="text-base font-semibold">{formatDuration(stats.stats.totalClimbingDuration)}</div>
                            <div class="text-xs text-muted-foreground">Durée de grimpe</div>
                        </div>
                    </div>
                    
                    <!-- Stats initiateur -->
                    <div>
                        <div class="font-semibold mb-2">Créneaux ouverts (initiateur)</div>
                        <div class="grid grid-cols-2 gap-2">
                            <div>
                                <div class="text-lg font-bold">{stats.stats.slotsOpened}</div>
                                <div class="text-xs text-muted-foreground">Créneaux</div>
                            </div>
                            <div>
                                <div class="text-lg font-bold">{stats.stats.totalParticipantsInOpenedSlots}</div>
                                <div class="text-xs text-muted-foreground">Participants</div>
                            </div>
                        </div>
                        <div class="mt-2">
                            <div class="text-base font-semibold">{formatDuration(stats.stats.totalOpenedDuration)}</div>
                            <div class="text-xs text-muted-foreground">Durée d'ouverture</div>
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    </Popover.Content>
</Popover.Root>
