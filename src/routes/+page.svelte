<script lang="ts">
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
    import Button from "@/components/ui/button/button.svelte";
    import UserStatsOverview from "$lib/components/UserStatsOverview.svelte";
    import logo from "$lib/assets/logo.png";

    export let data;

    $: user = data?.user;
    $: statsGlobal = data?.statsGlobal;
    // On récupère la beta envoyée par le serveur (+page.server.ts)
    $: dailyBeta = data?.dailyBeta; 

    let showStats = true;
</script>

<div class="w-full space-y-12 pb-12">
    {#if user}
        <div class="w-3/4 mx-auto py-8 space-y-6">
            <div class="flex justify-between items-end border-b pb-8">
                <div>
                    <h1 class="text-4xl font-extrabold tracking-tight italic">Salut, {user.first_name} !</h1>
                    <p class="text-muted-foreground mt-2 text-lg">Prêt pour une nouvelle séance au club ?</p>
                </div>
                <img src={logo} alt="Logo" class="h-20 opacity-80 hidden md:block" />
            </div>

            <div class="p-4 bg-primary/5 border-l-4 border-primary rounded-r-lg shadow-sm group animate-in fade-in slide-in-from-left duration-700">
                <div class="flex items-center gap-2 mb-1">
                    <span class="text-lg">💡</span>
                    <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">La Beta du jour</span>
                </div>
                <p class="text-sm italic font-medium leading-relaxed">"{dailyBeta}"</p>
            </div>
        </div>

        <div class="w-3/4 mx-auto space-y-8">
            <div
                class="flex items-center justify-between cursor-pointer group"
                on:click={() => showStats = !showStats}
                on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && (showStats = !showStats)}
                role="button"
                tabindex="0"
            >
                <h2 class="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">
                    📊 Statistiques & Activité
                </h2>
                <span class="text-xl text-muted-foreground">{showStats ? '▼' : '▶'}</span>
            </div>

            {#if showStats}
                <div class="space-y-10 pt-2 animate-in fade-in slide-in-from-top-2 duration-500">
                    <div class="space-y-4">
                        <h3 class="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/70">Le club en {statsGlobal.monthName} 2026</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="p-4 bg-muted/30 border border-border/50 rounded-lg flex justify-between items-center shadow-sm">
                                <span class="text-sm font-medium">Créneaux ouverts</span>
                                <span class="text-2xl font-black text-primary">{statsGlobal.count}</span>
                            </div>
                            <div class="p-4 bg-muted/30 border border-border/50 rounded-lg flex justify-between items-center shadow-sm">
                                <span class="text-sm font-medium">Heures d'encadrement</span>
                                <span class="text-2xl font-black text-primary">{statsGlobal.hours}h</span>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <h3 class="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/70">Votre progression</h3>
                        <UserStatsOverview user_id={user.id} />
                    </div>
                </div>
            {/if}
        </div>
    {:else}
        <div class="m-auto w-full flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <img src={logo} alt="Logo" class="h-32 mb-8 opacity-90" />
            <h1 class="text-4xl font-black mb-4 tracking-tighter">Gr'INP Climbing</h1>
            <p class="text-muted-foreground max-w-md mb-8">Connectez-vous pour accéder au calendrier et gérer vos inscriptions.</p>
            <Button href="/login" class="px-10 py-6 text-lg font-bold shadow-xl">Accéder au Dashboard</Button>
        </div>
    {/if}

    <div class="w-3/4 mx-auto pt-16 border-t space-y-16">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm leading-relaxed">
            <div>
                <h4 class="font-bold mb-3 uppercase tracking-wider text-xs">À propos du Gr'INP</h4>
                <p class="text-muted-foreground">Rattaché à l'Association Sportive, le club offre un cadre structuré pour la pratique de l'escalade, du loisir à la compétition universitaire.</p>
            </div>
            <div>
                <h4 class="font-bold mb-3 uppercase tracking-wider text-xs">Événements</h4>
                <p class="text-muted-foreground">Le club organise la Nuit de l'Escalade et participe aux championnats de France des Grandes Écoles.</p>
            </div>
        </div>

        <footer class="pt-8 pb-12 opacity-30 hover:opacity-100 transition-opacity duration-500">
            <div class="text-[9px] text-center space-y-1 text-muted-foreground border-t border-dashed pt-8">
                <p class="font-semibold uppercase tracking-widest mb-2">Crédits techniques</p>
                <p>Architecture initiale : Théo (2026) • Maintenance & V2 : Arthur (2027)</p>
                <p>Remerciement spécial à Alexis (2027) pour le support nocturne durant le build du 20/01/2026.</p>
                <p class="pt-4 italic">© 2026 Gr'INP Climbing Club</p>
            </div>
        </footer>
    </div>
</div>
