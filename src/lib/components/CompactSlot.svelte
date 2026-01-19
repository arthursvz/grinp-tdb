<script lang="ts">
    import type { Slot, User } from "@prisma/client";
    import CardDescription from "./ui/card/card-description.svelte";
    import CardFooter from "./ui/card/card-footer.svelte";
    import CardHeader from "./ui/card/card-header.svelte";
    import CardTitle from "./ui/card/card-title.svelte";
    import Card from "./ui/card/card.svelte";

    export let slot : Slot;
    export let owner : User | undefined;
</script>

<Card class="p-0 flex justify-around items-center">
    <CardHeader class="p-2">
        <CardTitle>{slot.name}, #{slot.id}</CardTitle>
        <CardDescription>{slot.description?.substring(0, 40) + "..."}</CardDescription>
    </CardHeader>
    <CardFooter class="p-2 justify-between flex flex-col items-center">
        <div class="flex">
            <CardDescription>Du {new Date(slot.starts_at).toLocaleDateString()} au {new Date(slot.ends_at).toLocaleDateString()}</CardDescription>
        </div>
        <div class="flex">
            <CardDescription>Responsable: #{owner?.churros_uid ?? ((owner?.first_name ?? "") + owner?.last_name[0] + ".")}</CardDescription>
        </div>
        <div class="flex">
            <CardDescription>Jauge: {slot.capacity}</CardDescription>
        </div>
    </CardFooter>
</Card>