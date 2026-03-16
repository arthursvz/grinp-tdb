<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Textarea } from "$lib/components/ui/textarea"; 
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "$lib/components/ui/card";
    import { enhance } from "$app/forms";
    import type { PageData } from "./$types";
    import { invalidateAll } from "$app/navigation";

    export let data: PageData;

    let isDialogOpen = false;
    let editingInfo: any = null;

    function openEdit(info: any) {
        editingInfo = info;
        isDialogOpen = true;
    }

    function openCreate() {
        editingInfo = null;
        isDialogOpen = true;
    }

    function closeDialog() {
        isDialogOpen = false;
    }
</script>

<div class="container mx-auto py-10 px-4 space-y-8 relative">
    
    <div class="flex justify-between items-center">
        <div>
            <h1 class="text-3xl font-bold tracking-tight">Panneau d'affichage 📌</h1>
            <p class="text-muted-foreground">Les dernières nouvelles du club.</p>
        </div>

        {#if data.isRoot}
            <Button on:click={openCreate}>+ Nouvelle Info</Button>
        {/if}
    </div>

    {#if isDialogOpen}
        <div class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" on:click={closeDialog} role="presentation"></div>
        <div class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
            <div class="flex flex-col space-y-1.5 text-center sm:text-left">
                <h2 class="text-lg font-semibold leading-none tracking-tight">
                    {editingInfo ? "Modifier l'info" : "Créer une info"}
                </h2>
                <p class="text-sm text-muted-foreground">
                    Remplissez les champs ci-dessous.
                </p>
            </div>
            
            <form method="POST" action={editingInfo ? "?/update" : "?/create"} use:enhance={() => {
                return async ({ result }) => {
                    if (result.type === 'success') closeDialog();
                    await invalidateAll();
                };
            }} class="space-y-4">
                
                {#if editingInfo}
                    <input type="hidden" name="id" value={editingInfo.id} />
                {/if}

                <div class="space-y-2">
                    <label for="title" class="text-sm font-medium leading-none">Titre</label>
                    <Input id="title" name="title" placeholder="Ex: Fermeture exceptionnelle..." value={editingInfo?.title || ''} required />
                </div>
                
                <div class="space-y-2">
                    <label for="content" class="text-sm font-medium leading-none">Contenu</label>
                    <Textarea id="content" name="content" placeholder="Détails de l'information..." class="h-32" value={editingInfo?.content || ''} required />
                </div>

                <div class="space-y-2">
                    <label for="link" class="text-sm font-medium leading-none">Lien (Optionnel)</label>
                    <Input id="link" name="link" placeholder="https://..." value={editingInfo?.link || ''} />
                </div>

                <div class="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" on:click={closeDialog}>Annuler</Button>
                    <Button type="submit">{editingInfo ? "Enregistrer" : "Publier"}</Button>
                </div>
            </form>
        </div>
    {/if}

    {#if data.infos.length === 0}
        <div class="text-center py-20 bg-muted/30 rounded-xl border border-dashed">
            <p class="text-muted-foreground text-lg">Aucune information pour le moment.</p>
        </div>
    {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each data.infos as info}
                <Card class="flex flex-col h-full hover:shadow-md transition-shadow">
                    <CardHeader>
                        <div class="flex justify-between items-start gap-2">
                            <CardTitle class="text-xl leading-tight">{info.title}</CardTitle>
                            {#if data.isRoot}
                                <div class="flex gap-1">
                                    <Button variant="ghost" size="icon" class="h-8 w-8" on:click={() => openEdit(info)}>✏️</Button>
                                    <form method="POST" action="?/delete" use:enhance>
                                        <input type="hidden" name="id" value={info.id} />
                                        <Button type="submit" variant="ghost" size="icon" class="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">🗑️</Button>
                                    </form>
                                </div>
                            {/if}
                        </div>
                        <CardDescription>
                            Par {info.author.first_name} {info.author.last_name} • 
                            {new Date(info.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="flex-grow">
                        <p class="whitespace-pre-line text-sm text-foreground/90 leading-relaxed">
                            {info.content}
                        </p>
                    </CardContent>
                    
                    {#if info.link}
                        <div class="px-6 pb-2">
                            <Button href={info.link} target="_blank" variant="secondary" class="w-full gap-2 border shadow-sm">
                                🔗 Voir le lien
                            </Button>
                        </div>
                    {/if}

                    <CardFooter class="pt-2 pb-4 text-xs text-muted-foreground italic border-t mt-4">
                        {#if info.createdAt.getTime() !== info.updatedAt.getTime()}
                            Modifié le {new Date(info.updatedAt).toLocaleDateString('fr-FR')}
                        {:else}
                            Publié le {new Date(info.createdAt).toLocaleDateString('fr-FR')}
                        {/if}
                    </CardFooter>
                </Card>
            {/each}
        </div>
    {/if}
</div>
