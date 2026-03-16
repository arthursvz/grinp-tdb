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
  import * as Table from "@/components/ui/table/";
  import SlotTable from "$lib/components/SlotTable.svelte";
  import UserTable from "$lib/components/UserTable.svelte";
  import { slots as slotsStore, users as usersStore } from "$lib/stores";

  export let data;

  $: ({
    currentUser,
    users,
    inventoryItems,
    events,
    meetings,
    financeEntries,
    slots: slotsData,
    stats,
    roles,
    actionKeys,
    actionLabels,
    actionMatrix,
    accessForUserActions,
    baseAccessForUserActions,
  } = data);

  // Ajout des labels betas dès l'initialisation
  if (typeof actionLabels === 'object' && actionLabels) {
    actionLabels["betas.edit"] = "Modifier les betas";
    actionLabels["betas.delete"] = "Supprimer les betas";
  }

  $: usersStore.set(users ?? []);
  $: slotsStore.set(slotsData ?? []);

  async function resetCotisantAS() {
    if (!confirm("Reinitialiser toutes les cotisations AS ?")) return;
    const res = await fetch(`/api/admin/reset_cotisant_as`, { method: "POST" });
    if (res.ok) window.location.reload();
  }

  async function resetCotisantGrinp() {
    if (!confirm("Reinitialiser toutes les cotisations Gr'INP ?")) return;
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
      a.download = `grinp_backup_${new Date().toISOString().split("T")[0]}.sql`;
      a.click();
    }
  }

  async function toggleGlobalAlert() {
    const msg = prompt("Message d'alerte global (laisser vide pour desactiver) :");
    if (msg === null) return;

    const res = await fetch(`/api/admin/alert`, {
      method: "POST",
      body: JSON.stringify({ message: msg, active: msg.length > 0 }),
    });

    if (res.ok) window.location.reload();
  }

  let meetingDialogOpen = false;
  let meetingEditMode = false;
  let meetingCanEdit = false;
  let meetingCanDelete = false;
  let addMeetingOpen = false;
  let meetingDraft = {
    id: "",
    title: "",
    date: "",
    attendees: "",
    minutes: "",
    fileUrl: "",
  };

  let materialDialogOpen = false;
  let addMaterialOpen = false;
  let materialEditMode = false;
  let materialDraft = {
    id: "",
    name: "",
    brand: "",
    status: "",
    quantity: 1,
    acquiredYear: "",
    manufacturedYear: "",
    expirationYear: "",
    notes: "",
    photoUrl: "",
  };

  const toDateInput = (dateValue: string | Date) => {
    const date = new Date(dateValue);
    return Number.isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
  };

  function openMeeting(meeting, canEdit = false, canDelete = false) {
    meetingDraft = {
      id: meeting.id,
      title: meeting.title ?? "",
      date: toDateInput(meeting.date),
      attendees: meeting.attendees ?? "",
      minutes: meeting.minutes ?? "",
      fileUrl: meeting.fileUrl ?? "",
    };
    meetingCanEdit = canEdit;
    meetingCanDelete = canDelete;
    meetingEditMode = canEdit;
    meetingDialogOpen = true;
  }

  function closeMeeting() {
    meetingDialogOpen = false;
    meetingEditMode = false;
    meetingCanEdit = false;
    meetingCanDelete = false;
  }

  function openMaterial(item) {
    materialDraft = {
      id: item.id,
      name: item.name ?? "",
      brand: item.brand ?? "",
      status: item.status ?? "",
      quantity: item.quantity ?? 1,
      acquiredYear: item.acquiredYear ? String(item.acquiredYear) : "",
      manufacturedYear: item.manufacturedYear ? String(item.manufacturedYear) : "",
      expirationYear: item.expirationYear ? String(item.expirationYear) : "",
      notes: item.notes ?? "",
      photoUrl: item.photoUrl ?? "",
    };
    materialEditMode = false;
    materialDialogOpen = true;
  }

  function closeMaterial() {
    materialDialogOpen = false;
  }

  function openFinance(entry, edit = false) {
    financeDraft = {
      id: entry.id,
      label: entry.label ?? "",
      amount: Number(entry.amount ?? 0),
      type: entry.type ?? "INCOME",
      category: entry.category ?? "",
      date: toDateInput(entry.date),
      notes: entry.notes ?? "",
      justificatifUrl: entry.justificatifUrl ?? "",
    };
    financeEditMode = edit;
    financeDialogOpen = true;
  }

  function closeFinance() {
    financeDialogOpen = false;
    financeEditMode = false;
  }

  let slotDialogOpen = false;
  let slotEditMode = false;
  let slotDraft = {
    id: "",
    name: "",
    description: "",
    capacity: 18,
    slot_type: "CRENEAU",
    date: "",
    starts_at: "",
    ends_at: "",
    owner: null,
    responsibles: [],
    attendees: [],
    participants: [],
  };

  const slotTypeOptions = [
    { value: "CRENEAU", label: "Creneau" },
    { value: "EVENEMENT", label: "Evenement" },
    { value: "FERMETURE", label: "Fermeture" },
  ];

  function openSlot(slot) {
    const startDate = new Date(slot.starts_at);
    const endDate = new Date(slot.ends_at);
    slotDraft = {
      id: slot.id,
      name: slot.name ?? "",
      description: slot.description ?? "",
      capacity: slot.capacity ?? 18,
      slot_type: slot.slot_type ?? "CRENEAU",
      date: startDate.toISOString().split("T")[0],
      starts_at: startDate.toISOString().slice(11, 16),
      ends_at: endDate.toISOString().slice(11, 16),
      owner: slot.owner ?? null,
      responsibles: slot.responsibles ?? [],
      attendees: slot.attendees ?? [],
      participants: slot.participants ?? [],
    };
    slotEditMode = false;
    slotDialogOpen = true;
  }

  function closeSlot() {
    slotDialogOpen = false;
  }

  async function deleteSlot() {
    if (!slotDraft.id) return;
    if (!confirm("Supprimer definitivement ce creneau ?")) return;
    const res = await fetch(`/api/slots/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slot_id: slotDraft.id }),
    });
    if (res.ok) {
      window.location.reload();
    }
  }

  async function saveSlot() {
    if (!slotDraft.id) return;
    if (!slotDraft.starts_at || !slotDraft.ends_at) return;

    const payload = {
      slot_id: slotDraft.id,
      today: slotDraft.date,
      form: {
        title: slotDraft.name,
        description: slotDraft.description,
        capacity: Number(slotDraft.capacity),
        slot_type: slotDraft.slot_type,
        date: { starts_at: slotDraft.starts_at, ends_at: slotDraft.ends_at },
      },
    };

    const res = await fetch(`/api/slots/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      window.location.reload();
    }
  }

  async function deleteMaterial() {
    if (!materialDraft.id) return;
    if (!confirm("Supprimer definitivement ce materiel ?")) return;

    const data = new FormData();
    data.set("id", materialDraft.id);

    const res = await fetch("?/deleteInventoryItem", {
      method: "POST",
      body: data,
    });

    if (res.ok) {
      window.location.reload();
    }
  }

  const labelForModule = (module: string) => {
    switch (module) {
      case "PRESIDENCE":
        return "Presidence";
      case "VICE_PRESIDENCE":
        return "Vice-Presidence";
      case "TRESORERIE":
        return "Tresorerie";
      case "SECRETAIRE":
        return "Secretaire";
      case "MATERIEL":
        return "Materiel";
      default:
        return module;
    }
  };

  const labelForRole = (role: string) => {
    switch (role) {
      case "BUREAU":
        return "Bureau";
      case "PRESIDENT":
        return "President";
      case "VICE_PRESIDENT":
        return "Vice-President";
      case "TRESORIER":
        return "Tresorier";
      case "SECRETAIRE":
        return "Secretaire";
      case "MATERIEL":
        return "Materiel";
      default:
        return role;
    }
  };

  let userRole = null;
  let isRoot = false;
  let isPresident = false;
  let isVicePresident = false;
  let isTreasurer = false;
  let isSecretary = false;
  let isMaterial = false;
  let isBureau = false;

  let showPresidentModule = false;
  let showViceModule = false;
  let showTreasuryModule = false;
  let showSecretaryModule = false;
  let showMaterialModule = false;

  let canEditMembersIdentity = false;
  let canEditMembersRoles = false;
  let canEditMembersCotisations = false;
  let canEditMembersInstructor = false;
  let canDeleteMembers = false;
  let canEditMembersVice = false;
  let canEditMembersTreasury = false;
  let canEditMembersSecretary = false;
  let canViewMembers = false;
  let canViewSlots = false;
  let canViewMeetings = false;
  let canViewInventory = false;
  let canViewFinance = false;
  let canViewBetas = false;
  let canViewLogs = false;
  let canCreateFinance = false;
  let canEditFinance = false;
  let canDeleteFinance = false;
  let canCreateInventory = false;
  let canEditInventory = false;
  let canDeleteInventory = false;
  let canCreateMeetings = false;
  let canEditMeetings = false;
  let canDeleteMeetings = false;
  let canEditSlotCapacity = false;
  let canEditSlotDetails = false;
  let canEditSlotResponsibles = false;
  let canEditSlotType = false;
  let canEditSlotAny = false;
  let canDeleteSlot = false;
  let canResetCotisations = false;
  let canEditAlert = false;
  let canExportDatabase = false;
  let canEditPermissions = false;

  $: userRole = currentUser?.bureau_role ?? null;
  $: isRoot = !!currentUser?.root;
  $: isPresident = userRole === "PRESIDENT";
  $: isVicePresident = userRole === "VICE_PRESIDENT";
  $: isTreasurer = userRole === "TRESORIER";
  $: isSecretary = userRole === "SECRETAIRE";
  $: isMaterial = userRole === "MATERIEL";
  $: isBureau = isRoot || !!currentUser?.bureau;

  $: showPresidentModule = isBureau;
  $: showViceModule = false;
  $: showTreasuryModule = false;
  $: showSecretaryModule = false;
  $: showMaterialModule = false;

  type ActionKey = string;
  let safeActionKeys: ActionKey[] = [];
  let safeRoles: string[] = [];
  let emptyAccessForUserActions: Record<ActionKey, "NONE" | "READ" | "WRITE"> = {};
  let emptyActionMatrix: Record<string, Record<ActionKey, "NONE" | "READ" | "WRITE">> = {};
  $: safeActionKeys = actionKeys ?? [];
  $: safeRoles = roles ?? [];
  $: emptyAccessForUserActions = safeActionKeys.reduce((acc, key) => {
    acc[key] = "NONE";
    return acc;
  }, {} as Record<ActionKey, "NONE" | "READ" | "WRITE">);
  $: emptyActionMatrix = safeRoles.reduce((acc, role) => {
    acc[role] = safeActionKeys.reduce((roleAcc, key) => {
      roleAcc[key] = "NONE";
      return roleAcc;
    }, {} as Record<ActionKey, "NONE" | "READ" | "WRITE">);
    return acc;
  }, {} as Record<string, Record<ActionKey, "NONE" | "READ" | "WRITE">>);
  let fullAccessForUserActions: Record<ActionKey, "NONE" | "READ" | "WRITE"> = {};
  $: fullAccessForUserActions = safeActionKeys.reduce((acc, key) => {
    acc[key] = "WRITE";
    return acc;
  }, {} as Record<ActionKey, "NONE" | "READ" | "WRITE">);
  let localAccessForUserActions = accessForUserActions ?? emptyAccessForUserActions;
  $: if (isRoot) {
    localAccessForUserActions = fullAccessForUserActions;
  } else if (accessForUserActions) {
    localAccessForUserActions = accessForUserActions;
  } else {
    localAccessForUserActions = emptyAccessForUserActions;
  }
  const canWriteAction = (action: ActionKey) =>
    isRoot || localAccessForUserActions?.[action] === "WRITE";
  const canViewAction = (action: ActionKey) => {
    if (isRoot) return true;
    const access = localAccessForUserActions?.[action];
    return access === "READ" || access === "WRITE";
  };

  const adminBypassLabel = "Admin bypass";
  const hasRequiredAccess = (access: "NONE" | "READ" | "WRITE", required: "READ" | "WRITE") =>
    required === "READ" ? access !== "NONE" : access === "WRITE";
  const isBypassAction = (action: ActionKey, required: "READ" | "WRITE" = "WRITE") =>
    isRoot && !hasRequiredAccess(baseAccessForUserActions?.[action] ?? "NONE", required);
  const bypassSlotDetails = isBypassAction("slots.edit.details");
  const bypassSlotCapacity = isBypassAction("slots.edit.capacity");
  const bypassSlotResponsibles = isBypassAction("slots.edit.responsibles");
  const bypassSlotType = isBypassAction("slots.edit.type");
  const bypassSlotDelete = isRoot;
  const bypassMeetingsCreate = isBypassAction("meetings.create");
  const bypassMeetingsEdit = isBypassAction("meetings.edit");
  const bypassMeetingsDelete = isBypassAction("meetings.delete");
  const bypassInventoryCreate = isBypassAction("inventory.create");
  const bypassInventoryEdit = isBypassAction("inventory.edit");
  const bypassInventoryDelete = isBypassAction("inventory.delete");
  const bypassFinanceCreate = isBypassAction("finance.create");
  const bypassFinanceEdit = isBypassAction("finance.edit");
  const bypassFinanceDelete = isBypassAction("finance.delete");
  const showSlotEditBypass =
    bypassSlotDetails || bypassSlotCapacity || bypassSlotResponsibles || bypassSlotType;
  const showSlotDeleteBypass = bypassSlotDelete;
  const bypassMembersIdentity = isBypassAction("members.edit.identity");
  const bypassMembersRoles = isBypassAction("members.edit.roles");
  const bypassMembersCotisations = isBypassAction("members.edit.cotisations");
  const bypassMembersInstructor = isBypassAction("members.edit.instructor");
  const bypassMembersDelete = isBypassAction("members.delete");

  $: canViewMembers = isRoot || canViewAction("view.members");
  $: canViewSlots = isRoot || canViewAction("view.slots");
  $: canViewMeetings = isRoot || canViewAction("view.meetings");
  $: canViewInventory = isRoot || canViewAction("view.inventory");
  $: canViewFinance = isRoot || canViewAction("view.finance");
  $: canViewBetas = isRoot || canViewAction("view.betas");
  $: canViewLogs = isRoot || canViewAction("view.logs");

  $: canCreateFinance = isRoot || canWriteAction("finance.create");
  $: canEditFinance = isRoot || canWriteAction("finance.edit");
  $: canDeleteFinance = isRoot || canWriteAction("finance.delete");
  $: canCreateInventory = isRoot || canWriteAction("inventory.create");
  $: canEditInventory = isRoot || canWriteAction("inventory.edit");
  $: canDeleteInventory = isRoot || canWriteAction("inventory.delete");
  $: canCreateMeetings = isRoot || canWriteAction("meetings.create");
  $: canEditMeetings = isRoot || canWriteAction("meetings.edit");
  $: canDeleteMeetings = isRoot || canWriteAction("meetings.delete");
  $: canEditSlotCapacity = isRoot || canWriteAction("slots.edit.capacity");
  $: canEditSlotDetails = isRoot || canWriteAction("slots.edit.details");
  $: canEditSlotResponsibles = isRoot || canWriteAction("slots.edit.responsibles");
  $: canEditSlotType = isRoot || canWriteAction("slots.edit.type");
  $: canEditSlotAny = canEditSlotCapacity || canEditSlotDetails || canEditSlotResponsibles || canEditSlotType;
  $: canDeleteSlot = isRoot;

  $: canEditMembersIdentity = isRoot || canWriteAction("members.edit.identity");
  $: canEditMembersCotisations = isRoot || canWriteAction("members.edit.cotisations");
  $: canEditMembersInstructor = isRoot || canWriteAction("members.edit.instructor");
  $: canEditMembersRoles = isRoot || canWriteAction("members.edit.roles");
  $: canDeleteMembers = isRoot || canWriteAction("members.delete");

  $: canResetCotisations = isRoot || canWriteAction("cotisations.reset");
  $: canEditAlert = isRoot || canWriteAction("alerts.edit");
  $: canExportDatabase = isRoot || canWriteAction("database.export");
  $: canEditPermissions = isRoot;

  let permissionsDialogOpen = false;
  let localActionMatrix = actionMatrix ?? emptyActionMatrix;
  let baselineActionMatrix = actionMatrix ?? emptyActionMatrix;
  let pendingPermissionChanges = {};
  $: if (actionMatrix) {
    localActionMatrix = JSON.parse(JSON.stringify(actionMatrix));
    baselineActionMatrix = JSON.parse(JSON.stringify(actionMatrix));
    pendingPermissionChanges = {};
  } else {
    localActionMatrix = JSON.parse(JSON.stringify(emptyActionMatrix));
    baselineActionMatrix = JSON.parse(JSON.stringify(emptyActionMatrix));
    pendingPermissionChanges = {};
  }
  const permissionGroups = [
    {
      key: "visibility",
      title: "Visibilite",
      description: "Ce que chaque role peut consulter.",
      actions: [
        "view.members",
        "view.slots",
        "view.meetings",
        "view.inventory",
        "view.finance",
        "view.betas",
        "view.logs",
      ],
    },
    {
      key: "betas",
      title: "Betas",
      description: "Gestion des betas (modification, suppression).",
      actions: ["betas.edit", "betas.delete"],
    },
    {
      key: "history",
      title: "Historique",
      description: "Acces et edition des historiques de pratique.",
      actions: ["history.view", "history.edit", "history.routes.edit"],
    },
    {
      key: "members",
      title: "Membres",
      description: "Actions sur les profils et roles.",
      actions: [
        "members.edit.identity",
        "members.edit.cotisations",
        "members.edit.instructor",
        "members.edit.roles",
        "members.delete",
      ],
    },
    {
      key: "slots",
      title: "Creneaux",
      description: "Gestion des creneaux et responsables.",
      actions: [
        "slots.edit.details",
        "slots.edit.capacity",
        "slots.edit.responsibles",
        "slots.edit.type",
      ],
    },
    {
      key: "meetings",
      title: "Reunions",
      description: "Ajouts et edition des comptes rendus.",
      actions: ["meetings.create", "meetings.edit", "meetings.delete"],
    },
    {
      key: "inventory",
      title: "Inventaire",
      description: "Ajouts et edition du materiel.",
      actions: ["inventory.create", "inventory.edit", "inventory.delete"],
    },
    {
      key: "finance",
      title: "Finances",
      description: "Ajouts et edition des flux d'argent.",
      actions: ["finance.create", "finance.edit", "finance.delete"],
    },
    {
      key: "admin",
      title: "Administration",
      description: "Actions sensibles et maintenance.",
      actions: ["cotisations.reset", "alerts.edit", "database.export", "permissions.edit"],
    },
  ];
  // Ajout des labels pour les permissions betas si actionLabels existe
  if (typeof actionLabels === 'object' && actionLabels) {
    actionLabels["betas.edit"] = "Modifier les betas";
    actionLabels["betas.delete"] = "Supprimer les betas";
  }

  const getPermissionButtonClass = (enabled, dirty) =>
    [
      "w-full rounded-md border px-2 py-1 text-xs font-semibold transition",
      enabled
        ? "border-emerald-400/70 bg-emerald-500/15 text-emerald-700"
        : "border-border bg-muted/60 text-muted-foreground",
      dirty ? "border-amber-400 ring-1 ring-amber-400/60" : "",
      canEditPermissions ? "hover:border-emerald-400" : "opacity-60 cursor-not-allowed",
    ].join(" ");

  function closePermissionsDialog() {
    permissionsDialogOpen = false;
    localActionMatrix = JSON.parse(JSON.stringify(baselineActionMatrix));
    pendingPermissionChanges = {};
  }

  function setActionPermission(role, action, access) {
    if (!canEditPermissions) return;
    localActionMatrix = {
      ...localActionMatrix,
      [role]: { ...(localActionMatrix?.[role] ?? {}), [action]: access },
    };

    const baselineAccess = baselineActionMatrix?.[role]?.[action];
    const changeKey = `${role}::${action}`;
    if (baselineAccess === access) {
      const { [changeKey]: _, ...rest } = pendingPermissionChanges;
      pendingPermissionChanges = rest;
    } else {
      pendingPermissionChanges = {
        ...pendingPermissionChanges,
        [changeKey]: { role, action, access },
      };
    }
  }


  async function savePermissionChanges() {
    const changes = Object.values(pendingPermissionChanges);
    if (changes.length === 0) {
      permissionsDialogOpen = false;
      return;
    }

    const summary = changes
      .map((change) => {
        const label = change.access === "NONE" ? "Non" : "Oui";
        return `${labelForRole(change.role)}: ${actionLabels[change.action]} -> ${label}`;
      })
      .join("\n");

    if (!confirm(`Confirmer les modifications ?\n\n${summary}`)) return;

    for (const change of changes) {
      const payload = new FormData();
      payload.set("role", change.role);
      payload.set("action", change.action);
      payload.set("access", change.access);
      const res = await fetch("?/updateActionPermission", {
        method: "POST",
        body: payload,
      });

      if (!res.ok) {
        alert("Impossible d'enregistrer les permissions.");
        return;
      }

      if (currentUser?.bureau_role === change.role) {
        localAccessForUserActions = {
          ...localAccessForUserActions,
          [change.action]: change.access,
        };
      }
    }

    baselineActionMatrix = JSON.parse(JSON.stringify(localActionMatrix));
    pendingPermissionChanges = {};
    permissionsDialogOpen = false;
  }

  let addFinanceOpen = false;
  let financeDialogOpen = false;
  let financeEditMode = false;
  let financeDraft = {
    id: "",
    label: "",
    amount: 0,
    type: "INCOME",
    category: "",
    date: "",
    notes: "",
    justificatifUrl: "",
  };

  const normalizeText = (value: string | number | null | undefined) =>
    String(value ?? "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const renderMarkdown = (value: string) => {
    if (!value) return "";
    let output = escapeHtml(value);
    output = output.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    output = output.replace(/__(.+?)__/g, "<strong>$1</strong>");
    output = output.replace(/\*(.+?)\*/g, "<em>$1</em>");
    output = output.replace(/_(.+?)_/g, "<em>$1</em>");
    output = output.replace(/`(.+?)`/g, "<code>$1</code>");
    output = output.replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
    output = output.replace(/\n/g, "<br />");
    return output;
  };

  const formatUserName = (user) => `${user.first_name} ${user.last_name}`;
  const formatUserList = (list) => (list?.length ? list.map(formatUserName).join(", ") : "-");

  const isImageUrl = (value: string | null | undefined) =>
    !!value && /\.(png|jpe?g|gif|webp)(\?.*)?$/i.test(value);

  const filterMeetings = (query: string) => {
    if (!query.trim()) return meetings ?? [];
    const lowered = normalizeText(query);
    return (meetings ?? []).filter((meeting) => {
      const haystack = normalizeText([
        meeting.title,
        meeting.attendees,
        meeting.minutes,
        meeting.fileUrl,
        new Date(meeting.date).toLocaleDateString("fr-FR"),
      ].join(" "));
      return haystack.includes(lowered);
    });
  };

  const filterInventory = (query: string) => {
    if (!query.trim()) return inventoryItems ?? [];
    const lowered = normalizeText(query);
    return (inventoryItems ?? []).filter((item) => {
      const haystack = normalizeText([
        item.name,
        item.brand,
        item.status,
        item.quantity,
        item.expirationYear,
        item.photoUrl ? "photo" : "",
      ].join(" "));
      return haystack.includes(lowered);
    });
  };

  const filterFinance = (query: string) => {
    if (!query.trim()) return financeEntries ?? [];
    const lowered = normalizeText(query);
    return (financeEntries ?? []).filter((entry) => {
      const haystack = normalizeText([
        entry.label,
        entry.type,
        entry.amount,
        entry.category,
        entry.notes,
        entry.justificatifUrl,
        new Date(entry.date).toLocaleDateString("fr-FR"),
      ].join(" "));
      return haystack.includes(lowered);
    });
  };

  let meetingQueryPresident = "";
  let meetingQuerySecretary = "";
  let meetingQueryMaterial = "";
  let meetingQueryTreasury = "";
  let meetingQueryVice = "";

  let inventoryQueryPresident = "";
  let inventoryQueryMaterial = "";
  let inventoryQueryTreasury = "";
  let inventoryQueryVice = "";

  let financeQueryPresident = "";
  let financeQueryTreasury = "";

  $: filteredMeetingsPresident = filterMeetings(meetingQueryPresident);
  $: filteredMeetingsSecretary = filterMeetings(meetingQuerySecretary);
  $: filteredMeetingsMaterial = filterMeetings(meetingQueryMaterial);
  $: filteredMeetingsTreasury = filterMeetings(meetingQueryTreasury);
  $: filteredMeetingsVice = filterMeetings(meetingQueryVice);

  $: filteredInventoryPresident = filterInventory(inventoryQueryPresident);
  $: filteredInventoryMaterial = filterInventory(inventoryQueryMaterial);
  $: filteredInventoryTreasury = filterInventory(inventoryQueryTreasury);
  $: filteredInventoryVice = filterInventory(inventoryQueryVice);

  $: filteredFinancePresident = filterFinance(financeQueryPresident);
  $: filteredFinanceTreasury = filterFinance(financeQueryTreasury);
