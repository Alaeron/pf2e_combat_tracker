<script lang="ts">
	import Creature from '$lib/creature.svelte';

    let creatures = [
        { name:"Blood" },
        { name:"Agronakis" },
        { name:"Gadzius" },
        { name:"Goblin 1" },
        { name:"Goblin 2" },
        { name:"Bugbear 1" }
    ]
</script>

<header>
    <h1>Combat Tracker</h1>
</header>

<div class="toolbar">
    <button>🡐</button>
    <span>Round #</span>
    <button>🡒</button>
</div>

<div class="initiative-list">
    {#each creatures as creature, index (index)}
    <Creature name={creature.name} order={index + 1}/>
    {/each}
</div>

<style>
    :global(html, body) {
        margin: 0px;
        background-color: #202020;
        color: #f0ede2;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    header {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem 0rem 0rem 0rem;

        & h1 {
            margin: 0px;
        }
    }

    .toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1.5rem;
        padding: .4rem;

        & button {
            width: 10%;
            min-width: 50px;
            max-width: 100px;
            font-size: 2.2rem;
            background-color: #505050;
            border: none;
            border-radius: 0px;
            max-height: 50px;
            color: #f0ede2;

            &:hover {
                background-color: #606060;
                cursor: pointer;
            }
            &:active {
                background-color: #707070;
            }
        }
    }
    .initiative-list {
        display: flex;
        flex-flow: column;
        gap: 8px;
        margin: 0rem .4rem;
    }
</style>
