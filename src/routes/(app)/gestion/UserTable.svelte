// ...existing code...
let slotListModalOpen = false;
let slotListLoading = false;
let slotListError = "";
let slotList: Array<{
    id: string;
    start: string;
    end: string;
    responsibles: string[];
    present: boolean;
}> = [];

async function openSlotListModal() {
    slotListModalOpen = true;
    slotListLoading = true;
    slotListError = "";
    slotList = [];
    try {
        const res = await fetch("/api/users/slot-list", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: activeUserId }),
        });
        if (!res.ok) {
            slotListError = "Impossible de charger les créneaux";
            return;
        }
        slotList = await res.json();
    } catch (e) {
        slotListError = "Erreur lors du chargement";
    } finally {
        slotListLoading = false;
    }
}

function closeSlotListModal() {
    slotListModalOpen = false;
}


<!-- Modal secondaire : créneaux inscrits -->
{#if slotListModalOpen}
    <div class="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4" on:click={closeSlotListModal}>
        <div class="w-full max-w-2xl rounded-xl bg-background border shadow-lg" on:click|stopPropagation>
            <div class="flex items-center justify-between border-b px-6 py-4">
                <h3 class="text-lg font-bold">Créneaux où le membre était inscrit</h3>
                <Button type="button" variant="ghost" on:click={closeSlotListModal}>Fermer</Button>
            </div>
            <div class="p-6">
                {#if slotListLoading}
                    <div class="text-sm text-muted-foreground">Chargement...</div>
                {:else if slotListError}
                    <div class="text-sm text-red-500">{slotListError}</div>
                {:else if slotList.length === 0}
                    <div class="text-sm text-muted-foreground">Aucun créneau trouvé.</div>
                {:else}
                    <div class="overflow-x-auto">
                        <table class="min-w-full text-sm border">
                            <thead>
                                <tr class="bg-muted">
                                    <th class="px-2 py-1 border">Date</th>
                                    <th class="px-2 py-1 border">Heure</th>
                                    <th class="px-2 py-1 border">Responsables</th>
                                    <th class="px-2 py-1 border">Présent ?</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each slotList as slot}
                                    <tr>
                                        <td class="px-2 py-1 border">{new Date(slot.start).toLocaleDateString()}</td>
                                        <td class="px-2 py-1 border">{new Date(slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                        <td class="px-2 py-1 border">{slot.responsibles.join(", ")}</td>
                                        <td class="px-2 py-1 border text-center">{badge(slot.present)}</td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if}
<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { CardContent } from "$lib/components/ui/card";
    import * as Table from "@/components/ui/table/";
    import type { User } from "@prisma/client";
    import type { Writable } from "svelte/store";
    import { invalidateAll } from "$app/navigation";
    import { toast } from "svelte-sonner";

    type EditableUser = Omit<User, "churros_uid" | "bureau_role"> & {
        churros_uid: string | null;
        bureau_role: string | null;
    };

    export let users: Writable<User[]>;
    export let mode: "full" | "treasury" | "vice" | "secretary" = "full";
    export let readonly = false;
    export let showRoot = true;

    const bureauRoles = ["PRESIDENT", "VICE_PRESIDENT", "TRESORIER", "SECRETAIRE", "MATERIEL"] as const;

    let searchQuery = "";
    let allUsers: EditableUser[] = [];
    let filteredUsers: EditableUser[] = [];

    let modalOpen = false;
    let editMode = false;
    let activeUserId: string | null = null;
    let draft: EditableUser = {
        id: "",
        churros_uid: null,
        first_name: "",
        last_name: "",
        email: "",
        password: null,
        root: false,
        instructor: false,
        bureau: false,
        bureau_role: null,
        cotisant_as: false,
        cotisant_grinp: false,
    };

    let statsLoading = false;
    let statsError = "";
    let stats: any = null;

    const isTreasury = mode === "treasury";
    const isVice = mode === "vice";
    const isSecretary = mode === "secretary";
    const scope = isTreasury ? "TRESORERIE" : isVice ? "VICE_PRESIDENCE" : isSecretary ? "SECRETAIRE" : "PRESIDENCE";

    users.subscribe((u) => {
        allUsers = (u || []).map((user) => ({
            ...user,
            churros_uid: user.churros_uid ?? null,
            bureau_role: user.bureau_role ?? null,
        }));
        updateFiltered();
    });

    function normalize(text: string | null | undefined) {
        if (!text) return "";
        return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    }

    function updateFiltered() {
        const rawQuery = searchQuery.toLowerCase().trim();
        const textQuery = normalize(searchQuery);

        if (!rawQuery) {
            filteredUsers = allUsers;
            return;
        }

        filteredUsers = allUsers.filter((user) => {
            if (!user) return false;
            if (user.id && user.id.toLowerCase().includes(rawQuery)) return true;

            const flags = [
                user.root ? "root" : "",
                user.instructor ? "instructor" : "",
                user.cotisant_as ? "cotisant as" : "",
                user.cotisant_grinp ? "cotisant grinp" : "",
                user.bureau ? "bureau" : "",
                user.bureau_role ?? "",
            ].join(" ");

            const fullIdentity = normalize(
                `${user.first_name} ${user.last_name} ${user.email} ${user.churros_uid ?? ""} ${flags}`
            );

            return fullIdentity.includes(textQuery);
        });
    }

    $: searchQuery, updateFiltered();

    function badge(value: boolean) {
        return value ? "✅" : "❌";
    }

    function openUser(user: EditableUser) {
        activeUserId = user.id;
        draft = { ...user };
        editMode = false;
        modalOpen = true;
        loadStats(user.id);
    }

    function closeUser() {
        modalOpen = false;
        editMode = false;
        activeUserId = null;
        stats = null;
        statsError = "";
    }

    async function loadStats(userId: string) {
        statsLoading = true;
        statsError = "";
        try {
            const res = await fetch("/api/users/stats", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: userId }),
            });

            if (!res.ok) {
                statsError = "Impossible de charger les statistiques";
                return;
            }

            stats = await res.json();
        } catch (error) {
            console.error(error);
            statsError = "Erreur lors du chargement";
        } finally {
            statsLoading = false;
        }
    }

    function formatDuration(minutes: number): string {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    }

    async function saveUser() {
        if (readonly) return;
        if (!activeUserId) return;
                const payload: Record<string, string | boolean | null> = isTreasury
                        ? {
                                    cotisant_as: draft.cotisant_as,
                                    cotisant_grinp: draft.cotisant_grinp,
                            }
                    : isSecretary
                        ? {
                            cotisant_as: draft.cotisant_as,
                            cotisant_grinp: draft.cotisant_grinp,
                        }
                        : isVice
                            ? {
                                        instructor: draft.instructor,
                                        cotisant_as: draft.cotisant_as,
                                        cotisant_grinp: draft.cotisant_grinp,
                                }
                            : {
                                        churros_uid: draft.churros_uid || null,
                                        first_name: draft.first_name,
                                        last_name: draft.last_name,
                                        email: draft.email,
                                        instructor: draft.instructor,
                                        bureau: draft.bureau,
                                        bureau_role: draft.bureau_role || null,
                                        cotisant_as: draft.cotisant_as,
                                        cotisant_grinp: draft.cotisant_grinp,
                                };

        try {
            const res = await fetch("/api/users/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: activeUserId,
                    data: payload,
                    scope,
                }),
            });

            if (res.ok) {
                toast.success("Utilisateur mis a jour");
                editMode = false;
                await invalidateAll();
            } else {
                toast.error("Mise a jour refusee");
            }
        } catch (error) {
            console.error(error);
            toast.error("Erreur de connexion");
        }
    }

    async function deleteUser() {
        if (readonly) return;
        if (!activeUserId) return;
        if (!confirm("Supprimer definitivement ce profil ?")) return;

        try {
            const res = await fetch("/api/users/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: activeUserId }),
            });

            if (res.ok) {
                toast.success("Utilisateur supprime");
                closeUser();
                await invalidateAll();
            } else {
                toast.error("Suppression refusee");
            }
        } catch (error) {
            console.error(error);
            toast.error("Erreur de connexion");
        }
    }
