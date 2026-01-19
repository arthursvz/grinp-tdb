<script lang="ts">
    import {
      Card,
      CardContent,
      CardHeader,
      CardTitle,
    } from "$lib/components/ui/card";
    import Button from "@/components/ui/button/button.svelte";
    import UserStatsOverview from "$lib/components/UserStatsOverview.svelte";
    import logo from "$lib/assets/logo.png";

    
    export let data;

    $: user = data?.user;
    
    let showStats = true;
</script>

{#if user}
    <div class="w-full space-y-6 pb-12">
        <div class="w-3/4 mx-auto py-6">
            <h1 class="text-3xl font-bold">Bienvenue {user.first_name || 'utilisateur'} !</h1>
        </div>

        <div class="w-3/4 mx-auto flex gap-6 items-start">
            <div class="flex-1">
                <div 
                    class="p-4 cursor-pointer hover:bg-black hover:bg-opacity-5 transition-colors border-b"
                    on:click={() => showStats = !showStats}
                    role="button"
                    tabindex="0"
                    on:keydown={(e) => e.key === 'Enter' && (showStats = !showStats)}
                >
                    <div class="flex items-center justify-between gap-2">
                        <div class="flex-1">
                            <h2 class="text-xl font-bold">Vos statistiques</h2>
                        </div>
                        <span class="text-lg">{showStats ? '▼' : '▶'}</span>
                    </div>
                </div>

                {#if showStats}
                    <div class="pt-6">
                        <UserStatsOverview user_id={user.id} />
                    </div>
                {/if}
            </div>
            <div class="flex-shrink-0">
                <img src={logo} alt="Logo GR'INP" class="h-40 w-40 object-contain" />
            </div>
        </div>

        <div class="w-3/4 mx-auto">
            <div class="border-b pb-4">
                <h1 class="text-2xl font-bold">À propos du club</h1>
            </div>

            <div class="pt-6 space-y-6">
                <div>
                    <h2 class="text-xl font-bold mb-2">Qui sommes-nous ?</h2>
                    <p>
                        Le club d'escalade de l'INP Toulouse, rattaché à l'Association
                        Sportive de l'INP, est ouvert à tous les passionnés de grimpe, du
                        débutant au confirmé. Que vous souhaitiez apprendre à grimper,
                        progresser techniquement ou participer à des compétitions, notre
                        club vous propose un cadre dynamique et bien encadré.
                    </p>
                </div>

                <div>
                    <h2 class="text-xl font-bold mb-2">Nos créneaux d'entraînement</h2>
                    <p>
                        Nous proposons des créneaux après les cours, pratiquement tous les
                        jours. Nos initiateurs SAE (Structure Artificielle d'Escalade) vous
                        aideront à apprendre les techniques de base de la grimpe et de
                        l'assurage, ou à vous perfectionner en escalade en tête. Pour
                        garantir un encadrement de qualité, chaque créneau est limité à 18
                        participants par initiateur.
                    </p>
                </div>

                <div>
                    <h2 class="text-xl font-bold mb-2">Participez aux compétitions</h2>
                    <p>
                        Notre club participe régulièrement aux compétitions universitaires
                        régionales, et nos membres ont l'opportunité de représenter l'INP
                        Toulouse aux prestigieux championnats de France des Grandes Écoles.
                    </p>
                </div>

                <div>
                    <h2 class="text-xl font-bold mb-2">Événements spéciaux</h2>
                    <p>
                        Chaque année, nous organisons la Nuit de l'Escalade, un événement
                        incontournable pour les amateurs d'escalade, avec des activités
                        diverses autour de l'escalade dans une ambiance conviviale garantie.
                    </p>
                </div>
            </div>
        </div>
    </div>
{:else}
    <Card class="m-auto w-full flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <CardHeader class="w-3/4">
            <CardTitle class="pb-4">
                <h1 class="text-3xl font-bold">Bienvenue !</h1>
                sur le site du Club d'Escalade de l'INP Toulouse
            </CardTitle>
            <!--<img src={logo} alt="logo" />-->
            <!--<CardDescription>Entrez votre E-Mail ci dessous pour vous connecter</CardDescription>-->
            <p>
                Le club d'escalade de l'INP Toulouse, rattaché à l'Association
                Sportive de l'INP, est ouvert à tous les passionnés de grimpe, du
                débutant au confirmé. Que vous souhaitiez apprendre à grimper,
                progresser techniquement ou participer à des compétitions, notre
                club vous propose un cadre dynamique et bien encadré.
            </p>
        </CardHeader>

        <div class="relative">
            <div class="absolute inset-0 flex items-center">
                <span class="m-4 w-full border-t" />
            </div>
        </div>

        <CardContent class="flex flex-col items-center gap-4 pt-6 w-3/4">
            <h1 class="text-xl font-bold">Rejoignez-nous !</h1>
            <p>
                Sur ce site, vous pouvez vous inscrire facilement à nos créneaux
                d'escalade et découvrir les différents événements proposés par le
                club. Rejoignez-nous pour partager votre passion et progresser
                ensemble dans une ambiance sportive et amicale.
            </p>

            <!--<h2>Nos créneaux d'entraînement</h2>
            <p>
                Nous proposons des créneaux après les cours, pratiquement tous les
                jours. Nos initiateurs SAE (Structure Artificielle d'Escalade) vous
                aideront à apprendre les techniques de base de la grimpe et de
                l'assurage, ou à vous perfectionner en escalade en tête. Pour
                garantir un encadrement de qualité, chaque créneau est limité à 18
                participants par initiateur.
            </p>

            <h2>Participez aux compétitions</h2>
            <p>
                Notre club participe régulièrement aux compétitions universitaires
                régionales, et nos membres ont l'opportunité de représenter l'INP
                Toulouse aux prestigieux championnats de France des Grandes Écoles.
            </p>

            <h2>Événements spéciaux</h2>
            <p>
                Chaque année, nous organisons la Nuit de l'Escalade, un événement
                incontournable pour les amateurs d'escalade, avec des activités
                diverses autour de l'escalade dans une ambiance conviviale garantie.
            </p>-->
            <Button href="/login" class="w-1/2">Se connecter</Button>
        </CardContent>
    </Card>
{/if}
