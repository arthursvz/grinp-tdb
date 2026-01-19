<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { attendees } from "@/stores";
    import Ellipsis from "lucide-svelte/icons/ellipsis";
    import * as DropdownMenu from "./ui/dropdown-menu";
  
    export let id: string;
    export let slot_id: string;
    export let unsubscribe_slot;

    async function check_attendance(user_id: string, slot_id: string) {
      // Call the API to mark the user as present
      // API is /api/users/attendee
      const check_attendance = await fetch(`/api/users/attendee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id, slot_id }),
      });

      if(check_attendance.status == 200) {
        try {
          const response = await check_attendance.json();
          attendees.set(response.attendees);
        } catch (error) {
          console.error("Error marking user as present", error);
        }
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

        <!--Mark the user as present-->
        <DropdownMenu.Item on:click={() => check_attendance(id, slot_id)}>
          Marquer comme présent
        </DropdownMenu.Item>
      </DropdownMenu.Group>

    </DropdownMenu.Content>
  </DropdownMenu.Root>