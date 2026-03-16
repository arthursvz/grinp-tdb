<script lang="ts">
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import { enhance } from "$app/forms";
  import { invalidateAll } from "$app/navigation";

  export let data;

  let userQuery = "";
  $: normalizedQuery = userQuery.toLowerCase().trim();
  $: filteredUsers = normalizedQuery
    ? (data.users ?? []).filter((user) => {
        const haystack = `${user.first_name} ${user.last_name} ${user.email}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : data.users ?? [];

  let sessionDialogOpen = false;
  let sessionEditMode = false;
  let selectedSession: any = null;
  let createSessionOpen = false;
  let routeDialogOpen = false;
  let addAttemptOpen = false;
  let selectedRouteId = "";
  let selectedRouteLabel = "";
  let routeDraft = {
    id: "",
    name: "",
    relay: "",
    color: "",
    grade: "",
    active: true,
  };
  let routeQuery = "";
  $: normalizedRouteQuery = routeQuery.toLowerCase().trim();
  $: activeRoutes = (data.routes ?? []).filter((route) => route.active);
  $: filteredRoutes = normalizedRouteQuery
    ? activeRoutes.filter((route) => {
        const haystack = `${route.relay ?? ""} ${route.color ?? ""} ${route.grade ?? ""}`
          .toLowerCase()
          .trim();
        return haystack.includes(normalizedRouteQuery);
      })
    : activeRoutes;

  function openSession(session) {
    selectedSession = session;
    sessionEditMode = false;
    sessionDialogOpen = true;
    routeQuery = "";
    addAttemptOpen = false;
    selectedRouteId = "";
    selectedRouteLabel = "";
  }

  function openCreateSession() {
    createSessionOpen = true;
  }

  function closeCreateSession() {
    createSessionOpen = false;
  }

  function openRouteEditor(route) {
    routeDraft = {
      id: route.id,
      name: route.name ?? "",
      relay: route.relay ?? "",
      color: route.color ?? "",
      grade: route.grade ?? "",
      active: !!route.active,
    };
    routeDialogOpen = true;
  }

  function closeRouteEditor() {
    routeDialogOpen = false;
  }

  function closeSession() {
    sessionDialogOpen = false;
    sessionEditMode = false;
    selectedSession = null;
    routeQuery = "";
    addAttemptOpen = false;
    selectedRouteId = "";
    selectedRouteLabel = "";
  }

  const groupedRoutes = () => {
    const groups: Record<string, any[]> = {};
    for (const route of data.routeCatalog ?? []) {
      const relay = route.relay || "-";
      if (!groups[relay]) groups[relay] = [];
      groups[relay].push(route);
    }
    return Object.entries(groups);
  };

  const formatSlotLabel = (slot) => {
    const date = new Date(slot.starts_at).toLocaleDateString("fr-FR");
    return `${slot.name || "Creneau"} - ${date}`;
  };

  const formatAttemptDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("fr-FR");
  };

  const sessionDateInput = (value) => {
    if (!value) return "";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
  };

  const adminBypassLabel = "Admin bypass";
  const keepModalFresh = async ({ result }) => {
    if (result?.type === "success") {
      await invalidateAll();
    }
  };
</script>

<Card class="m-auto w-full min-h-[calc(100vh-4rem)]">
  <CardHeader>
    <CardTitle>Historique de pratique</CardTitle>
    <CardDescription>
      {#if data.targetUser}
        Suivi de {data.targetUser.first_name} {data.targetUser.last_name}
      {:else}
        Suivi personnel
      {/if}
    </CardDescription>
    {#if data.rootBypass}
      <div class="inline-flex w-fit items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
        {adminBypassLabel}
      </div>
    {/if}
  </CardHeader>

  <div class="relative">
    <div class="absolute inset-0 flex items-center">
      <span class="m-4 w-full border-t" />
    </div>
  </div>

  <CardContent class="space-y-8 pt-6">
    {#if data.canViewAll}
      <section class="rounded-xl border bg-card/50 p-4 space-y-3">
        <div class="flex items-center justify-between gap-3 flex-wrap">
          <div class="flex items-center gap-2">
            <h2 class="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Recherche membre</h2>
            {#if data.rootBypassView}
              <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                {adminBypassLabel}
              </span>
            {/if}
          </div>
          <Input placeholder="Rechercher un membre..." class="max-w-xs" bind:value={userQuery} />
        </div>
        {#if normalizedQuery}
          <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {#each filteredUsers as user}
              <div class="flex items-center justify-between rounded-lg border px-3 py-2">
                <div>
                  <div class="text-sm font-medium">{user.first_name} {user.last_name}</div>
                  <div class="text-xs text-muted-foreground">{user.email}</div>
                </div>
                <div class="flex items-center gap-2">
                  <Button href={`/historique/${user.id}`} size="sm" variant="outline">Voir</Button>
                  {#if data.rootBypassView}
                    <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                      {adminBypassLabel}
                    </span>
                  {/if}
                </div>
              </div>
            {/each}
            {#if filteredUsers.length === 0}
              <div class="text-sm text-muted-foreground">Aucun resultat.</div>
            {/if}
          </div>
        {:else}
          <div class="text-xs text-muted-foreground">Commencez a taper pour afficher les suggestions.</div>
        {/if}
      </section>
    {/if}

    <section class="space-y-3">
      <h2 class="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Statistiques</h2>
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div class="rounded-xl border bg-card p-4">
          <p class="text-xs text-muted-foreground uppercase tracking-widest">Seances</p>
          <div class="text-2xl font-bold">{data.stats.totalSessions}</div>
          <p class="text-xs text-muted-foreground">Club: {data.stats.clubSessions} / Externes: {data.stats.externalSessions}</p>
        </div>
        <div class="rounded-xl border bg-card p-4">
          <p class="text-xs text-muted-foreground uppercase tracking-widest">Tentatives</p>
          <div class="text-2xl font-bold">{data.stats.totalAttempts}</div>
          <p class="text-xs text-muted-foreground">Succes: {data.stats.successRate}%</p>
        </div>
        <div class="rounded-xl border bg-card p-4">
          <p class="text-xs text-muted-foreground uppercase tracking-widest">Duree totale</p>
          <div class="text-2xl font-bold">{data.stats.totalMinutes} min</div>
          <p class="text-xs text-muted-foreground">Moyenne: {data.stats.avgMinutes} min</p>
        </div>
        <div class="rounded-xl border bg-card p-4">
          <p class="text-xs text-muted-foreground uppercase tracking-widest">Meilleure cotation</p>
          <div class="text-2xl font-bold">{data.stats.bestGradeSuccess ?? "-"}</div>
          <p class="text-xs text-muted-foreground">Tentee: {data.stats.bestGradeAttempted ?? "-"}</p>
        </div>
        <div class="rounded-xl border bg-card p-4">
          <p class="text-xs text-muted-foreground uppercase tracking-widest">Voies uniques</p>
          <div class="text-2xl font-bold">{data.stats.uniqueRoutes}</div>
          <p class="text-xs text-muted-foreground">Moyenne: {data.stats.avgAttemptsPerSession} / seance</p>
        </div>
      </div>
    </section>

    <section class="grid gap-4 lg:grid-cols-2">
      <div class="rounded-xl border bg-card p-4">
        <h3 class="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Par relais</h3>
        <div class="mt-3 space-y-2">
          {#each data.stats.relayStats as relay}
            <div class="flex items-center justify-between text-sm">
              <span class="font-medium">{relay.relay}</span>
              <span class="text-muted-foreground">{relay.success}/{relay.attempted}</span>
            </div>
          {/each}
          {#if data.stats.relayStats.length === 0}
            <div class="text-sm text-muted-foreground">Aucune tentative.</div>
          {/if}
        </div>
      </div>
      <div class="rounded-xl border bg-card p-4">
        <h3 class="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Progression mensuelle</h3>
        <div class="mt-3 space-y-2">
          {#each data.stats.monthly as month}
            <div class="flex items-center justify-between text-sm">
              <span class="font-medium">{month.month}</span>
              <span class="text-muted-foreground">Moy: {month.avgGrade ?? "-"} / Max: {month.bestGrade ?? "-"}</span>
            </div>
          {/each}
          {#if data.stats.monthly.length === 0}
            <div class="text-sm text-muted-foreground">Aucune donnee.</div>
          {/if}
        </div>
      </div>
    </section>

    <details class="group rounded-xl border bg-card p-4">
      <summary class="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        <div class="flex items-center gap-2">
          <span>Catalogue des voies</span>
          {#if data.rootBypassRoutes}
            <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
              {adminBypassLabel}
            </span>
          {/if}
        </div>
        <span class="text-muted-foreground transition-transform group-open:rotate-180">v</span>
      </summary>
      <div class="mt-4 space-y-3">
        <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {#each groupedRoutes() as [relay, routes]}
            <div class="rounded-lg border p-3">
              <div class="text-sm font-semibold">Relais {relay}</div>
              <div class="mt-2 space-y-1 text-xs">
                {#each routes as route}
                  <div class="space-y-1">
                    <div class="flex items-center justify-between">
                      <span class:opacity-50={!route.active}>{route.name} ({route.color} - {route.grade})</span>
                      {#if data.canEditRoutes}
                        <div class="flex items-center gap-2">
                          <Button type="button" size="sm" variant="outline" on:click={() => openRouteEditor(route)}>
                            Modifier
                          </Button>
                          {#if data.rootBypassRoutes}
                            <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                              {adminBypassLabel}
                            </span>
                          {/if}
                        </div>
                      {/if}
                    </div>
                    <div class="text-[10px] text-muted-foreground">
                      essais: {route.attemptCount} · moy: {route.avgCompletion ?? "-"}% · max: {route.maxCompletion ?? "-"}% · dernier: {formatAttemptDate(route.lastAttemptAt)}
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/each}
        </div>

        {#if data.canEditRoutes}
          <form method="POST" action="?/createRoute" class="grid gap-3 md:grid-cols-4">
            <Input name="name" placeholder="Nom de la voie" required />
            <Input name="relay" placeholder="Relais" required />
            <Input name="color" placeholder="Couleur" required />
            <Input name="grade" placeholder="Cotation" required />
            <div class="md:col-span-4 flex justify-end">
              <div class="flex items-center gap-2">
                <Button type="submit">Ajouter une voie</Button>
                {#if data.rootBypassRoutes}
                  <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                    {adminBypassLabel}
                  </span>
                {/if}
              </div>
            </div>
          </form>
        {/if}
      </div>
    </details>

    <section class="space-y-4">
      <div class="flex items-center justify-between gap-3 flex-wrap">
        <h3 class="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Historique de mes seances</h3>
      </div>

      {#if data.canEditTarget}
        <div class="flex justify-end">
          <div class="flex items-center gap-2">
            <Button type="button" size="sm" on:click={openCreateSession}>Ajouter</Button>
            {#if data.rootBypassEdit}
              <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                {adminBypassLabel}
              </span>
            {/if}
          </div>
        </div>
      {/if}

      <div class="rounded-xl border bg-card">
        <div class="max-h-[30rem] overflow-y-auto">
          <table class="w-full text-sm">
            <thead class="sticky top-0 bg-background text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th class="px-4 py-3 text-left">Date</th>
                <th class="px-4 py-3 text-left">Type</th>
                <th class="px-4 py-3 text-left">Creneau</th>
                <th class="px-4 py-3 text-left">Voies</th>
                <th class="px-4 py-3 text-left"></th>
              </tr>
            </thead>
            <tbody class="divide-y">
              {#each data.sessions as session}
                <tr>
                  <td class="px-4 py-3">{new Date(session.date).toLocaleDateString("fr-FR")}</td>
                  <td class="px-4 py-3">{session.isExternal || !session.slotId ? "Externe" : "Club"}</td>
                  <td class="px-4 py-3">{session.slot ? formatSlotLabel(session.slot) : "-"}</td>
                  <td class="px-4 py-3">{session.attempts?.length ?? 0}</td>
                  <td class="px-4 py-3">
                    <Button type="button" size="sm" variant="secondary" on:click={() => openSession(session)}>Voir</Button>
                  </td>
                </tr>
              {/each}
              {#if data.sessions.length === 0}
                <tr>
                  <td class="px-4 py-8 text-center text-muted-foreground" colspan="5">Aucune seance enregistree.</td>
                </tr>
              {/if}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </CardContent>
</Card>

{#if routeDialogOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" on:click={closeRouteEditor}>
    <div class="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl bg-background border shadow-lg" on:click|stopPropagation>
      <div class="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h3 class="text-lg font-bold">Modifier la voie</h3>
          <p class="text-xs text-muted-foreground">{routeDraft.name}</p>
        </div>
        <div class="flex items-center gap-2">
          <Button type="button" variant="ghost" on:click={closeRouteEditor}>Fermer</Button>
        </div>
      </div>

      <form method="POST" action="?/updateRoute" class="space-y-4 px-6 py-4">
        <input type="hidden" name="routeId" value={routeDraft.id} />
        <div class="grid gap-3 md:grid-cols-2">
          <Input name="name" placeholder="Nom de la voie" bind:value={routeDraft.name} required />
          <Input name="relay" placeholder="Relais" bind:value={routeDraft.relay} required />
          <Input name="color" placeholder="Couleur" bind:value={routeDraft.color} required />
          <Input name="grade" placeholder="Cotation" bind:value={routeDraft.grade} required />
        </div>
        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" bind:checked={routeDraft.active} class="h-4 w-4" />
          Voie active
        </label>
        <div class="flex justify-end gap-2">
          <Button type="button" variant="outline" on:click={closeRouteEditor}>Annuler</Button>
          <div class="flex items-center gap-2">
            <Button type="submit">Enregistrer</Button>
            {#if data.rootBypassRoutes}
              <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                {adminBypassLabel}
              </span>
            {/if}
          </div>
        </div>
      </form>

      <form
        method="POST"
        action="?/deleteRoute"
        class="px-6 pb-6 flex justify-end"
        on:submit={(event) => {
          if (!confirm("Supprimer cette voie ?")) event.preventDefault();
        }}
      >
        <input type="hidden" name="routeId" value={routeDraft.id} />
        <div class="flex items-center gap-2">
          <Button type="submit" variant="destructive">Supprimer</Button>
          {#if data.rootBypassRoutes}
            <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
              {adminBypassLabel}
            </span>
          {/if}
        </div>
      </form>
    </div>
  </div>
{/if}

{#if createSessionOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" on:click={closeCreateSession}>
    <div class="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-background border shadow-lg" on:click|stopPropagation>
      <div class="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h3 class="text-lg font-bold">Ajouter une seance</h3>
          <p class="text-xs text-muted-foreground">Nouvelle seance</p>
        </div>
        <Button type="button" variant="ghost" on:click={closeCreateSession}>Fermer</Button>
      </div>

      <form method="POST" action="?/createSession" class="space-y-4 px-6 py-4">
        <input type="hidden" name="userId" value={data.targetUser?.id} />
        <div class="grid gap-3 md:grid-cols-2">
          <Input type="date" name="date" required />
          <select name="sessionType" class="rounded-md border border-input bg-background px-3 py-2 text-sm" required>
            <option value="club">Club</option>
            <option value="external">Externe</option>
          </select>
          <select name="slotId" class="rounded-md border border-input bg-background px-3 py-2 text-sm md:col-span-2">
            <option value="">Aucun creneau</option>
            {#each data.slotOptions as slot}
              <option value={slot.id}>{formatSlotLabel(slot)}</option>
            {/each}
          </select>
          <Input type="number" name="durationMinutes" placeholder="Duree (min)" min="0" />
        </div>
        <Textarea name="feeling" placeholder="Ressenti" />
        <div class="flex justify-end gap-2">
          <Button type="button" variant="outline" on:click={closeCreateSession}>Annuler</Button>
          <div class="flex items-center gap-2">
            <Button type="submit">Ajouter la seance</Button>
            {#if data.rootBypassEdit}
              <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                {adminBypassLabel}
              </span>
            {/if}
          </div>
        </div>
      </form>
    </div>
  </div>
{/if}

{#if sessionDialogOpen && selectedSession}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" on:click={closeSession}>
    <div class="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-background border shadow-lg" on:click|stopPropagation>
      <div class="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h3 class="text-lg font-bold">Seance du {new Date(selectedSession.date).toLocaleDateString("fr-FR")}</h3>
          <p class="text-xs text-muted-foreground">
            {selectedSession.isExternal || !selectedSession.slotId ? "Externe" : "Club"}
            {#if selectedSession.slot}
              · {formatSlotLabel(selectedSession.slot)}
            {/if}
          </p>
        </div>
        <div class="flex items-center gap-2">
          {#if data.canEditTarget}
            <div class="flex items-center gap-2">
              <Button type="button" variant="ghost" size="sm" on:click={() => (sessionEditMode = !sessionEditMode)}>Modifier</Button>
              {#if data.rootBypassEdit}
                <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                  {adminBypassLabel}
                </span>
              {/if}
            </div>
          {/if}
          <Button type="button" variant="ghost" on:click={closeSession}>Fermer</Button>
        </div>
      </div>

      <div class="space-y-4 px-6 py-4">
        {#if selectedSession.feeling}
          <div class="text-sm text-muted-foreground">{selectedSession.feeling}</div>
        {/if}

        {#if sessionEditMode && data.canEditTarget}
          <form method="POST" action="?/updateSession" class="grid gap-3 md:grid-cols-3">
            <input type="hidden" name="sessionId" value={selectedSession.id} />
            <Input type="date" name="date" value={sessionDateInput(selectedSession.date)} required />
            <select name="sessionType" class="rounded-md border border-input bg-background px-3 py-2 text-sm" required>
              <option value="club" selected={!selectedSession.isExternal}>Club</option>
              <option value="external" selected={selectedSession.isExternal}>Externe</option>
            </select>
            <select name="slotId" class="rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">Aucun creneau</option>
              {#each data.slotOptions as slot}
                <option value={slot.id} selected={slot.id === selectedSession.slotId}>{formatSlotLabel(slot)}</option>
              {/each}
            </select>
            <Input type="number" name="durationMinutes" placeholder="Duree (min)" min="0" value={selectedSession.durationMinutes ?? ""} />
            <Textarea name="feeling" placeholder="Ressenti" class="md:col-span-3" value={selectedSession.feeling ?? ""} />
            <div class="md:col-span-3 flex justify-end">
              <div class="flex items-center gap-2">
                <Button type="submit">Enregistrer</Button>
                {#if data.rootBypassEdit}
                  <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                    {adminBypassLabel}
                  </span>
                {/if}
              </div>
            </div>
          </form>
        {/if}

        <div class="space-y-2">
          <div class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Voies tentees</div>
          {#if selectedSession.attempts.length === 0}
            <div class="text-sm text-muted-foreground">Aucune voie enregistree.</div>
          {:else}
            <div class="space-y-2">
              {#each selectedSession.attempts as attempt}
                <div class="flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2">
                  <div class="text-sm">
                    <span class="font-medium">{attempt.route?.name ?? "Voie"}</span>
                    <span class="text-xs text-muted-foreground">({attempt.route?.relay} · {attempt.route?.color} · {attempt.route?.grade})</span>
                  </div>
                  <div class="text-xs text-muted-foreground">
                    {attempt.success ? "Reussi" : `Echec (${attempt.completion}%)`}
                  </div>
                  {#if data.canEditTarget}
                    <form
                      method="POST"
                      action="?/deleteAttempt"
                      use:enhance={keepModalFresh}
                      on:submit={(event) => {
                        if (!confirm("Supprimer cette tentative ?")) event.preventDefault();
                      }}
                      class="flex items-center gap-2"
                    >
                      <input type="hidden" name="attemptId" value={attempt.id} />
                      <Button type="submit" size="sm" variant="outline">Supprimer</Button>
                      {#if data.rootBypassEdit}
                        <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                          {adminBypassLabel}
                        </span>
                      {/if}
                    </form>
                  {/if}
                </div>
              {/each}
            </div>
          {/if}
        </div>

        {#if data.canEditTarget}
          <div class="pt-2">
            <div class="flex items-center gap-2">
              <Button type="button" size="sm" variant="outline" on:click={() => (addAttemptOpen = !addAttemptOpen)}>
                {addAttemptOpen ? "Fermer" : "Ajouter une voie"}
              </Button>
              {#if data.rootBypassEdit}
                <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                  {adminBypassLabel}
                </span>
              {/if}
            </div>

            {#if addAttemptOpen}
              <form method="POST" action="?/addAttempt" use:enhance={keepModalFresh} class="mt-3 grid gap-3 md:grid-cols-4">
                <input type="hidden" name="sessionId" value={selectedSession.id} />
                <input type="hidden" name="routeId" value={selectedRouteId} />
                <Input
                  placeholder="Rechercher (cotation, couleur, relais)"
                  bind:value={routeQuery}
                  class="md:col-span-4"
                />
                <div class="md:col-span-4">
                  <div class="rounded-md border bg-background max-h-48 overflow-y-auto">
                    {#if filteredRoutes.length === 0}
                      <div class="px-3 py-2 text-xs text-muted-foreground">Aucune voie trouvee.</div>
                    {:else}
                      {#each filteredRoutes as route}
                        <button
                          type="button"
                          class="w-full text-left px-3 py-2 text-sm hover:bg-muted/60"
                          on:click={() => {
                            selectedRouteId = route.id;
                            selectedRouteLabel = `${route.name} · ${route.relay} · ${route.color} · ${route.grade}`;
                          }}
                        >
                          {route.name} · {route.relay} · {route.color} · {route.grade}
                        </button>
                      {/each}
                    {/if}
                  </div>
                  {#if selectedRouteLabel}
                    <div class="mt-2 text-xs text-muted-foreground">Selection: {selectedRouteLabel}</div>
                  {/if}
                </div>
                <label class="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="success" class="h-4 w-4" />
                  Reussi
                </label>
                <Input type="number" name="completion" min="0" max="100" placeholder="Progression %" />
                <div class="md:col-span-4 flex justify-end">
                  <div class="flex items-center gap-2">
                    <Button type="submit" size="sm" disabled={!selectedRouteId}>Enregistrer</Button>
                    {#if data.rootBypassEdit}
                      <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                        {adminBypassLabel}
                      </span>
                    {/if}
                  </div>
                </div>
              </form>
            {/if}
          </div>
        {/if}
      </div>

      {#if data.canEditTarget}
        <form
          method="POST"
          action="?/deleteSession"
          class="border-t px-6 py-4 flex justify-end"
          on:submit={(event) => {
            if (!confirm("Supprimer cette seance ?")) event.preventDefault();
          }}
        >
          <div class="flex items-center gap-2">
            <input type="hidden" name="sessionId" value={selectedSession.id} />
            <Button type="submit" variant="destructive">Supprimer la seance</Button>
            {#if data.rootBypassEdit}
              <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                {adminBypassLabel}
              </span>
            {/if}
          </div>
        </form>
      {/if}
    </div>
  </div>
{/if}
