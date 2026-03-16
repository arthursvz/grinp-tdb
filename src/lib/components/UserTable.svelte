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
    export let rootBypassIdentity = false;
    export let rootBypassRoles = false;
    export let rootBypassCotisations = false;
    export let rootBypassInstructor = false;
    export let rootBypassDelete = false;
    export let canEditIdentity = true;
    export let canEditRoles = true;
    export let canEditCotisations = true;
    export let canEditInstructor = true;
    export let canDeleteMembers = false;
    export let isRootUser = false;

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
    const adminBypassLabel = "Admin bypass";

    const canBypassEdit = isTreasury || isSecretary
        ? rootBypassCotisations
        : isVice
            ? rootBypassInstructor || rootBypassCotisations
            : rootBypassIdentity || rootBypassRoles || rootBypassCotisations || rootBypassInstructor;
    $: rootOverride = isRootUser && !readonly;
    $: showEditBypassBadge = rootOverride && canBypassEdit;
    $: showDeleteBypassBadge = rootOverride && rootBypassDelete;
    $: canEditIdentityEffective = rootOverride || (!readonly && canEditIdentity);
    $: canEditRolesEffective = rootOverride || (!readonly && canEditRoles);
    $: canEditInstructorEffective = rootOverride || (!readonly && canEditInstructor);
    $: canEditCotisationsEffective = rootOverride || (!readonly && canEditCotisations);
    $: canDeleteMembersEffective = rootOverride || (!readonly && canDeleteMembers);
    $: canEditAnyEffective =
        rootOverride ||
        canEditIdentityEffective ||
        canEditRolesEffective ||
        canEditInstructorEffective ||
        canEditCotisationsEffective;

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
                const payload: Record<string, string | boolean | null> = {};

                if (canEditIdentityEffective) {
                    payload.churros_uid = draft.churros_uid || null;
                    payload.first_name = draft.first_name;
                    payload.last_name = draft.last_name;
                    payload.email = draft.email;
                }

                if (canEditRolesEffective) {
                    payload.bureau = draft.bureau;
                    payload.bureau_role = draft.bureau_role || null;
                }

                if (canEditInstructorEffective) {
                    payload.instructor = draft.instructor;
                }

                if (canEditCotisationsEffective) {
                    payload.cotisant_as = draft.cotisant_as;
                    payload.cotisant_grinp = draft.cotisant_grinp;
                }

                if (Object.keys(payload).length === 0) {
                    toast.error("Aucune modification possible");
                    return;
                }

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
        if (readonly || !canDeleteMembersEffective) return;
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
                            <Button size="sm" variant="secondary" on:click={() => openUser(user)}>Voir</Button>
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
        <div class="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-background border shadow-lg" on:click|stopPropagation>
            <div class="flex items-center justify-between border-b px-6 py-4">
                <div>
                    <h3 class="text-lg font-bold">Membre</h3>
                    <p class="text-xs text-muted-foreground">{draft.first_name} {draft.last_name}</p>
                </div>
                <div class="flex items-center gap-2">
                    {#if canEditAnyEffective}
                        <div class="flex items-center gap-2">
                            <Button type="button" variant="ghost" size="sm" on:click={() => (editMode = !editMode)}>Modifier</Button>
                            {#if showEditBypassBadge}
                                <div class="inline-flex w-fit items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                                    {adminBypassLabel}
                                </div>
                            {/if}
                        </div>
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
                            {#if editMode && canEditIdentityEffective}
                                <Input bind:value={draft.churros_uid} placeholder="UID" />
                            {:else}
                                <div class="text-sm">{draft.churros_uid || "-"}</div>
                            {/if}
                        </div>
                        <div>
                            <div class="text-xs text-muted-foreground">Prenom</div>
                            {#if editMode && canEditIdentityEffective}
                                <Input bind:value={draft.first_name} />
                            {:else}
                                <div class="text-sm">{draft.first_name}</div>
                            {/if}
                        </div>
                        <div>
                            <div class="text-xs text-muted-foreground">Nom</div>
                            {#if editMode && canEditIdentityEffective}
                                <Input bind:value={draft.last_name} />
                            {:else}
                                <div class="text-sm">{draft.last_name}</div>
                            {/if}
                        </div>
                        <div>
                            <div class="text-xs text-muted-foreground">Email</div>
                            {#if editMode && canEditIdentityEffective}
                                <Input bind:value={draft.email} />
                            {:else}
                                <div class="text-sm">{draft.email}</div>
                            {/if}
                        </div>
                        <div>
                            <div class="text-xs text-muted-foreground">Bureau</div>
                            {#if editMode && canEditRolesEffective}
                                <input type="checkbox" bind:checked={draft.bureau} class="h-4 w-4" />
                            {:else}
                                <div class="text-sm">{badge(draft.bureau)}</div>
                            {/if}
                        </div>
                        <div>
                            <div class="text-xs text-muted-foreground">Role bureau</div>
                            {#if editMode && canEditRolesEffective}
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
                                {#if editMode && canEditInstructorEffective}
                                    <input type="checkbox" bind:checked={draft.instructor} class="h-4 w-4" />
                                {:else}
                                    <div class="text-sm">{badge(draft.instructor)}</div>
                                {/if}
                            </div>
                            <div>
                                <div class="text-xs text-muted-foreground">Cotisant AS</div>
                                {#if editMode && canEditCotisationsEffective}
                                    <input type="checkbox" bind:checked={draft.cotisant_as} class="h-4 w-4" />
                                {:else}
                                    <div class="text-sm">{badge(draft.cotisant_as)}</div>
                                {/if}
                            </div>
                            <div>
                                <div class="text-xs text-muted-foreground">Cotisant Grinp</div>
                                {#if editMode && canEditCotisationsEffective}
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
                                <div class="font-semibold mb-2">Participation aux creneaux</div>
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
                {#if canDeleteMembersEffective}
                    <div class="flex items-center gap-2">
                        <Button type="button" variant="destructive" on:click={deleteUser}>Supprimer</Button>
                        {#if showDeleteBypassBadge}
                            <div class="inline-flex w-fit items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                                {adminBypassLabel}
                            </div>
                        {/if}
                    </div>
                {/if}
                {#if canEditAnyEffective && editMode}
                    <div class="flex items-center gap-2">
                        <Button type="button" on:click={saveUser}>Enregistrer</Button>
                        {#if showEditBypassBadge}
                            <div class="inline-flex w-fit items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                                {adminBypassLabel}
                            </div>
                        {/if}
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if}
