<script lang="ts">
    import Button from "@/components/ui/button/button.svelte";
    import "../app.css";

    import background2 from "$lib/assets/background-2.png";
    import background3 from "$lib/assets/background-3.png";
    import background4 from "$lib/assets/background-4.png";
    import type { PageData } from "./$types";

    import { Toaster } from "$lib/components/ui/sonner";

    export let data: PageData;

    const backgrounds = [background2, background3, background4];

    let currentBackgroundIndex = 0;
    let currentBackground = backgrounds[currentBackgroundIndex];

    function changeBackgroundRandom() {
        currentBackgroundIndex = Math.floor(Math.random() * backgrounds.length);
        currentBackground = backgrounds[currentBackgroundIndex];
    }

    // get event.locals.user to know if the user is logged in
        $: user = data?.user ?? null;
        $: root = data?.root ?? false;
        $: instructor = data?.instructor ?? false;
        $: bureau = data?.bureau ?? data?.user?.bureau ?? false;
        $: bureauRole = data?.bureauRole ?? data?.user?.bureau_role ?? null;
        $: canGestion = data?.canGestion ?? bureau ?? !!bureauRole ?? root;
        $: globalAlert = data?.globalAlert ?? null;

    import { browser } from "$app/environment";
    import { page } from "$app/stores";
    import { toast } from "svelte-sonner";
    import { writable } from "svelte/store";
        import { getFlash } from "sveltekit-flash-message";
        import { onDestroy } from "svelte";

        const flash = browser
            ? getFlash(page, {
                  clearOnNavigate: true,
                  clearAfterMs: 10,
                  clearArray: true,
              })
            : null;

        const unsubscribeFlash = flash?.subscribe((message) => {
            if (!message) return;

            if (message.type === "success") {
                toast.success(message.message, {
                    action: { label: "X", onClick: () => toast.dismiss() },
                });
                return;
            }

            toast.error(message.message, {
                action: { label: "X", onClick: () => toast.dismiss() },
            });
        });

        onDestroy(() => {
            unsubscribeFlash?.();
        });

    let menuOpen = false;

    function toggleMenu() { menuOpen = !menuOpen; }
    function closeMenu() { menuOpen = false; }

    if (browser) {
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
        document.documentElement.classList.add(prefersDarkMode.matches ? 'dark' : 'light');
        const theme = writable(prefersDarkMode.matches ? 'dark' : 'light');

        prefersDarkMode.addEventListener('change', event => {
            theme.set(event.matches ? 'dark' : 'light');
        });

        theme.subscribe(value => {
            document.documentElement.classList.remove('dark', 'light');
            document.documentElement.classList.add(value);
        });
    }
</script>

<div class="page flex h-full md:h-screen flex-col relative">
    <div class="background absolute inset-0"></div>

    <div class="content relative z-10 flex flex-col h-full">

        {#if globalAlert}
            <div class="w-full bg-red-600 text-white font-bold text-center p-3 animate-pulse sticky top-0 z-[100] shadow-md flex justify-center items-center gap-3 border-b-4 border-red-900">
                <span class="text-2xl">⚠️</span>
                <span class="uppercase tracking-widest text-sm md:text-base">{globalAlert}</span>
            </div>
        {/if}

        <Button on:click={toggleMenu} class="md:hidden hamburger-button h-16 flex justify-start" variant="background">
            <div class={`hamburger ${menuOpen ? 'open' : ''}`}>
                <span class="line"></span>
                <span class="line"></span>
                <span class="line"></span>
            </div>
        </Button>

        <header
            class={`sticky top-0 flex max-md:flex-col md:h-16 items-center gap-8 border-b bg-background p-4 w-full z-50 justify-between max-md:transition-transform max-md:duration-500 max-md:ease-in-out transform ${
                menuOpen ? "max-md:translate-y-0" : "max-md:-translate-y-full"
            }`}
        >
            <div class="flex flex-col items-center gap-4 md:flex-row">
                <Button href="/" class="text-3xl font-bold" variant="tertiary" on:click={closeMenu}>
                    Gr'INP
                </Button>

                {#if user}
                    <Button href="/calendar" variant="tertiary" on:click={closeMenu}>Créneaux</Button>
                    <Button href="/infos" variant="tertiary" on:click={closeMenu}>Infos</Button>
                    <Button href="/historique" variant="tertiary" on:click={closeMenu}>Historique</Button>
                {/if}
            </div>

            <div class="flex flex-col items-center gap-4 md:flex-row">
                {#if !user}
                    <Button
                        href="/login"
                        class="flex mx-4 md:px-4"
                        variant="secondary"
                        on:click={closeMenu}
                        >Connexion</Button
                    >
                    <Button href="/register" class="flex mx-4 md:px-4" on:click={closeMenu}>Inscription</Button>
                {:else}
                    {#if canGestion}
                        <Button
                            href="/gestion"
                            class="flex mx-4 md:px-4"
                            variant="tertiary"
                            on:click={closeMenu}
                        >Gestion</Button>
                    {/if}
                    <Button href="/logout" class="flex mx-4 md:px-4" data-sveltekit-reload on:click={closeMenu}>
                        Déconnexion
                    </Button>
                {/if}
            </div>
        </header>

        <div class="h-screen overflow-auto">
            <slot></slot>
        </div>
    </div>

    <Toaster />
</div>

<style>
    .background {
        background-size: cover;
        background-position: center;
        transition: background-image 1s ease-in-out;
        z-index: -1;
    }

    .content {
        background-color: transparent;
    }

    @media (max-width: 768px) {
        header {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: hsl(var(--background));
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 50;
        }

        header.max-md.-translate-y-full {
            transform: translateY(-100%);
        }

        header.max-md.translate-y-0 {
            transform: translateY(0);
        }
    }

    .hamburger {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        width: 30px;
        height: 30px;
        cursor: pointer;
        transition: all 0.5s ease;
        z-index: 60;
    }

    .line {
        height: 4px;
        width: 100%;
        background-color: hsl(var(--foreground));
        transition: all 0.5s ease;
        transform-origin: center;
    }

    .hamburger.open .line:nth-child(1) {
        transform: translateY(10px) rotate(45deg) scale(1.1);
    }

    .hamburger.open .line:nth-child(2) {
        opacity: 0;
        transform: scale(0);
    }

    .hamburger.open .line:nth-child(3) {
        transform: translateY(-10px) rotate(-45deg) scale(1.1);
    }
</style>
