<script lang="ts">
        
    export let data: {
        user: User;
        users: User[];
        slots: Slot[];
    };

    import CompactSlot from "@/components/CompactSlot.svelte";
    import CardContent from "@/components/ui/card/card-content.svelte";
    import CardHeader from "@/components/ui/card/card-header.svelte";
    import CardTitle from "@/components/ui/card/card-title.svelte";
    import Card from "@/components/ui/card/card.svelte";
    import type { Slot, User } from "@prisma/client";
</script>

<Card class="m-auto w-full min-h-[calc(100vh-4rem)]">
    <CardHeader>
        <CardTitle class="flex justify-between"><span>{data.user.first_name} {data.user.last_name}</span><span>#{data.user.churros_uid}</span></CardTitle>
    </CardHeader>

    <div class="relative">
        <div class="absolute inset-0 flex items-center">
            <span class="m-4 w-full border-t"/>
        </div>
    </div>

    <CardContent class="flex flex-col gap-4 pt-6 items-center">
        {#each data.slots as slot}
            <div class="w-3/4">
                <CompactSlot {slot} owner={data.users.find((user) => user.id === slot.owner_id)} />
            </div>
        {/each}
    </CardContent>
</Card>