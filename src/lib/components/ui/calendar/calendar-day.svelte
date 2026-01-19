<script lang="ts">
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import { cn } from "$lib/utils.js";
	import { getLocalTimeZone, type DateValue } from "@internationalized/date";
	import { Calendar as CalendarPrimitive } from "bits-ui";
	import { onMount } from "svelte";

	type $$Props = CalendarPrimitive.DayProps;
	type $$Events = CalendarPrimitive.DayEvents;

	export let date: $$Props["date"];
	export let month: $$Props["month"];

	let className: $$Props["class"] = undefined;
	
	export { className as class };

	let slot_exists = false;
	let slot_types: string[] = [];
	let previousDate: any = null;

	onMount(() => {
		updateSlotExists();
		previousDate = date;
	});

	$: if (date !== previousDate && date) {
		previousDate = date;
		updateSlotExists();
	}

	export async function updateSlotExists() {
		const result = await checkDate(date);
		slot_exists = result.exists;
		slot_types = result.slot_types || [];
	};

	async function checkDate(date : DateValue) {
        // Only run on client side
        if (typeof window === 'undefined') {
            return { exists: false, slot_types: [] };
        }

        // Request the route /api/slot/exists with the date as a parameter
		let startOfDay = date.toDate(getLocalTimeZone());
		startOfDay.setHours(0, 0, 0, 0);

		// Crée une date pour la fin de la journée (23:59:59)
		let endOfDay = new Date(startOfDay);
		endOfDay.setHours(23, 59, 59, 999);

        let exists = await fetch("/api/slots/exists", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ startOfDay: startOfDay, endOfDay: endOfDay }),
        });
        
        if (exists.status == 200) {
            return exists.json().then((data) => {
                return { exists: data.exists, slot_types: data.slot_types || [] };
            });
        } else {
            return { exists: false, slot_types: [] };
        }
    }

	onMount(() => {
		updateSlotExists();
	});
</script>

<!-- If the date is in the events array, add the border -->
<CalendarPrimitive.Day
	{date}
	{month}
	on:click
	class={cn(
		buttonVariants({ variant: "ghost" }),
		"h-9 w-9 p-0 font-normal relative",
		"[&[data-today]:not([data-selected])]:bg-accent [&[data-today]:not([data-selected])]:text-accent-foreground",
		// Selected
		"data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:hover:bg-primary data-[selected]:hover:text-primary-foreground data-[selected]:focus:bg-primary data-[selected]:focus:text-primary-foreground data-[selected]:opacity-100",
		// Disabled
		"data-[disabled]:text-muted-foreground data-[disabled]:opacity-50",
		// Unavailable
		"data-[unavailable]:text-destructive-foreground data-[unavailable]:line-through",
		// Outside months
		"data-[outside-month]:text-muted-foreground [&[data-outside-month][data-selected]]:bg-accent/50 [&[data-outside-month][data-selected]]:text-muted-foreground data-[outside-month]:pointer-events-none data-[outside-month]:opacity-50 [&[data-outside-month][data-selected]]:opacity-30",
		slot_exists ? "day-button" : "",
		className
	)}
	{...$$restProps}
	let:selected
	let:disabled
	let:unavailable
	let:builder
>
	<slot {selected} {disabled} {unavailable} {builder}>
		{date.day}
	</slot>
	<style>
		.day-button {
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			align-items: center;
			gap: 0.15rem;
		}
		.day-button::after {
			content: "";
			display: flex;
			gap: 0.15rem;
		}
	</style>
	{#if slot_exists && slot_types.length > 0}
		<div class="flex justify-center gap-0.5 mt-0.5">
			{#each slot_types as slot_type}
				<div
					class="h-1 w-1 rounded-full"
					class:bg-primary={slot_type === 'CRENEAU'}
					class:bg-green-500={slot_type === 'EVENEMENT'}
					class:bg-red-500={slot_type === 'FERMETURE'}
				/>
			{/each}
		</div>
	{/if}
</CalendarPrimitive.Day>
