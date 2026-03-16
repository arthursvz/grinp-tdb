<script lang="ts">
	import type { HTMLTextareaAttributes } from "svelte/elements";
    // Assure-toi que le chemin vers cn est bon (souvent $lib/utils ou $lib/utils.ts)
	import { cn } from "$lib/utils";

	type $$Props = HTMLTextareaAttributes;

	let className: string | undefined | null = undefined;
	export { className as class };
    export let value: string | number | undefined | null = undefined;
</script>

<textarea
    bind:value
	class={cn(
		"flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
		className
	)}
	{...$$restProps}
	on:input
	on:change
	on:keyup
	on:keydown
	on:blur
	on:focus
/>