</script>

<CardContent class="flex flex-col gap-4 pt-6">
    <div class="flex items-center justify-between gap-4 flex-wrap">
        <h2 class="text-base font-semibold">Utilisateurs ({filteredUsers.length}) :</h2>
        <Input
            type="text"
            placeholder="Rechercher (ID, Nom, Email, Role...)"
            bind:value={searchQuery}
            class="max-w-xs"
        />
    </div>

    <div class="rounded-md border w-full max-h-[30rem] overflow-y-auto">
        <Table.Root>
            <Table.Header class="sticky top-0 bg-background z-10">
                <Table.Row>
                    <Table.Head>ID</Table.Head>
                    <Table.Head>Prenom</Table.Head>
                    <Table.Head>Nom</Table.Head>
                    <Table.Head>Email</Table.Head>
                    <Table.Head>Bureau</Table.Head>
                    <Table.Head>Role</Table.Head>
                    {#if showRoot}
                        <Table.Head>Root</Table.Head>
                    {/if}
                    <Table.Head>Instructeur</Table.Head>
                    <Table.Head>Cotisant AS</Table.Head>
                    <Table.Head>Cotisant Grinp</Table.Head>
                    <Table.Head>Voir</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {#each filteredUsers as user (user.id)}
                    <Table.Row>
                        <Table.Cell class="text-xs text-muted-foreground">{user.id}</Table.Cell>
                        <Table.Cell>{user.first_name}</Table.Cell>
                        <Table.Cell>{user.last_name}</Table.Cell>
                        <Table.Cell>{user.email}</Table.Cell>
                        <Table.Cell>{badge(!!user.bureau)}</Table.Cell>
                        <Table.Cell>{user.bureau_role ?? "-"}</Table.Cell>
                        {#if showRoot}
                            <Table.Cell>{badge(!!user.root)}</Table.Cell>
                        {/if}
                        <Table.Cell>{badge(!!user.instructor)}</Table.Cell>
                        <Table.Cell>{badge(!!user.cotisant_as)}</Table.Cell>
                        <Table.Cell>{badge(!!user.cotisant_grinp)}</Table.Cell>
                        <Table.Cell>
                            <Button size="sm" variant="secondary" on:click={() => openUser(user)}>👁️</Button>
                        </Table.Cell>
                    </Table.Row>
                {/each}
                {#if filteredUsers.length === 0}
                    <Table.Row>
                        <Table.Cell colspan={11} class="h-24 text-center">
                            Aucun resultat pour "{searchQuery}".
                        </Table.Cell>
                    </Table.Row>
                {/if}
            </Table.Body>
        </Table.Root>
    </div>
</CardContent>

{#if modalOpen}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" on:click={closeUser}>
        <div class="w-full max-w-3xl rounded-xl bg-background border shadow-lg" on:click|stopPropagation>
            <div class="flex items-center justify-between border-b px-6 py-4">
                <div>
                    <h3 class="text-lg font-bold">Membre</h3>
                    <p class="text-xs text-muted-foreground">{draft.first_name} {draft.last_name}</p>
                </div>
                <div class="flex items-center gap-2">
                    {#if !readonly}
                        <Button type="button" variant="ghost" on:click={() => (editMode = !editMode)}>✏️</Button>
                    {/if}
                    <Button type="button" variant="ghost" on:click={closeUser}>Fermer</Button>
                </div>
            </div>

            <div class="grid gap-6 md:grid-cols-2 px-6 py-4">
                <div class="space-y-4">
                    <h4 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Infos</h4>
                    <div class="grid gap-3">
                        <div>
                            <div class="text-xs text-muted-foreground">ID</div>
                            <div class="text-sm break-all">{draft.id}</div>
                        </div>
                        <div>
                            <div class="text-xs text-muted-foreground">Churros UID</div>
                            {#if editMode && !isTreasury && !isVice && !isSecretary}
                                <Input bind:value={draft.churros_uid} placeholder="UID" />
                            {:else}
                                <div class="text-sm">{draft.churros_uid || "-"}</div>
                            {/if}
                        </div>
                        <div>
                            <div class="text-xs text-muted-foreground">Prenom</div>
                            {#if editMode && !isTreasury && !isVice && !isSecretary}
                                <Input bind:value={draft.first_name} />
                            {:else}
                                <div class="text-sm">{draft.first_name}</div>
                            {/if}
                        </div>
                        <div>
                            <div class="text-xs text-muted-foreground">Nom</div>
                            {#if editMode && !isTreasury && !isVice && !isSecretary}
                                <Input bind:value={draft.last_name} />
                            {:else}
                                <div class="text-sm">{draft.last_name}</div>
                            {/if}
                        </div>
                        <div>
                            <div class="text-xs text-muted-foreground">Email</div>
                            {#if editMode && !isTreasury && !isVice && !isSecretary}
                                <Input bind:value={draft.email} />
                            {:else}
                                <div class="text-sm">{draft.email}</div>
                            {/if}
                        </div>
                        <div>
                            <div class="text-xs text-muted-foreground">Bureau</div>
                            {#if editMode && !isTreasury && !isVice && !isSecretary}
                                <input type="checkbox" bind:checked={draft.bureau} class="h-4 w-4" />
                            {:else}
                                <div class="text-sm">{badge(draft.bureau)}</div>
                            {/if}
                        </div>
                        <div>
                            <div class="text-xs text-muted-foreground">Role bureau</div>
                            {#if editMode && !isTreasury && !isVice}
                                <select
                                    class="rounded-md border border-input bg-background px-2 py-1 text-sm"
                                    bind:value={draft.bureau_role}
                                >
                                    <option value="">-</option>
                                    {#each bureauRoles as role}
                                        <option value={role}>{role}</option>
                                    {/each}
                                </select>
                            {:else}
                                <div class="text-sm">{draft.bureau_role || "-"}</div>
                            {/if}
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            {#if showRoot}
                                <div>
                                    <div class="text-xs text-muted-foreground">Root</div>
                                    <div class="text-sm">{badge(draft.root)}</div>
                                </div>
                            {/if}
                            <div>
                                <div class="text-xs text-muted-foreground">Instructeur</div>
                                {#if editMode && !isTreasury && !isSecretary}
                                    <input type="checkbox" bind:checked={draft.instructor} class="h-4 w-4" />
                                {:else}
                                    <div class="text-sm">{badge(draft.instructor)}</div>
                                {/if}
                            </div>
                            <div>
                                <div class="text-xs text-muted-foreground">Cotisant AS</div>
                                {#if editMode}
                                    <input type="checkbox" bind:checked={draft.cotisant_as} class="h-4 w-4" />
                                {:else}
                                    <div class="text-sm">{badge(draft.cotisant_as)}</div>
                                {/if}
                            </div>
                            <div>
                                <div class="text-xs text-muted-foreground">Cotisant Grinp</div>
                                {#if editMode}
                                    <input type="checkbox" bind:checked={draft.cotisant_grinp} class="h-4 w-4" />
                                {:else}
                                    <div class="text-sm">{badge(draft.cotisant_grinp)}</div>
                                {/if}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="space-y-4">
                    <h4 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Stats</h4>
                    {#if statsLoading}
                        <div class="text-sm text-muted-foreground">Chargement...</div>
                    {:else if statsError}
                        <div class="text-sm text-red-500">{statsError}</div>
                    {:else if stats}
                        <div class="space-y-4 text-sm">
                            <div class="border-b pb-3">
                                <div class="font-semibold">{stats.user.first_name} {stats.user.last_name}</div>
                                <div class="text-xs text-muted-foreground break-all">{stats.user.email}</div>
                            </div>
                            <div class="border-b pb-3">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="font-semibold">Participation aux creneaux</div>
                                    <Button size="sm" variant="outline" on:click={openSlotListModal}>Voir les créneaux</Button>
                                </div>
                                <div class="grid grid-cols-2 gap-2">
                                    <div>
                                        <div class="text-lg font-bold">{stats.stats.totalSlotSubscriptions}</div>
                                        <div class="text-xs text-muted-foreground">Inscriptions</div>
                                    </div>
                                    <div>
                                        <div class="text-lg font-bold">{stats.stats.totalAttendances}</div>
                                        <div class="text-xs text-muted-foreground">Presences</div>
                                    </div>
                                </div>
                                <div class="mt-2">
                                    <div class="text-base font-semibold">{formatDuration(stats.stats.totalClimbingDuration)}</div>
                                    <div class="text-xs text-muted-foreground">Duree de grimpe</div>
                                </div>
                            </div>
                            <div>
                                <div class="font-semibold mb-2">Creneaux ouverts (initiateur)</div>
                                <div class="grid grid-cols-2 gap-2">
                                    <div>
                                        <div class="text-lg font-bold">{stats.stats.slotsOpened}</div>
                                        <div class="text-xs text-muted-foreground">Creneaux</div>
                                    </div>
                                    <div>
                                        <div class="text-lg font-bold">{stats.stats.totalParticipantsInOpenedSlots}</div>
                                        <div class="text-xs text-muted-foreground">Participants</div>
                                    </div>
                                </div>
                                <div class="mt-2">
                                    <div class="text-base font-semibold">{formatDuration(stats.stats.totalOpenedDuration)}</div>
                                    <div class="text-xs text-muted-foreground">Duree d'ouverture</div>
                                </div>
                            </div>
                        </div>
                    {:else}
                        <div class="text-sm text-muted-foreground">Aucune statistique.</div>
                    {/if}
                </div>
            </div>

            <div class="flex flex-wrap justify-end gap-2 border-t px-6 py-4">
                {#if !readonly && !isTreasury && !isVice && !isSecretary}
                    <Button type="button" variant="destructive" on:click={deleteUser}>Supprimer le profil</Button>
                {/if}
                <Button type="button" variant="outline" on:click={closeUser}>Fermer</Button>
                {#if !readonly && editMode}
                    <Button type="button" on:click={saveUser}>Enregistrer</Button>
                {/if}
            </div>
        </div>
    </div>
{/if}
