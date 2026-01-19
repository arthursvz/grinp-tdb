<script lang="ts">
    import {
      Card,
      CardHeader,
      CardTitle
    } from "$lib/components/ui/card";
    import Button from "@/components/ui/button/button.svelte";

    import * as Form from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";

    import type { Slot, User } from "@prisma/client";
    
    import { getFlash } from "sveltekit-flash-message";
    import { page } from "$app/stores";
    import { superForm } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
    import { slotScheme } from "..";

    import SingleSlotCard from "./SingleSlotCard.svelte";
  
    const flash = getFlash(page, {
        clearOnNavigate: true,
        clearAfterMs: 10,
        clearArray: true,
    });

    export let data: {
        slots: Array<{
            slot: Slot;
            owner: User;
            participants_list: User[];
            attendees_list: User[];
        }>;
        user: User;
        form: any;
        all_users: User[];
        dateString: string;
    };

    export let slotDate: string;

    $: user = data.user;
    $: slots = data.slots || [];
    $: canCreateMore = slots.length < 3 && (user.instructor || user.root);
    $: hasClosureSlot = slots.some(s => s.slot.slot_type === 'FERMETURE');

    let showCreateMoreForm = false;
    let showCreateFirstForm = false;

    const form = superForm(data.form, {
        validators: zodClient(slotScheme),
        dataType: 'json'
    });

    const { form: formData, enhance } = form;

    async function create_slot(event: Event) {
        event.preventDefault();
        
        type form = {
            title: string;
            description: string;
            date: {
                starts_at: string;
                ends_at: string;
            };
            capacity: number;
        };

        const localFormData: form = {
            title: $formData.title,
            description: $formData.description,
            date: $formData.date,
            capacity: $formData.capacity,
        };

        try {
            const create = await fetch("/api/slots/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ form: localFormData, today: slotDate }),
            });
            
            if (create.status == 200) {
                try {
                    const response = await create.json();
                    $flash = {
                        type: "success",
                        message: "Le créneau a bien été créé !",
                    };
                    window.location.reload();
                } catch (error) {
                    console.error(error);
                    $flash = {
                        type: "error",
                        message: "Une erreur est survenue.",
                    };
                }
            } else {
                const errorData = await create.json();
                $flash = {
                    type: "error",
                    message: errorData.message || "Erreur lors de la création du créneau.",
                };
            }
        } catch (error) {
            console.error(error);
            $flash = {
                type: "error",
                message: "Veuillez vérifier les informations saisies.",
            };
        }
    }
</script>

