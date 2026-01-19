<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { attendees } from "@/stores";
    import Ellipsis from "lucide-svelte/icons/ellipsis";
    import * as DropdownMenu from "./ui/dropdown-menu";
  
    export let id: string;
    export let slot_id: string;
    export let unsubscribe_slot;

    async function toggle_attendance(user_id: string, slot_id: string) {
      // Call the API to toggle the user's attendance
      const toggle_attendance = await fetch(`/api/users/attendee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id, slot_id }),
      });

      if(toggle_attendance.status == 200) {
        try {
          const response = await toggle_attendance.json();
          attendees.set(response.attendees);
          window.location.reload();
        } catch (error) {
          console.error("Error toggling attendance", error);
        }
      }
    }

    async function toggle_responsible(user_id: string, slot_id: string) {
      const res = await fetch(`/api/slots/toggle_responsible`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, slot_id })
      });
      if (res.status === 200) {
        window.location.reload();
      }
    }
  </script>

  <DropdownMenu.Root>
    <DropdownMenu.Trigger asChild let:builder>
      <Button
        variant="ghost"
        builders={[builder]}
        size="icon"
        class="relative h-8 w-8 p-0"
      >
        <span class="sr-only">Open menu</span>
        <Ellipsis class="h-4 w-4" />
      </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      
      <DropdownMenu.Group>
        <DropdownMenu.Label>Actions</DropdownMenu.Label>
        <!--Copy the user UID to the clipboard-->
        <DropdownMenu.Item on:click={() => navigator.clipboard.writeText(id)}>
          Copier l'identifiant
        </DropdownMenu.Item>
      </DropdownMenu.Group>

      <DropdownMenu.Separator />

      <DropdownMenu.Group>
        <!--Remove the user from the slot-->
        <DropdownMenu.Item on:click={() => unsubscribe_slot(id, slot_id)}>
          Retirer de la séance
        </DropdownMenu.Item>

        <!--Toggle the user's attendance-->
        <DropdownMenu.Item on:click={() => toggle_attendance(id, slot_id)}>
          Modifier la présence
        </DropdownMenu.Item>

        <!--Toggle co-responsible rights (instructor + participant required)-->
        <DropdownMenu.Item on:click={() => toggle_responsible(id, slot_id)}>
          Coresponsable
        </DropdownMenu.Item>
      </DropdownMenu.Group>

    </DropdownMenu.Content>
  </DropdownMenu.Root>