</script>

<div class="max-w-6xl mx-auto py-6 sm:py-10 px-2 sm:px-4 space-y-10">
  <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-8">
    <div>
      <h1 class="text-4xl font-black italic uppercase tracking-tighter">Gestion du club</h1>
      <p class="text-muted-foreground">Outils de gestion internes pour le bureau.</p>
    </div>
    {#if canEditPermissions}
      <div class="flex items-center gap-2">
        <Button type="button" variant="outline" on:click={() => (permissionsDialogOpen = true)}>
          Modifier les permissions
        </Button>
        {#if isBypassAction("permissions.edit")}
          <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
            {adminBypassLabel}
          </span>
        {/if}
      </div>
    {/if}
  </div>

  {#if showPresidentModule}
    <div class="space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {#if canViewBetas}
            <Card>
              <CardHeader class="pb-2">
                <CardTitle class="text-lg flex items-center gap-2">💡 Betas du jour</CardTitle>
                <CardDescription>Messages d'accueil</CardDescription>
              </CardHeader>
              <CardContent>
                <div class="text-3xl font-black">{stats?.betasCount || 0}</div>
                <p class="text-xs text-muted-foreground uppercase tracking-widest mt-1">Phrases en rotation</p>
                <div class="mt-4 flex flex-wrap gap-2">
                  <div class="flex flex-1 items-center gap-2">
                    <Button href="/admin/betas" variant="outline" size="sm" class="flex-1">Voir betas</Button>
                    {#if isBypassAction("view.betas", "READ")}
                      <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                        {adminBypassLabel}
                      </span>
                    {/if}
                  </div>
                </div>
              </CardContent>
            </Card>
          {/if}

          {#if canViewMembers}
            <Card>
              <CardHeader class="pb-2">
                <CardTitle class="text-lg flex items-center gap-2">👥 Communaute</CardTitle>
                <CardDescription>Etat des effectifs</CardDescription>
              </CardHeader>
              <CardContent>
                <div class="text-3xl font-black">{stats?.totalMembers || 0}</div>
                <p class="text-xs text-muted-foreground uppercase tracking-widest mt-1">Grimpeurs inscrits</p>
              </CardContent>
            </Card>
          {/if}

          {#if canExportDatabase || canEditAlert || canResetCotisations || canViewLogs}
            <Card>
              <CardHeader class="pb-2">
                <CardTitle class="text-lg flex items-center gap-2">🛠️ Maintenance</CardTitle>
                <CardDescription>Actions rapides</CardDescription>
              </CardHeader>
              <CardContent class="flex flex-wrap gap-2">
                {#if canExportDatabase}
                  <div class="flex flex-1 items-center gap-2">
                    <Button on:click={downloadDatabase} variant="outline" size="sm" class="flex-1">Exporter la DB</Button>
                    {#if isBypassAction("database.export")}
                      <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                        {adminBypassLabel}
                      </span>
                    {/if}
                  </div>
                {/if}
                {#if canEditAlert}
                  <div class="flex flex-1 items-center gap-2">
                    <Button on:click={toggleGlobalAlert} variant="destructive" size="sm" class="flex-1">Alerte site</Button>
                    {#if isBypassAction("alerts.edit")}
                      <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                        {adminBypassLabel}
                      </span>
                    {/if}
                  </div>
                {/if}
                {#if canResetCotisations}
                  <div class="flex flex-1 items-center gap-2">
                    <Button on:click={resetCotisantAS} variant="secondary" size="sm" class="flex-1">Reset AS</Button>
                    {#if isBypassAction("cotisations.reset")}
                      <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                        {adminBypassLabel}
                      </span>
                    {/if}
                  </div>
                  <div class="flex flex-1 items-center gap-2">
                    <Button on:click={resetCotisantGrinp} variant="secondary" size="sm" class="flex-1">Reset Club</Button>
                    {#if isBypassAction("cotisations.reset")}
                      <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                        {adminBypassLabel}
                      </span>
                    {/if}
                  </div>
                {/if}
                {#if canViewLogs}
                  <div class="flex flex-1 items-center gap-2">
                    <Button href="/admin/logs" variant="outline" size="sm" class="flex-1">Voir logs</Button>
                    {#if isBypassAction("view.logs", "READ")}
                      <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                        {adminBypassLabel}
                      </span>
                    {/if}
                  </div>
                {/if}
              </CardContent>
            </Card>
          {/if}
        </div>

        {#if canViewSlots}
          <details class="group bg-card border rounded-xl overflow-hidden">
            <summary class="list-none p-4 sm:p-6 cursor-pointer flex justify-between items-center hover:bg-muted/50 transition-colors">
              <div>
                <div class="flex items-center gap-2">
                  <h2 class="text-xl font-bold tracking-tight">Creneaux</h2>
                  {#if isBypassAction("view.slots", "READ")}
                    <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                      {adminBypassLabel}
                    </span>
                  {/if}
                </div>
                <p class="text-xs text-muted-foreground">Planification et responsables.</p>
              </div>
              <span class="text-muted-foreground transition-transform group-open:rotate-180">v</span>
            </summary>
            <div class="p-4 sm:p-6 border-t bg-background/50">
              <SlotTable
                slots={slotsStore}
                users={usersStore}
                canWrite={canEditSlotAny}
                canEditDetails={canEditSlotDetails}
                canEditCapacity={canEditSlotCapacity}
                canEditResponsibles={canEditSlotResponsibles}
                canEditType={canEditSlotType}
                canDelete={canDeleteSlot}
                rootBypassEditDetails={bypassSlotDetails}
                rootBypassEditCapacity={bypassSlotCapacity}
                rootBypassEditResponsibles={bypassSlotResponsibles}
                rootBypassEditType={bypassSlotType}
                rootBypassDelete={bypassSlotDelete}
              />
            </div>
          </details>
        {/if}

        {#if canViewMembers}
          <details class="group bg-card border rounded-xl overflow-hidden">
            <summary class="list-none p-4 sm:p-6 cursor-pointer flex justify-between items-center hover:bg-muted/50 transition-colors">
              <div>
                <div class="flex items-center gap-2">
                  <h2 class="text-xl font-bold tracking-tight">Membres</h2>
                  {#if isBypassAction("view.members", "READ")}
                    <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                      {adminBypassLabel}
                    </span>
                  {/if}
                </div>
                <p class="text-xs text-muted-foreground">Annuaire et profils.</p>
              </div>
              <span class="text-muted-foreground transition-transform group-open:rotate-180">v</span>
            </summary>
            <div class="p-4 sm:p-6 border-t bg-background/50">
              <UserTable
                users={usersStore}
                mode="full"
                readonly={!canViewMembers}
                showRoot={isRoot}
                isRootUser={isRoot}
                canEditIdentity={canEditMembersIdentity}
                canEditRoles={canEditMembersRoles}
                canEditCotisations={canEditMembersCotisations}
                canEditInstructor={canEditMembersInstructor}
                canDeleteMembers={canDeleteMembers}
                rootBypassIdentity={bypassMembersIdentity}
                rootBypassRoles={bypassMembersRoles}
                rootBypassCotisations={bypassMembersCotisations}
                rootBypassInstructor={bypassMembersInstructor}
                rootBypassDelete={bypassMembersDelete}
              />
            </div>
          </details>
        {/if}

        {#if canViewMeetings}
          <details class="group bg-card border rounded-xl overflow-hidden">
            <summary class="list-none p-4 sm:p-6 cursor-pointer flex justify-between items-center hover:bg-muted/50 transition-colors">
              <div>
                <div class="flex items-center gap-2">
                  <h2 class="text-xl font-bold tracking-tight">Compte-rendus</h2>
                  {#if isBypassAction("view.meetings", "READ")}
                    <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                      {adminBypassLabel}
                    </span>
                  {/if}
                </div>
                <p class="text-xs text-muted-foreground">Gestion des reunions.</p>
              </div>
              <span class="text-muted-foreground transition-transform group-open:rotate-180">v</span>
            </summary>
            <div class="p-4 sm:p-6 border-t bg-background/50 space-y-4">
              {#if canCreateMeetings}
                <div class="flex justify-end">
                  <div class="flex items-center gap-2">
                    <Button type="button" on:click={() => (addMeetingOpen = true)}>Ajouter</Button>
                    {#if bypassMeetingsCreate}
                      <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                        {adminBypassLabel}
                      </span>
                    {/if}
                  </div>
                </div>
              {/if}

              <div class="flex items-center justify-between gap-4 pb-3">
                <h3 class="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Liste</h3>
                <Input
                  type="text"
                  placeholder="Rechercher par titre, presents ou notes..."
                  bind:value={meetingQueryPresident}
                  class="max-w-xs"
                />
              </div>
              <div class="overflow-x-auto border rounded-lg">
                <div class="max-h-[30rem] overflow-y-auto">
                  <Table.Root>
                    <Table.Header class="sticky top-0 bg-background z-10">
                      <Table.Row>
                        <Table.Head class="py-2 pr-4">Titre</Table.Head>
                        <Table.Head class="py-2 pr-4">Date</Table.Head>
                        <Table.Head class="py-2 pr-4">Presents</Table.Head>
                        <Table.Head class="py-2 pr-4">Compte-rendu</Table.Head>
                        <Table.Head class="py-2 pr-4">Fichier</Table.Head>
                        <Table.Head class="py-2 pr-4"></Table.Head>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {#each filteredMeetingsPresident as meeting}
                        <Table.Row>
                          <Table.Cell class="py-2 pr-4 font-medium">{meeting.title}</Table.Cell>
                          <Table.Cell class="py-2 pr-4">{new Date(meeting.date).toLocaleDateString("fr-FR")}</Table.Cell>
                          <Table.Cell class="py-2 pr-4">{meeting.attendees ?? "-"}</Table.Cell>
                          <Table.Cell class="py-2 pr-4">
                            {#if meeting.minutes}
                              <div class="prose prose-sm max-w-none">
                                {@html renderMarkdown(meeting.minutes)}
                              </div>
                            {:else}
                              -
                            {/if}
                          </Table.Cell>
                          <Table.Cell class="py-2 pr-4">
                            {#if meeting.fileUrl}
                              <a href={meeting.fileUrl} class="text-primary underline" target="_blank" rel="noreferrer">Lien</a>
                            {:else}
                              -
                            {/if}
                          </Table.Cell>
                          <Table.Cell class="py-2 pr-4">
                            <div class="flex items-center gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                on:click={() => openMeeting(meeting, canEditMeetings, canDeleteMeetings)}
                              >Voir</Button>
                            </div>
                          </Table.Cell>
                        </Table.Row>
                      {/each}
                    </Table.Body>
                  </Table.Root>
                </div>
              </div>
            </div>
          </details>
        {/if}

        {#if canViewInventory}
          <details class="group bg-card border rounded-xl overflow-hidden">
            <summary class="list-none p-4 sm:p-6 cursor-pointer flex justify-between items-center hover:bg-muted/50 transition-colors">
              <div>
                <div class="flex items-center gap-2">
                  <h2 class="text-xl font-bold tracking-tight">Inventaire</h2>
                  {#if isBypassAction("view.inventory", "READ")}
                    <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                      {adminBypassLabel}
                    </span>
                  {/if}
                </div>
                <p class="text-xs text-muted-foreground">Gestion du materiel.</p>
              </div>
              <span class="text-muted-foreground transition-transform group-open:rotate-180">v</span>
            </summary>
            <div class="p-4 sm:p-6 border-t bg-background/50 space-y-4">
              {#if canCreateInventory}
                <div class="flex justify-end">
                  <div class="flex items-center gap-2">
                    <Button type="button" on:click={() => (addMaterialOpen = true)}>Ajouter</Button>
                    {#if bypassInventoryCreate}
                      <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                        {adminBypassLabel}
                      </span>
                    {/if}
                  </div>
                </div>
              {/if}
              <div class="flex items-center justify-between gap-4 pb-3">
                <h3 class="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Liste</h3>
                <Input
                  type="text"
                  placeholder="Rechercher sur tous les champs..."
                  bind:value={inventoryQueryPresident}
                  class="max-w-xs"
                />
              </div>

              <div class="overflow-x-auto border rounded-lg">
                <div class="max-h-[30rem] overflow-y-auto">
                  <Table.Root>
                    <Table.Header class="sticky top-0 bg-background z-10">
                      <Table.Row>
                        <Table.Head class="py-2 pr-4">Nom</Table.Head>
                        <Table.Head class="py-2 pr-4">Marque</Table.Head>
                        <Table.Head class="py-2 pr-4">Etat</Table.Head>
                        <Table.Head class="py-2 pr-4">Quantite</Table.Head>
                        <Table.Head class="py-2 pr-4">Expiration</Table.Head>
                        <Table.Head class="py-2 pr-4">Photo</Table.Head>
                        <Table.Head class="py-2 pr-4"></Table.Head>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {#each filteredInventoryPresident as item}
                        <Table.Row>
                          <Table.Cell class="py-2 pr-4 font-medium">{item.name}</Table.Cell>
                          <Table.Cell class="py-2 pr-4">{item.brand ?? "-"}</Table.Cell>
                          <Table.Cell class="py-2 pr-4">{item.status ?? "-"}</Table.Cell>
                          <Table.Cell class="py-2 pr-4">{item.quantity}</Table.Cell>
                          <Table.Cell class="py-2 pr-4">{item.expirationYear ?? "-"}</Table.Cell>
                          <Table.Cell class="py-2 pr-4">
                            {#if item.photoUrl}
                              <img
                                src={item.photoUrl}
                                alt="Photo materiel"
                                class="h-8 w-8 rounded border object-cover"
                              />
                            {:else}
                              -
                            {/if}
                          </Table.Cell>
                          <Table.Cell class="py-2 pr-4">
                            <Button type="button" size="sm" variant="secondary" on:click={() => openMaterial(item)}>Voir</Button>
                          </Table.Cell>
                        </Table.Row>
                      {/each}
                    </Table.Body>
                  </Table.Root>
                </div>
              </div>
            </div>
          </details>
        {/if}

        {#if canViewFinance}
          <details class="group bg-card border rounded-xl overflow-hidden">
            <summary class="list-none p-4 sm:p-6 cursor-pointer flex justify-between items-center hover:bg-muted/50 transition-colors">
              <div>
                <div class="flex items-center gap-2">
                  <h2 class="text-xl font-bold tracking-tight">Flux d'argent</h2>
                  {#if isBypassAction("view.finance", "READ")}
                    <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                      {adminBypassLabel}
                    </span>
                  {/if}
                </div>
                <p class="text-xs text-muted-foreground">Suivi des entrees et sorties.</p>
              </div>
              <span class="text-muted-foreground transition-transform group-open:rotate-180">v</span>
            </summary>
            <div class="p-4 sm:p-6 border-t bg-background/50 space-y-4">
              {#if canCreateFinance}
                <div class="flex justify-end">
                  <div class="flex items-center gap-2">
                    <Button type="button" on:click={() => (addFinanceOpen = true)}>Ajouter</Button>
                    {#if bypassFinanceCreate}
                      <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                        {adminBypassLabel}
                      </span>
                    {/if}
                  </div>
                </div>
              {/if}
              <div class="flex items-center justify-between gap-4 pb-3">
                <h3 class="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Liste</h3>
                <Input
                  type="text"
                  placeholder="Rechercher sur tous les champs..."
                  bind:value={financeQueryPresident}
                  class="max-w-xs"
                />
              </div>

              <div class="overflow-x-auto border rounded-lg">
                <div class="max-h-[30rem] overflow-y-auto">
                  <Table.Root>
                    <Table.Header class="sticky top-0 bg-background z-10">
                      <Table.Row>
                        <Table.Head class="py-2 pr-4">Libelle</Table.Head>
                        <Table.Head class="py-2 pr-4">Type</Table.Head>
                        <Table.Head class="py-2 pr-4">Montant</Table.Head>
                        <Table.Head class="py-2 pr-4">Date</Table.Head>
                        <Table.Head class="py-2 pr-4">Categorie</Table.Head>
                        <Table.Head class="py-2 pr-4">Notes</Table.Head>
                        <Table.Head class="py-2 pr-4">Justificatif</Table.Head>
                        <Table.Head class="py-2 pr-4"></Table.Head>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {#each filteredFinancePresident as entry}
                        <Table.Row>
                          <Table.Cell class="py-2 pr-4 font-medium">{entry.label}</Table.Cell>
                          <Table.Cell class="py-2 pr-4">{entry.type}</Table.Cell>
                          <Table.Cell class="py-2 pr-4">{entry.amount}</Table.Cell>
                          <Table.Cell class="py-2 pr-4">{new Date(entry.date).toLocaleDateString("fr-FR")}</Table.Cell>
                          <Table.Cell class="py-2 pr-4">{entry.category ?? "-"}</Table.Cell>
                          <Table.Cell class="py-2 pr-4">{entry.notes ?? "-"}</Table.Cell>
                          <Table.Cell class="py-2 pr-4">
                            {#if entry.justificatifUrl}
                              {#if isImageUrl(entry.justificatifUrl)}
                                <img
                                  src={entry.justificatifUrl}
                                  alt="Justificatif"
                                  class="h-8 w-8 rounded border object-cover"
                                />
                              {:else}
                                <a href={entry.justificatifUrl} class="text-primary underline" target="_blank" rel="noreferrer">Voir</a>
                              {/if}
                            {:else}
                              -
                            {/if}
                          </Table.Cell>
                          <Table.Cell class="py-2 pr-4">
                            <div class="flex items-center gap-2">
                              <Button type="button" size="sm" variant="secondary" on:click={() => openFinance(entry)}>Voir</Button>
                              {#if canEditFinance}
                                <div class="flex items-center gap-2">
                                  <Button type="button" size="sm" variant="outline" on:click={() => openFinance(entry, true)}>Modifier</Button>
                                  {#if bypassFinanceEdit}
                                    <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                                      {adminBypassLabel}
                                    </span>
                                  {/if}
                                </div>
                              {/if}
                            </div>
                          </Table.Cell>
                        </Table.Row>
                      {/each}
                    </Table.Body>
                  </Table.Root>
                </div>
              </div>
            </div>
          </details>
        {/if}
      </div>
  {/if}

  {#if showMaterialModule}
    <details class="group bg-card border rounded-xl overflow-hidden">
      <summary class="list-none p-4 sm:p-6 cursor-pointer flex justify-between items-center hover:bg-muted/50 transition-colors">
        <h2 class="text-xl font-bold tracking-tight">Responsable Materiel</h2>
        <span class="text-muted-foreground transition-transform group-open:rotate-180">v</span>
      </summary>
      <div class="p-4 sm:p-6 border-t bg-background/50 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Inventaire</CardTitle>
            <CardDescription>Suivi du materiel.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            {#if canEditInventory}
              <div class="flex justify-end">
                <div class="flex items-center gap-2">
                  <Button type="button" on:click={() => (addMaterialOpen = true)}>Ajouter</Button>
                  {#if bypassInventoryCreate}
                    <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                      {adminBypassLabel}
                    </span>
                  {/if}
                </div>
              </div>
            {/if}
            <div class="flex items-center justify-between gap-4 pb-3">
              <h3 class="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Liste</h3>
              <Input
                type="text"
                placeholder="Rechercher sur tous les champs..."
                bind:value={inventoryQueryMaterial}
                class="max-w-xs"
              />
            </div>

            <div class="overflow-x-auto border rounded-lg">
              <div class="max-h-[30rem] overflow-y-auto">
                <Table.Root>
                  <Table.Header class="sticky top-0 bg-background z-10">
                    <Table.Row>
                      <Table.Head class="py-2 pr-4">Nom</Table.Head>
                      <Table.Head class="py-2 pr-4">Marque</Table.Head>
                      <Table.Head class="py-2 pr-4">Etat</Table.Head>
                      <Table.Head class="py-2 pr-4">Quantite</Table.Head>
                      <Table.Head class="py-2 pr-4">Expiration</Table.Head>
                      <Table.Head class="py-2 pr-4">Photo</Table.Head>
                      <Table.Head class="py-2 pr-4"></Table.Head>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {#each filteredInventoryMaterial as item}
                      <Table.Row>
                        <Table.Cell class="py-2 pr-4 font-medium">{item.name}</Table.Cell>
                        <Table.Cell class="py-2 pr-4">{item.brand ?? "-"}</Table.Cell>
                        <Table.Cell class="py-2 pr-4">{item.status ?? "-"}</Table.Cell>
                        <Table.Cell class="py-2 pr-4">{item.quantity}</Table.Cell>
                        <Table.Cell class="py-2 pr-4">{item.expirationYear ?? "-"}</Table.Cell>
                        <Table.Cell class="py-2 pr-4">
                          {#if item.photoUrl}
                            <img
                              src={item.photoUrl}
                              alt="Photo materiel"
                              class="h-8 w-8 rounded border object-cover"
                            />
                          {:else}
                            -
                          {/if}
                        </Table.Cell>
                        <Table.Cell class="py-2 pr-4">
                          <Button type="button" size="sm" variant="secondary" on:click={() => openMaterial(item)}>Voir</Button>
                        </Table.Cell>
                      </Table.Row>
                    {/each}
                  </Table.Body>
                </Table.Root>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compte-rendus</CardTitle>
            <CardDescription>Lecture seule.</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex items-center justify-between gap-4 pb-3">
              <h3 class="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Liste</h3>
              <Input
                type="text"
                placeholder="Rechercher par titre, presents ou notes..."
                bind:value={meetingQueryMaterial}
                class="max-w-xs"
              />
            </div>
            <div class="overflow-x-auto border rounded-lg">
              <div class="max-h-[30rem] overflow-y-auto">
                <Table.Root>
                  <Table.Header class="sticky top-0 bg-background z-10">
                    <Table.Row>
                      <Table.Head class="py-2 pr-4">Titre</Table.Head>
                      <Table.Head class="py-2 pr-4">Date</Table.Head>
                      <Table.Head class="py-2 pr-4">Presents</Table.Head>
                      <Table.Head class="py-2 pr-4">Compte-rendu</Table.Head>
                      <Table.Head class="py-2 pr-4">Fichier</Table.Head>
                      <Table.Head class="py-2 pr-4"></Table.Head>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {#each filteredMeetingsMaterial as meeting}
                      <Table.Row>
                        <Table.Cell class="py-2 pr-4 font-medium">{meeting.title}</Table.Cell>
                        <Table.Cell class="py-2 pr-4">{new Date(meeting.date).toLocaleDateString("fr-FR")}</Table.Cell>
                        <Table.Cell class="py-2 pr-4">{meeting.attendees ?? "-"}</Table.Cell>
                        <Table.Cell class="py-2 pr-4">
                          {#if meeting.minutes}
                            <div class="prose prose-sm max-w-none">
                              {@html renderMarkdown(meeting.minutes)}
                            </div>
                          {:else}
                            -
                          {/if}
                        </Table.Cell>
                        <Table.Cell class="py-2 pr-4">
                          {#if meeting.fileUrl}
                            <a href={meeting.fileUrl} class="text-primary underline" target="_blank" rel="noreferrer">Lien</a>
                          {:else}
                            -
                          {/if}
                        </Table.Cell>
                        <Table.Cell class="py-2 pr-4">
                          <Button type="button" size="sm" variant="secondary" on:click={() => openMeeting(meeting, false, false)}>Voir</Button>
                        </Table.Cell>
                      </Table.Row>
                    {/each}
                  </Table.Body>
                </Table.Root>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </details>
  {/if}

  {#if showViceModule}
    <details class="group bg-card border rounded-xl overflow-hidden">
      <summary class="list-none p-4 sm:p-6 cursor-pointer flex justify-between items-center hover:bg-muted/50 transition-colors">
        <h2 class="text-xl font-bold tracking-tight">Vice-President</h2>
        <span class="text-muted-foreground transition-transform group-open:rotate-180">v</span>
      </summary>
      <div class="p-4 sm:p-6 border-t bg-background/50 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Membres</CardTitle>
            <CardDescription>Cotisations et initiateurs.</CardDescription>
          </CardHeader>
          <CardContent>
            <UserTable
              users={usersStore}
              mode="vice"
              readonly={!canEditMembersVice}
              showRoot={false}
              rootBypassCotisations={bypassMembersCotisations}
              rootBypassInstructor={bypassMembersInstructor}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compte-rendus</CardTitle>
            <CardDescription>Lecture seule.</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex items-center justify-between gap-4 pb-3">
              <h3 class="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Liste</h3>
              <Input
                type="text"
                placeholder="Rechercher par titre, presents ou notes..."
                bind:value={meetingQueryVice}
                class="max-w-xs"
              />
            </div>
            <div class="overflow-x-auto border rounded-lg">
              <div class="max-h-[30rem] overflow-y-auto">
                <Table.Root>
                  <Table.Header class="sticky top-0 bg-background z-10">
                    <Table.Row>
                      <Table.Head class="py-2 pr-4">Titre</Table.Head>
                      <Table.Head class="py-2 pr-4">Date</Table.Head>
                      <Table.Head class="py-2 pr-4">Presents</Table.Head>
                      <Table.Head class="py-2 pr-4">Compte-rendu</Table.Head>
                      <Table.Head class="py-2 pr-4">Fichier</Table.Head>
                      <Table.Head class="py-2 pr-4"></Table.Head>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {#each filteredMeetingsVice as meeting}
                      <Table.Row>
                        <Table.Cell class="py-2 pr-4 font-medium">{meeting.title}</Table.Cell>
                        <Table.Cell class="py-2 pr-4">{new Date(meeting.date).toLocaleDateString("fr-FR")}</Table.Cell>
                        <Table.Cell class="py-2 pr-4">{meeting.attendees ?? "-"}</Table.Cell>
                        <Table.Cell class="py-2 pr-4">
                          {#if meeting.minutes}
                            <div class="prose prose-sm max-w-none">
                              {@html renderMarkdown(meeting.minutes)}
                            </div>
                          {:else}
                            -
                          {/if}
                        </Table.Cell>
                        <Table.Cell class="py-2 pr-4">
                          {#if meeting.fileUrl}
                            <a href={meeting.fileUrl} class="text-primary underline" target="_blank" rel="noreferrer">Lien</a>
                          {:else}
                            -
                          {/if}
                        </Table.Cell>
                        <Table.Cell class="py-2 pr-4">
                          <Button type="button" size="sm" variant="secondary" on:click={() => openMeeting(meeting, false, false)}>Voir</Button>
                        </Table.Cell>
                      </Table.Row>
                    {/each}
                  </Table.Body>
                </Table.Root>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventaire</CardTitle>
            <CardDescription>Lecture seule.</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex items-center justify-between gap-4 pb-3">
              <h3 class="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Liste</h3>
              <Input
                type="text"
                placeholder="Rechercher sur tous les champs..."
                bind:value={inventoryQueryVice}
                class="max-w-xs"
              />
            </div>

            <div class="overflow-x-auto border rounded-lg">
              <div class="max-h-[30rem] overflow-y-auto">
                <Table.Root>
                  <Table.Header class="sticky top-0 bg-background z-10">
                    <Table.Row>
                      <Table.Head class="py-2 pr-4">Nom</Table.Head>
                      <Table.Head class="py-2 pr-4">Marque</Table.Head>
                      <Table.Head class="py-2 pr-4">Etat</Table.Head>
                      <Table.Head class="py-2 pr-4">Quantite</Table.Head>
                      <Table.Head class="py-2 pr-4">Expiration</Table.Head>
                      <Table.Head class="py-2 pr-4">Photo</Table.Head>
                      <Table.Head class="py-2 pr-4"></Table.Head>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {#each filteredInventoryVice as item}
                      <Table.Row>
                        <Table.Cell class="py-2 pr-4 font-medium">{item.name}</Table.Cell>
                        <Table.Cell class="py-2 pr-4">{item.brand ?? "-"}</Table.Cell>
                        <Table.Cell class="py-2 pr-4">{item.status ?? "-"}</Table.Cell>
                        <Table.Cell class="py-2 pr-4">{item.quantity}</Table.Cell>
                        <Table.Cell class="py-2 pr-4">{item.expirationYear ?? "-"}</Table.Cell>
                        <Table.Cell class="py-2 pr-4">
                          {#if item.photoUrl}
                            <img
                              src={item.photoUrl}
                              alt="Photo materiel"
                              class="h-8 w-8 rounded border object-cover"
                            />
                          {:else}
                            -
                          {/if}
                        </Table.Cell>
                        <Table.Cell class="py-2 pr-4">
                          <Button type="button" size="sm" variant="secondary" on:click={() => openMaterial(item)}>Voir</Button>
                        </Table.Cell>
                      </Table.Row>
                    {/each}
                  </Table.Body>
                </Table.Root>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </details>
  {/if}

  {#if showSecretaryModule}
    <details class="group bg-card border rounded-xl overflow-hidden">
      <summary class="list-none p-4 sm:p-6 cursor-pointer flex justify-between items-center hover:bg-muted/50 transition-colors">
        <h2 class="text-xl font-bold tracking-tight">Secretaire</h2>
        <span class="text-muted-foreground transition-transform group-open:rotate-180">v</span>
      </summary>
      <div class="p-4 sm:p-6 border-t bg-background/50 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Cotisations</CardTitle>
            <CardDescription>Gestion des cotisations membres.</CardDescription>
          </CardHeader>
          <CardContent>
            <UserTable
              users={usersStore}
              mode="secretary"
              readonly={!canEditMembersSecretary}
              showRoot={false}
              rootBypassCotisations={bypassMembersCotisations}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compte-rendus</CardTitle>
            <CardDescription>Gestion des reunions.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            {#if canEditMeetings}
              <div class="flex justify-end">
                <div class="flex items-center gap-2">
                  <Button type="button" on:click={() => (addMeetingOpen = true)}>Ajouter</Button>
                  {#if bypassMeetingsCreate}
                    <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                      {adminBypassLabel}
                    </span>
                  {/if}
                </div>
              </div>
            {/if}

            <div class="flex items-center justify-between gap-4 pb-3">
              <h3 class="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Liste</h3>
              <Input
                type="text"
                placeholder="Rechercher par titre, presents ou notes..."
                bind:value={meetingQuerySecretary}
                class="max-w-xs"
              />
            </div>
            <div class="overflow-x-auto border rounded-lg">
              <div class="max-h-[30rem] overflow-y-auto">
                <Table.Root>
                  <Table.Header class="sticky top-0 bg-background z-10">
                    <Table.Row>
                      <Table.Head class="py-2 pr-4">Titre</Table.Head>
                      <Table.Head class="py-2 pr-4">Date</Table.Head>
                      <Table.Head class="py-2 pr-4">Presents</Table.Head>
                      <Table.Head class="py-2 pr-4">Compte-rendu</Table.Head>
                      <Table.Head class="py-2 pr-4">Fichier</Table.Head>
                      <Table.Head class="py-2 pr-4"></Table.Head>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {#each filteredMeetingsSecretary as meeting}
                      <Table.Row>
                        <Table.Cell class="py-2 pr-4 font-medium">{meeting.title}</Table.Cell>
                        <Table.Cell class="py-2 pr-4">{new Date(meeting.date).toLocaleDateString("fr-FR")}</Table.Cell>
                        <Table.Cell class="py-2 pr-4">{meeting.attendees ?? "-"}</Table.Cell>
                        <Table.Cell class="py-2 pr-4">
                          {#if meeting.minutes}
                            <div class="prose prose-sm max-w-none">
                              {@html renderMarkdown(meeting.minutes)}
                            </div>
                          {:else}
                            -
                          {/if}
                        </Table.Cell>
                        <Table.Cell class="py-2 pr-4">
                          {#if meeting.fileUrl}
                            <a href={meeting.fileUrl} class="text-primary underline" target="_blank" rel="noreferrer">Lien</a>
                          {:else}
                            -
                          {/if}
                        </Table.Cell>
                        <Table.Cell class="py-2 pr-4">
                          <div class="flex items-center gap-2">
                            <Button type="button" size="sm" variant="secondary" on:click={() => openMeeting(meeting, canEditMeetings, canDeleteMeetings)}>Voir</Button>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    {/each}
                  </Table.Body>
                </Table.Root>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </details>
  {/if}

  {#if showTreasuryModule}
    <details class="group bg-card border rounded-xl overflow-hidden">
      <summary class="list-none p-4 sm:p-6 cursor-pointer flex justify-between items-center hover:bg-muted/50 transition-colors">
        <h2 class="text-xl font-bold tracking-tight">Tresorier</h2>
        <span class="text-muted-foreground transition-transform group-open:rotate-180">v</span>
      </summary>
      <div class="p-4 sm:p-6 border-t bg-background/50 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Cotisations</CardTitle>
            <CardDescription>Etat des cotisations membres.</CardDescription>
          </CardHeader>
          <CardContent>
            <UserTable
              users={usersStore}
              mode="treasury"
              readonly={!canEditMembersTreasury}
              rootBypassCotisations={bypassMembersCotisations}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compte-rendus</CardTitle>
            <CardDescription>Lecture seule.</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex items-center justify-between gap-4 pb-3">
              <h3 class="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Liste</h3>
              <Input
                type="text"
                placeholder="Rechercher par titre, presents ou notes..."
                bind:value={meetingQueryTreasury}
                class="max-w-xs"
              />
            </div>
            <div class="overflow-x-auto border rounded-lg">
              <div class="max-h-[30rem] overflow-y-auto">
                <Table.Root>
                  <Table.Header class="sticky top-0 bg-background z-10">
                    <Table.Row>
                      <Table.Head class="py-2 pr-4">Titre</Table.Head>
                      <Table.Head class="py-2 pr-4">Date</Table.Head>
                      <Table.Head class="py-2 pr-4">Presents</Table.Head>
                      <Table.Head class="py-2 pr-4">Compte-rendu</Table.Head>
                      <Table.Head class="py-2 pr-4">Fichier</Table.Head>
                      <Table.Head class="py-2 pr-4"></Table.Head>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {#each filteredMeetingsTreasury as meeting}
                      <Table.Row>
                        <Table.Cell class="py-2 pr-4 font-medium">{meeting.title}</Table.Cell>
                        <Table.Cell class="py-2 pr-4">{new Date(meeting.date).toLocaleDateString("fr-FR")}</Table.Cell>
                        <Table.Cell class="py-2 pr-4">{meeting.attendees ?? "-"}</Table.Cell>
                        <Table.Cell class="py-2 pr-4">
                          {#if meeting.minutes}
                            <div class="prose prose-sm max-w-none">
                              {@html renderMarkdown(meeting.minutes)}
                            </div>
                          {:else}
                            -
                          {/if}
                        </Table.Cell>
                        <Table.Cell class="py-2 pr-4">
                          {#if meeting.fileUrl}
                            <a href={meeting.fileUrl} class="text-primary underline" target="_blank" rel="noreferrer">Lien</a>
                          {:else}
                            -
                          {/if}
                        </Table.Cell>
                        <Table.Cell class="py-2 pr-4">
                          <Button type="button" size="sm" variant="secondary" on:click={() => openMeeting(meeting, false, false)}>Voir</Button>
                        </Table.Cell>
                      </Table.Row>
                    {/each}
                  </Table.Body>
                </Table.Root>
              </div>
            </div>
          </CardContent>
        </Card>

        {#if canViewInventory}
          <Card>
            <CardHeader>
              <CardTitle>Inventaire</CardTitle>
              <CardDescription>Gestion du materiel.</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              {#if canCreateInventory}
                <div class="flex justify-end">
                  <div class="flex items-center gap-2">
                    <Button type="button" on:click={() => (addMaterialOpen = true)}>Ajouter</Button>
                    {#if bypassInventoryCreate}
                      <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                        {adminBypassLabel}
                      </span>
                    {/if}
                  </div>
                </div>
              {/if}
            <div class="flex items-center justify-between gap-4 pb-3">
              <h3 class="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Liste</h3>
              <Input
                type="text"
                placeholder="Rechercher sur tous les champs..."
                bind:value={inventoryQueryTreasury}
                class="max-w-xs"
              />
            </div>

            <div class="overflow-x-auto border rounded-lg">
              <div class="max-h-[30rem] overflow-y-auto">
                <Table.Root>
                  <Table.Header class="sticky top-0 bg-background z-10">
                    <Table.Row>
                      <Table.Head class="py-2 pr-4">Nom</Table.Head>
                      <Table.Head class="py-2 pr-4">Marque</Table.Head>
                      <Table.Head class="py-2 pr-4">Etat</Table.Head>
                      <Table.Head class="py-2 pr-4">Quantite</Table.Head>
                      <Table.Head class="py-2 pr-4">Expiration</Table.Head>
                      <Table.Head class="py-2 pr-4">Photo</Table.Head>
                      <Table.Head class="py-2 pr-4"></Table.Head>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {#each filteredInventoryTreasury as item}
                      <Table.Row>
                        <Table.Cell class="py-2 pr-4 font-medium">{item.name}</Table.Cell>
                        <Table.Cell class="py-2 pr-4">{item.brand ?? "-"}</Table.Cell>
                        <Table.Cell class="py-2 pr-4">{item.status ?? "-"}</Table.Cell>
                        <Table.Cell class="py-2 pr-4">{item.quantity}</Table.Cell>
                        <Table.Cell class="py-2 pr-4">{item.expirationYear ?? "-"}</Table.Cell>
                        <Table.Cell class="py-2 pr-4">
                          {#if item.photoUrl}
                            <img
                              src={item.photoUrl}
                              alt="Photo materiel"
                              class="h-8 w-8 rounded border object-cover"
                            />
                          {:else}
                            -
                          {/if}
                        </Table.Cell>
                        <Table.Cell class="py-2 pr-4">
                          <Button type="button" size="sm" variant="secondary" on:click={() => openMaterial(item)}>Voir</Button>
                        </Table.Cell>
                      </Table.Row>
                    {/each}
                  </Table.Body>
                </Table.Root>
              </div>
            </div>
            </CardContent>
          </Card>
        {/if}

        {#if canViewFinance}
          <Card>
            <CardHeader>
              <CardTitle>Flux d'argent</CardTitle>
              <CardDescription>Suivi des entrees et sorties.</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              {#if canCreateFinance}
                <div class="flex justify-end">
                  <div class="flex items-center gap-2">
                    <Button type="button" on:click={() => (addFinanceOpen = true)}>Ajouter</Button>
                    {#if bypassFinanceCreate}
                      <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                        {adminBypassLabel}
                      </span>
                    {/if}
                  </div>
                </div>
              {/if}
            <div class="flex items-center justify-between gap-4 pb-3">
              <h3 class="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Liste</h3>
              <Input
                type="text"
                placeholder="Rechercher sur tous les champs..."
                bind:value={financeQueryTreasury}
                class="max-w-xs"
              />
            </div>

            <div class="overflow-x-auto border rounded-lg">
              <div class="max-h-[30rem] overflow-y-auto">
                <Table.Root>
                  <Table.Header class="sticky top-0 bg-background z-10">
                    <Table.Row>
                      <Table.Head class="py-2 pr-4">Libelle</Table.Head>
                      <Table.Head class="py-2 pr-4">Type</Table.Head>
                      <Table.Head class="py-2 pr-4">Montant</Table.Head>
                      <Table.Head class="py-2 pr-4">Date</Table.Head>
                      <Table.Head class="py-2 pr-4">Categorie</Table.Head>
                      <Table.Head class="py-2 pr-4">Notes</Table.Head>
                      <Table.Head class="py-2 pr-4">Justificatif</Table.Head>
                      <Table.Head class="py-2 pr-4"></Table.Head>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {#each filteredFinanceTreasury as entry}
                      <Table.Row>
                        <Table.Cell class="py-2 pr-4 font-medium">{entry.label}</Table.Cell>
                        <Table.Cell class="py-2 pr-4">{entry.type}</Table.Cell>
                        <Table.Cell class="py-2 pr-4">{entry.amount}</Table.Cell>
                        <Table.Cell class="py-2 pr-4">{new Date(entry.date).toLocaleDateString("fr-FR")}</Table.Cell>
                        <Table.Cell class="py-2 pr-4">{entry.category ?? "-"}</Table.Cell>
                        <Table.Cell class="py-2 pr-4">{entry.notes ?? "-"}</Table.Cell>
                        <Table.Cell class="py-2 pr-4">
                          {#if entry.justificatifUrl}
                            {#if isImageUrl(entry.justificatifUrl)}
                              <img
                                src={entry.justificatifUrl}
                                alt="Justificatif"
                                class="h-8 w-8 rounded border object-cover"
                              />
                            {:else}
                              <a href={entry.justificatifUrl} class="text-primary underline" target="_blank" rel="noreferrer">Voir</a>
                            {/if}
                          {:else}
                            -
                          {/if}
                        </Table.Cell>
                        <Table.Cell class="py-2 pr-4">
                          <div class="flex items-center gap-2">
                            <Button type="button" size="sm" variant="secondary" on:click={() => openFinance(entry)}>Voir</Button>
                            {#if canEditFinance}
                              <div class="flex items-center gap-2">
                                <Button type="button" size="sm" variant="outline" on:click={() => openFinance(entry, true)}>Modifier</Button>
                                {#if bypassFinanceEdit}
                                  <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                                    {adminBypassLabel}
                                  </span>
                                {/if}
                              </div>
                            {/if}
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    {/each}
                  </Table.Body>
                </Table.Root>
              </div>
            </div>
              </CardContent>
            </Card>
          {/if}
      </div>
    </details>
  {/if}
</div>

{#if materialDialogOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" on:click={closeMaterial}>
    <div class="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-background border shadow-lg" on:click|stopPropagation>
      <div class="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h3 class="text-lg font-bold">Materiel</h3>
          <p class="text-xs text-muted-foreground">{materialDraft.name}</p>
        </div>
        <div class="flex items-center gap-2">
          {#if canEditInventory}
            <div class="flex items-center gap-2">
              <Button type="button" variant="ghost" size="sm" on:click={() => (materialEditMode = !materialEditMode)}>Modifier</Button>
              {#if bypassInventoryEdit}
                <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                  {adminBypassLabel}
                </span>
              {/if}
            </div>
          {/if}
          {#if canDeleteInventory}
            <div class="flex items-center gap-2">
              <Button type="button" variant="destructive" size="sm" on:click={deleteMaterial}>Supprimer</Button>
              {#if bypassInventoryDelete}
                <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                  {adminBypassLabel}
                </span>
              {/if}
            </div>
          {/if}
          <Button type="button" variant="ghost" on:click={closeMaterial}>Fermer</Button>
        </div>
      </div>

      <form
        method="POST"
        action="?/updateInventoryItem"
        enctype="multipart/form-data"
        class="space-y-4 px-6 py-4"
      >
        <input type="hidden" name="id" value={materialDraft.id} />
        <div class="grid gap-3 md:grid-cols-2">
          <Input name="name" placeholder="Nom" bind:value={materialDraft.name} required disabled={!materialEditMode} />
          <Input name="brand" placeholder="Marque" bind:value={materialDraft.brand} disabled={!materialEditMode} />
          <Input name="status" placeholder="Etat" bind:value={materialDraft.status} disabled={!materialEditMode} />
          <Input
            name="quantity"
            type="number"
            min="1"
            placeholder="Quantite"
            bind:value={materialDraft.quantity}
            disabled={!materialEditMode}
          />
          <Input
            name="acquiredYear"
            type="number"
            placeholder="Annee acquisition"
            bind:value={materialDraft.acquiredYear}
            disabled={!materialEditMode}
          />
          <Input
            name="manufacturedYear"
            type="number"
            placeholder="Annee fabrication"
            bind:value={materialDraft.manufacturedYear}
            disabled={!materialEditMode}
          />
          <Input
            name="expirationYear"
            type="number"
            placeholder="Annee expiration"
            bind:value={materialDraft.expirationYear}
            disabled={!materialEditMode}
          />
        </div>

        <Textarea name="notes" placeholder="Notes" bind:value={materialDraft.notes} disabled={!materialEditMode} />

        <div class="flex flex-col gap-2">
          {#if materialDraft.photoUrl}
            <div class="max-h-[45vh] overflow-auto rounded-lg border bg-muted/20 p-2">
              <img
                src={materialDraft.photoUrl}
                alt="Photo materiel"
                class="block h-auto w-auto max-h-[45vh] max-w-full object-contain"
              />
            </div>
          {/if}
          <input
            type="file"
            name="photo"
            class="text-sm text-muted-foreground"
            accept="image/*"
            disabled={!materialEditMode}
          />
        </div>

        <div class="flex justify-end gap-2">
          <Button type="button" variant="outline" on:click={closeMaterial}>Annuler</Button>
          {#if canEditInventory && materialEditMode}
            <div class="flex items-center gap-2">
              <Button type="submit">Enregistrer</Button>
              {#if bypassInventoryEdit}
                <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                  {adminBypassLabel}
                </span>
              {/if}
            </div>
          {/if}
        </div>
      </form>
    </div>
  </div>
{/if}

{#if addMaterialOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" on:click={() => (addMaterialOpen = false)}>
    <div class="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-background border shadow-lg" on:click|stopPropagation>
      <div class="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h3 class="text-lg font-bold">Ajouter du materiel</h3>
          <p class="text-xs text-muted-foreground">Saisir les informations du materiel.</p>
        </div>
        <Button type="button" variant="ghost" on:click={() => (addMaterialOpen = false)}>Fermer</Button>
      </div>

      <form
        method="POST"
        action="?/addInventoryItem"
        enctype="multipart/form-data"
        class="space-y-4 px-6 py-4"
      >
        <div class="grid gap-3 md:grid-cols-2">
          <Input name="name" placeholder="Nom" required />
          <Input name="brand" placeholder="Marque" />
          <Input name="status" placeholder="Etat" />
          <Input name="quantity" type="number" min="1" placeholder="Quantite" />
          <Input name="acquiredYear" type="number" placeholder="Annee acquisition" />
          <Input name="manufacturedYear" type="number" placeholder="Annee fabrication" />
          <Input name="expirationYear" type="number" placeholder="Annee expiration" />
        </div>
        <Input name="notes" placeholder="Notes" />
        <input type="file" name="photo" class="text-sm text-muted-foreground" accept="image/*" />

        <div class="flex justify-end gap-2">
          <Button type="button" variant="outline" on:click={() => (addMaterialOpen = false)}>Annuler</Button>
          <div class="flex items-center gap-2">
            <Button type="submit">Ajouter</Button>
            {#if bypassInventoryCreate}
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

{#if slotDialogOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" on:click={closeSlot}>
    <div class="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-background border shadow-lg" on:click|stopPropagation>
      <div class="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h3 class="text-lg font-bold">Creneau</h3>
          <p class="text-xs text-muted-foreground">{slotDraft.name}</p>
        </div>
        <div class="flex items-center gap-2">
          {#if canEditSlotAny}
            <div class="flex items-center gap-2">
              <Button type="button" variant="ghost" size="sm" on:click={() => (slotEditMode = !slotEditMode)}>Modifier</Button>
              {#if showSlotEditBypass}
                <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                  {adminBypassLabel}
                </span>
              {/if}
            </div>
          {/if}
          {#if canDeleteSlot}
            <div class="flex items-center gap-2">
              <Button type="button" variant="destructive" size="sm" on:click={deleteSlot}>Supprimer</Button>
              {#if showSlotDeleteBypass}
                <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                  {adminBypassLabel}
                </span>
              {/if}
            </div>
          {/if}
          <Button type="button" variant="ghost" on:click={closeSlot}>Fermer</Button>
        </div>
      </div>

      <div class="space-y-4 px-6 py-4">
        <div class="grid gap-3 md:grid-cols-2 text-sm">
          <div>
            <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Createur</p>
            <p>{slotDraft.owner ? formatUserName(slotDraft.owner) : "-"}</p>
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Responsables</p>
            <p>{formatUserList(slotDraft.responsibles)}</p>
          </div>
        </div>
        <div class="grid gap-3 md:grid-cols-2 text-sm">
          <div>
            <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Inscrits</p>
            <p>{formatUserList(slotDraft.participants)}</p>
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Presents</p>
            <p>{formatUserList(slotDraft.attendees)}</p>
          </div>
        </div>

        <div class="grid gap-3 md:grid-cols-2">
          <Input name="name" placeholder="Nom" bind:value={slotDraft.name} disabled={!slotEditMode || !canEditSlotDetails} />
          <Input name="capacity" type="number" min="1" placeholder="Jauge" bind:value={slotDraft.capacity} disabled={!slotEditMode || !canEditSlotCapacity} />
          <Input name="date" type="date" bind:value={slotDraft.date} disabled={!slotEditMode || !canEditSlotDetails} />
          <div>
            <select
              name="slot_type"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              bind:value={slotDraft.slot_type}
              disabled={!slotEditMode || !canEditSlotType}
            >
              {#each slotTypeOptions as opt}
                <option value={opt.value}>{opt.label}</option>
              {/each}
            </select>
          </div>
          <Input name="starts_at" type="time" bind:value={slotDraft.starts_at} disabled={!slotEditMode || !canEditSlotDetails} />
          <Input name="ends_at" type="time" bind:value={slotDraft.ends_at} disabled={!slotEditMode || !canEditSlotDetails} />
        </div>

        <Textarea name="description" placeholder="Description" bind:value={slotDraft.description} disabled={!slotEditMode || !canEditSlotDetails} />

        <div class="flex justify-end gap-2">
          <Button type="button" variant="outline" on:click={closeSlot}>Annuler</Button>
          {#if canEditSlotAny && slotEditMode}
            <div class="flex items-center gap-2">
              <Button type="button" on:click={saveSlot}>Enregistrer</Button>
              {#if showSlotEditBypass}
                <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                  {adminBypassLabel}
                </span>
              {/if}
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

{#if addMeetingOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" on:click={() => (addMeetingOpen = false)}>
    <div class="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-background border shadow-lg" on:click|stopPropagation>
      <div class="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h3 class="text-lg font-bold">Ajouter un compte-rendu</h3>
          <p class="text-xs text-muted-foreground">Nouvelle reunion.</p>
        </div>
        <Button type="button" variant="ghost" on:click={() => (addMeetingOpen = false)}>Fermer</Button>
      </div>

      <form method="POST" action="?/addMeeting" enctype="multipart/form-data" class="space-y-4 px-6 py-4">
        <div class="grid gap-3 md:grid-cols-2">
          <Input name="title" placeholder="Titre reunion" required />
          <Input name="date" type="date" required />
        </div>
        <Input name="attendees" placeholder="Presents" />
        <Textarea name="minutes" placeholder="Compte-rendu" />
        <Input name="fileUrl" placeholder="Lien fichier (optionnel)" />
        <input
          type="file"
          name="minutesFile"
          class="text-sm text-muted-foreground"
          accept=".pdf,.doc,.docx,.txt,image/*"
        />

        <div class="flex justify-end gap-2">
          <Button type="button" variant="outline" on:click={() => (addMeetingOpen = false)}>Annuler</Button>
          <div class="flex items-center gap-2">
            <Button type="submit">Ajouter</Button>
            {#if bypassMeetingsCreate}
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

{#if addFinanceOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" on:click={() => (addFinanceOpen = false)}>
    <div class="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-background border shadow-lg" on:click|stopPropagation>
      <div class="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h3 class="text-lg font-bold">Ajouter une entree</h3>
          <p class="text-xs text-muted-foreground">Flux d'argent.</p>
        </div>
        <Button type="button" variant="ghost" on:click={() => (addFinanceOpen = false)}>Fermer</Button>
      </div>

      <form method="POST" action="?/addFinanceEntry" enctype="multipart/form-data" class="space-y-4 px-6 py-4">
        <div class="grid gap-3 md:grid-cols-2">
          <Input name="label" placeholder="Libelle" required />
          <Input name="amount" type="number" step="0.01" placeholder="Montant" required />
          <select name="type" class="rounded-md border border-input bg-background px-3 py-2 text-sm" required>
            <option value="INCOME">INCOME</option>
            <option value="EXPENSE">EXPENSE</option>
          </select>
          <Input name="category" placeholder="Categorie" />
          <Input name="date" type="date" required />
          <Input name="notes" placeholder="Notes" />
        </div>
        <input
          type="file"
          name="justificatif"
          class="text-sm text-muted-foreground"
          accept="image/*,.pdf"
        />

        <div class="flex justify-end gap-2">
          <Button type="button" variant="outline" on:click={() => (addFinanceOpen = false)}>Annuler</Button>
          <div class="flex items-center gap-2">
            <Button type="submit">Ajouter</Button>
            {#if bypassFinanceCreate}
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

{#if financeDialogOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" on:click={closeFinance}>
    <div class="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-background border shadow-lg" on:click|stopPropagation>
      <div class="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h3 class="text-lg font-bold">Flux d'argent</h3>
          <p class="text-xs text-muted-foreground">{financeDraft.label}</p>
        </div>
        <div class="flex items-center gap-2">
          {#if canEditFinance}
            <div class="flex items-center gap-2">
              <Button type="button" variant="ghost" size="sm" on:click={() => (financeEditMode = !financeEditMode)}>Modifier</Button>
              {#if bypassFinanceEdit}
                <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                  {adminBypassLabel}
                </span>
              {/if}
            </div>
          {/if}
          <Button type="button" variant="ghost" on:click={closeFinance}>Fermer</Button>
        </div>
      </div>

      <form
        method="POST"
        action="?/updateFinanceEntry"
        enctype="multipart/form-data"
        class="space-y-4 px-6 py-4"
      >
        <input type="hidden" name="id" value={financeDraft.id} />
        <div class="grid gap-3 md:grid-cols-2">
          <Input name="label" placeholder="Libelle" bind:value={financeDraft.label} required disabled={!financeEditMode} />
          <Input name="amount" type="number" step="0.01" placeholder="Montant" bind:value={financeDraft.amount} required disabled={!financeEditMode} />
          <select
            name="type"
            class="rounded-md border border-input bg-background px-3 py-2 text-sm"
            bind:value={financeDraft.type}
            disabled={!financeEditMode}
          >
            <option value="INCOME">INCOME</option>
            <option value="EXPENSE">EXPENSE</option>
          </select>
          <Input name="category" placeholder="Categorie" bind:value={financeDraft.category} disabled={!financeEditMode} />
          <Input name="date" type="date" bind:value={financeDraft.date} required disabled={!financeEditMode} />
          <Input name="notes" placeholder="Notes" bind:value={financeDraft.notes} disabled={!financeEditMode} />
        </div>

        <div class="flex flex-col gap-2">
          {#if financeDraft.justificatifUrl}
            <a href={financeDraft.justificatifUrl} class="text-primary underline" target="_blank" rel="noreferrer">Justificatif actuel</a>
          {/if}
          <input
            type="file"
            name="justificatif"
            class="text-sm text-muted-foreground"
            accept="image/*,.pdf"
            disabled={!financeEditMode}
          />
        </div>

        <div class="flex justify-end gap-2">
          <Button type="button" variant="outline" on:click={closeFinance}>Annuler</Button>
          {#if canEditFinance && financeEditMode}
            <div class="flex items-center gap-2">
              <Button type="submit">Enregistrer</Button>
              {#if bypassFinanceEdit}
                <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                  {adminBypassLabel}
                </span>
              {/if}
            </div>
          {/if}
        </div>
      </form>
      {#if canDeleteFinance}
        <form
          method="POST"
          action="?/deleteFinanceEntry"
          class="px-6 pb-4 flex justify-end"
          on:submit={(event) => {
            if (!confirm("Supprimer definitivement cette entree ?")) event.preventDefault();
          }}
        >
          <input type="hidden" name="id" value={financeDraft.id} />
          <div class="flex items-center gap-2">
            <Button type="submit" variant="destructive">Supprimer</Button>
            {#if bypassFinanceDelete}
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

{#if meetingDialogOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" on:click={closeMeeting}>
    <div class="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-background border shadow-lg" on:click|stopPropagation>
      <div class="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h3 class="text-lg font-bold">Compte-rendu</h3>
          <p class="text-xs text-muted-foreground">
            {meetingCanEdit ? "Modifier les informations de la reunion." : "Consultation du compte-rendu."}
          </p>
        </div>
        <div class="flex items-center gap-2">
          {#if meetingCanEdit}
            <div class="flex items-center gap-2">
              <Button type="button" variant="ghost" size="sm" on:click={() => (meetingEditMode = !meetingEditMode)}>Modifier</Button>
              {#if bypassMeetingsEdit}
                <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                  {adminBypassLabel}
                </span>
              {/if}
            </div>
          {/if}
          <Button type="button" variant="ghost" on:click={closeMeeting}>Fermer</Button>
        </div>
      </div>

      <form method="POST" action="?/updateMeeting" enctype="multipart/form-data" class="space-y-4 px-6 py-4">
        <input type="hidden" name="id" value={meetingDraft.id} />
        <div class="grid gap-3 md:grid-cols-2">
          <Input name="title" placeholder="Titre" bind:value={meetingDraft.title} required disabled={!meetingEditMode} />
          <Input name="date" type="date" bind:value={meetingDraft.date} required disabled={!meetingEditMode} />
        </div>
        <Input name="attendees" placeholder="Presents" bind:value={meetingDraft.attendees} disabled={!meetingEditMode} />
        <Textarea name="minutes" placeholder="Compte-rendu" bind:value={meetingDraft.minutes} disabled={!meetingEditMode} />

        <div class="flex flex-col gap-2">
          {#if meetingDraft.fileUrl}
            <a href={meetingDraft.fileUrl} class="text-sm text-primary underline" target="_blank" rel="noreferrer">
              Fichier actuel
            </a>
          {/if}
          <input
            type="file"
            name="minutesFile"
            class="text-sm text-muted-foreground"
            accept=".pdf,.doc,.docx,.txt"
            disabled={!meetingEditMode}
          />
        </div>

        <div class="flex justify-end gap-2">
          <Button type="button" variant="outline" on:click={closeMeeting}>Annuler</Button>
          {#if meetingCanEdit && meetingEditMode}
            <div class="flex items-center gap-2">
              <Button type="submit">Enregistrer</Button>
              {#if bypassMeetingsEdit}
                <span class="inline-flex items-center rounded border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                  {adminBypassLabel}
                </span>
              {/if}
            </div>
          {/if}
        </div>
      </form>
      {#if meetingCanDelete}
        <form
          method="POST"
          action="?/deleteMeeting"
          class="px-6 pb-4 flex justify-end"
          on:submit={(event) => {
            if (!confirm("Supprimer definitivement ce compte-rendu ?")) event.preventDefault();
          }}
        >
          <input type="hidden" name="id" value={meetingDraft.id} />
          <div class="flex items-center gap-2">
            <Button type="submit" variant="destructive">Supprimer</Button>
            {#if bypassMeetingsDelete}
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

{#if permissionsDialogOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" on:click={closePermissionsDialog}>
    <div class="w-full max-w-6xl max-h-[85vh] rounded-xl bg-background border shadow-lg flex flex-col" on:click|stopPropagation>
      <div class="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h3 class="text-lg font-bold">Permissions du bureau</h3>
          <p class="text-xs text-muted-foreground">Activer ou desactiver chaque action par role.</p>
        </div>
        <Button type="button" variant="ghost" on:click={closePermissionsDialog}>Fermer</Button>
      </div>

      <div class="p-6 overflow-y-auto space-y-6">
        {#each permissionGroups as group}
          <div class="border rounded-xl p-4 space-y-3">
            <div>
              <h4 class="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{group.title}</h4>
              <p class="text-xs text-muted-foreground">{group.description}</p>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-xs">
                <thead>
                  <tr class="text-left border-b">
                    <th class="py-2 px-3">Action</th>
                    {#each roles as role}
                      <th class="py-2 px-3">{labelForRole(role)}</th>
                    {/each}
                  </tr>
                </thead>
                <tbody>
                  {#each group.actions as action}
                    <tr class="border-b last:border-b-0">
                      <td class="py-2 px-3 font-medium">{actionLabels[action] ?? (action === "betas.edit" ? "Modifier les betas" : action === "betas.delete" ? "Supprimer les betas" : action)}</td>
                      {#each roles as role}
                        {@const currentAccess = localActionMatrix?.[role]?.[action] ?? "NONE"}
                        {@const baselineAccess = baselineActionMatrix?.[role]?.[action] ?? "NONE"}
                        <td class="py-2 px-3">
                          <button
                            type="button"
                            class={getPermissionButtonClass(
                              currentAccess !== "NONE",
                              currentAccess !== baselineAccess,
                            )}
                            aria-disabled={!canEditPermissions}
                            on:click|preventDefault={() =>
                              setActionPermission(role, action, currentAccess === "NONE" ? "WRITE" : "NONE")}
                          >
                            {currentAccess === "NONE" ? "Non" : "Oui"}
                          </button>
                        </td>
                      {/each}
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>
        {/each}
      </div>

      <div class="flex items-center justify-end gap-2 border-t px-6 py-4">
        <Button type="button" variant="outline" on:click={closePermissionsDialog}>Annuler</Button>
        <Button type="button" on:click={savePermissionChanges}>Enregistrer</Button>
      </div>
    </div>
  </div>
{/if}

<style>
  summary::-webkit-details-marker {
    display: none;
  }
</style>