{#if slots.length > 0}
    <!-- Display all slots the user can manage or participate in -->
    {#each slots as slotData (slotData.slot.id)}
        <SingleSlotCard
            slot={slotData.slot}
            owner={slotData.owner}
            {user}
            participants_list={slotData.participants_list}
            attendees_list={slotData.attendees_list}
            all_users={data.all_users}
        />
    {/each}

    <!-- Add new slot button for instructors if less than 3 slots and no closure -->
    {#if canCreateMore && !hasClosureSlot}
        <Card class="flex flex-col justify-between w-full">
            <div class="p-4 cursor-pointer hover:bg-black hover:bg-opacity-5 transition-colors" on:click={() => (showCreateMoreForm = !showCreateMoreForm)} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && (showCreateMoreForm = !showCreateMoreForm)}>
                <div class="flex items-center justify-between">
                    <div class="font-semibold text-lg">Créer un autre créneau</div>
                    <span class="text-lg">{showCreateMoreForm ? '▼' : '▶'}</span>
                </div>
            </div>
            {#if showCreateMoreForm}
                <form method="POST" on:submit|preventDefault={create_slot} use:enhance>
                    <div class="px-4 flex flex-col gap-4">
                        <div class="flex gap-4">
                            <Form.Field {form} name="title" class="w-full">
                                <Form.Control let:attrs>
                                    <Form.Label>Titre du créneau</Form.Label>
                                    <Input
                                        type="text"
                                        {...attrs}
                                        bind:value={$formData.title}
                                        placeholder="Titre du créneau"
                                    />
                                </Form.Control>
                                <Form.FieldErrors />
                            </Form.Field>

                            <Form.Field {form} name="capacity">
                                <Form.Control let:attrs>
                                    <Form.Label>Capacité</Form.Label>
                                    <Input
                                        type="number"
                                        {...attrs}
                                        on:change={e => $formData.capacity = parseInt(e.currentTarget.value)}
                                        placeholder="Capacité"
                                    />
                                </Form.Control>
                                <Form.FieldErrors />
                            </Form.Field>
                        </div>
                
                        <Form.Field {form} name="description" class="w-full">
                            <Form.Control let:attrs>
                                <Form.Label>Description</Form.Label>
                                <Input
                                    type="text"
                                    {...attrs}
                                    bind:value={$formData.description}
                                    placeholder="Description"
                                />
                            </Form.Control>
                            <Form.FieldErrors />
                        </Form.Field>

                        <div class="flex gap-4">
                            <Form.Field {form} name="date" class="w-full">
                                <Form.Control let:attrs>
                                    <Form.Label>Dates</Form.Label>
                                    <div class="flex gap-4 items-center">
                                        De
                                        <Input
                                            type="time"
                                            {...attrs}
                                            bind:value={$formData.date.starts_at}
                                        />
                                        à
                                        <Input
                                            type="time"
                                            {...attrs}
                                            bind:value={$formData.date.ends_at}
                                        />
                                    </div>
                                </Form.Control>
                                <Form.FieldErrors />
                            </Form.Field>
                        </div>
                
                        <Form.Button>Créer le créneau</Form.Button>
                    </div>
                </form>
            {/if}
        </Card>
    {/if}
{:else if (user.instructor || user.root)}
    <!-- No slots exist, show creation form -->
    <Card class="flex flex-col justify-between w-full">
        <div class="p-4 cursor-pointer hover:bg-black hover:bg-opacity-5 transition-colors" on:click={() => (showCreateFirstForm = !showCreateFirstForm)} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && (showCreateFirstForm = !showCreateFirstForm)}>
            <div class="flex items-center justify-between">
                <div class="font-semibold text-lg">Créer un créneau</div>
                <span class="text-lg">{showCreateFirstForm ? '▼' : '▶'}</span>
            </div>
        </div>
        {#if showCreateFirstForm}
            <form method="POST" on:submit|preventDefault={create_slot} use:enhance>
                <div class="px-4 flex flex-col gap-4">
                    <div class="flex gap-4">
                        <Form.Field {form} name="title" class="w-full">
                            <Form.Control let:attrs>
                                <Form.Label>Titre du créneau</Form.Label>
                                <Input
                                    type="text"
                                    {...attrs}
                                    bind:value={$formData.title}
                                    placeholder="Titre du créneau"
                                />
                            </Form.Control>
                            <Form.FieldErrors />
                        </Form.Field>

                        <Form.Field {form} name="capacity">
                            <Form.Control let:attrs>
                                <Form.Label>Capacité</Form.Label>
                                <Input
                                    type="number"
                                    {...attrs}
                                    on:change={e => $formData.capacity = parseInt(e.currentTarget.value)}
                                    placeholder="Capacité"
                                />
                            </Form.Control>
                            <Form.FieldErrors />
                        </Form.Field>
                    </div>
            
                    <Form.Field {form} name="description" class="w-full">
                        <Form.Control let:attrs>
                            <Form.Label>Description</Form.Label>
                            <Input
                                type="text"
                                {...attrs}
                                bind:value={$formData.description}
                                placeholder="Description"
                            />
                        </Form.Control>
                        <Form.FieldErrors />
                    </Form.Field>

                    <div class="flex gap-4">
                        <Form.Field {form} name="date" class="w-full">
                            <Form.Control let:attrs>
                                <Form.Label>Dates</Form.Label>
                                <div class="flex gap-4 items-center">
                                    De
                                    <Input
                                        type="time"
                                        {...attrs}
                                        bind:value={$formData.date.starts_at}
                                    />
                                    à
                                    <Input
                                        type="time"
                                        {...attrs}
                                        bind:value={$formData.date.ends_at}
                                    />
                                </div>
                            </Form.Control>
                            <Form.FieldErrors />
                        </Form.Field>
                    </div>
            
                    <Form.Button>Créer le créneau</Form.Button>
                </div>
            </form>
        {/if}
    </Card>
{:else}
    <Card class="flex flex-col justify-between w-full">
        <CardHeader class="p-4">
            <CardTitle>Aucun créneau</CardTitle>
            <p class="text-sm text-muted-foreground">Il n'y a pas de créneau pour le moment.</p>
        </CardHeader>
    </Card>
{/if}