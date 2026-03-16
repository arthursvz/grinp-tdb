<script lang="ts">
    import * as Calendar from "$lib/components/ui/calendar/index.js";
    import * as Select from "$lib/components/ui/select/index.js";
    import { cn } from "$lib/utils.js";
    import {
      DateFormatter,
      getLocalTimeZone,
      today,
    } from "@internationalized/date";
    import { Calendar as CalendarPrimitive } from "bits-ui";

    type $$Props = CalendarPrimitive.Props & {
        markers?: Array<{ date: string; type: string; isEnrolled: boolean }>;
    };
    type $$Events = CalendarPrimitive.DayEvents;

    export let value: $$Props["value"] = undefined;
    export let placeholder: $$Props["placeholder"] = today(getLocalTimeZone());
    export let weekdayFormat: $$Props["weekdayFormat"] = "short";
    export let markers: $$Props["markers"] = [];

    const monthOptions = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Decembre",
    ].map((month, i) => ({ value: i + 1, label: month }));

    const monthFmt = new DateFormatter("fr-FR", { month: "long" });

    const yearOptions = Array.from({ length: 10 }, (_, i) => ({
        label: String(new Date().getFullYear() + i),
        value: new Date().getFullYear() + i,
    }));

    $: defaultYear = placeholder
        ? { value: placeholder.year, label: String(placeholder.year) }
        : undefined;

    $: defaultMonth = placeholder
        ? {
              value: placeholder.month,
              label: monthFmt
                  .format(placeholder.toDate(getLocalTimeZone()))
                  .toString()
                  .split("")
                  .map((c, i) => (i === 0 ? c.toUpperCase() : c))
                  .join(""),
          }
        : undefined;

    let className: $$Props["class"] = undefined;
    export { className as class };

    // --- CORRECTION DES COULEURS ICI ---
    function getMarkerClass(type: string, isEnrolled: boolean): string {
        let colorClass = "";
        
        // On normalise le type en majuscules pour éviter les erreurs de casse
        const normalizedType = type ? type.toUpperCase() : "";

        switch (normalizedType) {
            case 'EVENEMENT': // C'est ici qu'on force le VERT
            case 'AUTO':      // Je garde AUTO au cas où
                colorClass = "border-green-600 text-green-600 bg-green-600";
                break;

            case 'FERMETURE': // ROUGE
                colorClass = "border-red-600 text-red-600 bg-red-600";
                break;

            case 'CRENEAU':   // BLEU (Standard)
            case 'MANUAL':    
            default:          // Par défaut -> Bleu
                colorClass = "border-blue-600 text-blue-600 bg-blue-600";
                break;
        }

        // Gestion Plein vs Vide
        if (isEnrolled) {
            return colorClass;
        } else {
            return cn(colorClass, "bg-transparent border-[2px]"); 
        }
    }
</script>

<CalendarPrimitive.Root
    {weekdayFormat}
    class={cn("rounded-md border p-3", className)}
    {...$$restProps}
    on:keydown
    let:months
    let:weekdays
    bind:value
    bind:placeholder
>
    <Calendar.Header class="flex flex-col items-center">
        <Calendar.Heading class="flex w-full items-center justify-between gap-2">
            <Select.Root
                selected={defaultMonth}
                items={monthOptions}
                onSelectedChange={(v) => {
                    if (!v || !placeholder) return;
                    if (v.value === placeholder?.month) return;
                    placeholder = placeholder.set({ month: v.value });
                }}
            >
                <Select.Trigger aria-label="Select month" class="w-[60%]">
                    <Select.Value placeholder="Select month" />
                </Select.Trigger>
                <Select.Content class="max-h-[200px] overflow-y-auto">
                    {#each monthOptions as { value, label }}
                        <Select.Item {value} {label}>{label}</Select.Item>
                    {/each}
                </Select.Content>
            </Select.Root>
            <Select.Root
                selected={defaultYear}
                items={yearOptions}
                onSelectedChange={(v) => {
                    if (!v || !placeholder) return;
                    if (v.value === placeholder?.year) return;
                    placeholder = placeholder.set({ year: v.value });
                }}
            >
                <Select.Trigger aria-label="Select year" class="w-[40%]">
                    <Select.Value placeholder="Select year" />
                </Select.Trigger>
                <Select.Content class="max-h-[200px] overflow-y-auto">
                    {#each yearOptions as { value, label }}
                        <Select.Item {value} {label}>{label}</Select.Item>
                    {/each}
                </Select.Content>
            </Select.Root>
        </Calendar.Heading>
    </Calendar.Header>

    <Calendar.Months class="mx-auto text-center items-center">
        {#each months as month}
            <Calendar.Grid>
                <Calendar.GridHead>
                    <Calendar.GridRow class="flex justify-center">
                        {#each weekdays as weekday}
                            <Calendar.HeadCell>
                                {weekday.slice(0, 2)}
                            </Calendar.HeadCell>
                        {/each}
                    </Calendar.GridRow>
                </Calendar.GridHead>
                <Calendar.GridBody>
                    {#each month.weeks as weekDates}
                        <Calendar.GridRow class="mt-2 w-full justify-center">
                            {#each weekDates as date}
                                <Calendar.Cell {date} class="p-0 relative focus-within:z-20">
                                    <div class="w-full h-full flex flex-col items-center justify-between pt-1.5 pb-1">
                                        
                                        <Calendar.Day {date} month={month.value} />
                                        
                                        <div class="flex justify-center gap-0.5 h-[6px] items-end">
                                            {#if markers}
                                                {#each markers.filter(m => m.date === date.toString()) as marker}
                                                    <div 
                                                        class={cn(
                                                            "h-1.5 w-1.5 rounded-full flex-shrink-0", 
                                                            getMarkerClass(marker.type, marker.isEnrolled)
                                                        )}
                                                    />
                                                {/each}
                                            {/if}
                                        </div>

                                    </div>
                                </Calendar.Cell>
                            {/each}
                        </Calendar.GridRow>
                    {/each}
                </Calendar.GridBody>
            </Calendar.Grid>
        {/each}
    </Calendar.Months>
</CalendarPrimitive.Root>
