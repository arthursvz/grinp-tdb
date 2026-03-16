<script lang="ts">
    import { enhance } from '$app/forms';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";

    export let data;

    const adminBypassLabel = "Admin bypass";

    // On trie pour mettre la béta épinglée en haut de liste visuellement si on veut, 
    // ou on garde l'ordre chronologique de data.allBetas
</script>

<div class="w-full max-w-4xl mx-auto py-10 px-4 space-y-8">
    <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
            <h1 class="text-3xl font-black italic uppercase tracking-tighter">Gestion des Bétas du Gr'INP</h1>
            {#if data.rootBypassView}
                <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                    {adminBypassLabel}
                </span>
            {/if}
        </div>
        <p class="text-muted-foreground">Configure les messages qui s'affichent sur le dashboard des membres.</p>
    </div>

    <Card class="border-dashed border-2">
        <CardHeader>
            <div class="flex items-center gap-2">
                <CardTitle class="text-sm font-bold uppercase tracking-widest">Nouvelle Beta</CardTitle>
                {#if data.isRoot}
                    <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                        {adminBypassLabel}
                    </span>
                {/if}
            </div>
        </CardHeader>
        <CardContent>
            <form method="POST" action="?/create" use:enhance class="flex gap-2">
                <Input 
                    name="content" 
                    placeholder="Ex: Pousse sur les jambes ! 🦵" 
                    required 
                    class="flex-1 text-lg"
                />
                <div class="flex items-center gap-2">
                    <Button type="submit">Ajouter</Button>
                    {#if data.isRoot}
                        <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                            {adminBypassLabel}
                        </span>
                    {/if}
                </div>
            </form>
        </CardContent>
    </Card>

    <div class="grid gap-4">
        <h2 class="text-sm font-bold uppercase tracking-widest text-muted-foreground pt-4">Liste des phrases enregistrées</h2>
        
        {#if data.allBetas.length === 0}
            <p class="text-center py-10 text-muted-foreground border rounded-lg bg-muted/20">
                Aucune béta en base. La rotation automatique utilisera le message par défaut.
            </p>
        {/if}

        {#each data.allBetas as beta}
            <div 
                class="flex items-center justify-between p-4 rounded-xl border transition-all duration-300 
                {beta.is_special ? 'bg-primary/10 border-primary shadow-md' : 'bg-card border-border hover:border-muted-foreground/50'}"
            >
                <div class="flex-1 space-y-1">
                    {#if beta.is_special}
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 bg-primary text-[10px] font-bold text-primary-foreground rounded uppercase tracking-tighter">
                                En une de l'accueil
                            </span>
                        </div>
                    {/if}
                    <p class="text-base {beta.is_special ? 'font-semibold' : ''}">
                        {beta.content}
                    </p>
                </div>

                <div class="flex items-center gap-3 ml-4">
                    <form method="POST" action="?/toggleSpecial" use:enhance>
                        <input type="hidden" name="id" value={beta.id} />
                        <div class="flex items-center gap-2">
                            <button 
                                type="submit" 
                                title={beta.is_special ? "Désépingler" : "Afficher sur l'accueil"}
                                class="text-2xl transition-transform hover:scale-125 {beta.is_special ? 'grayscale-0' : 'grayscale opacity-30 hover:opacity-100'}"
                            >
                                ⭐
                            </button>
                            {#if data.isRoot}
                                <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                                    {adminBypassLabel}
                                </span>
                            {/if}
                        </div>
                    </form>

                    <form 
                        method="POST" 
                        action="?/delete" 
                        use:enhance 
                        on:submit|preventDefault={(e) => {
                            if (confirm('Supprimer définitivement cette béta ?')) e.target.submit();
                        }}
                    >
                        <input type="hidden" name="id" value={beta.id} />
                        <div class="flex items-center gap-2">
                            <button 
                                type="submit" 
                                class="p-2 text-muted-foreground hover:text-destructive transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                            </button>
                            {#if data.isRoot}
                                <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                                    {adminBypassLabel}
                                </span>
                            {/if}
                        </div>
                    </form>
                </div>
            </div>
        {/each}
    </div>

    <div class="pt-10">
        <Button variant="outline" href="/gestion" class="gap-2">
            ← Retour a la gestion
        </Button>
    </div>
</div>
