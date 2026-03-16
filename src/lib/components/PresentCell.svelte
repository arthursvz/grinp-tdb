<script>
    import { attendees } from "$lib/stores";


    export let userId;

    // Vérifie si l'utilisateur est dans la liste des participants
    $: present = $attendees.some(user => user.id === userId) ? "Oui" : "Non";
</script>

<span>{present}</span>
