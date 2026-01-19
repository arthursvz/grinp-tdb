<script lang="ts">
    import {
      Card,
      CardDescription,
      CardHeader,
      CardTitle
    } from "$lib/components/ui/card";
    import SlotTable from "@/components/SlotTable.svelte";
    import UserTable from "@/components/UserTable.svelte";
    import { slots, users } from "@/stores";
    import type { Slot, User } from "@prisma/client";

    export let data: {
        users: User[];
        slots: Slot[];
    };

    $: {
        users.set(data.users);
        slots.set(data.slots);
    }
</script>

<Card class="m-auto w-full min-h-[calc(100vh-4rem)]">
    <CardHeader>
        <CardTitle>Admin</CardTitle>
        <CardDescription>Pannel admin du site</CardDescription>
    </CardHeader>

    <div class="relative">
        <div class="absolute inset-0 flex items-center">
            <span class="m-4 w-full border-t" />
        </div>
    </div>

    <UserTable {users} />

    <div class="relative">
        <div class="absolute inset-0 flex items-center">
            <span class="m-4 w-full border-t" />
        </div>
    </div>

    <SlotTable {slots} {users} />
</Card>