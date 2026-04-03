<script lang="ts">
    import {flip} from "svelte/animate";
    import {dndzone} from "svelte-dnd-action";
	import Creature from '$lib/creature.svelte';

    interface CreatureType {
        id: number,
        name: string,
        order: number,
        conditions: string[]
    }

    let defaultCreatures: CreatureType[] = [
        {
            id: 1,
            name:"Blood",
            order: 1,
            conditions: [
                "Blinded",
                "Clumsy",
                "Concealed",
                "Confused",
                "Controlled",
                "Dazzled",
                "Deafened",
                "Doomed",
                "Drained",
                "Dying",
                "Encumbered",
                "Enfeebled",
                "Fascinated",
                "Fatigued",
                "Fleeing",
                "Frightened",
                "Grabbed",
                "Hidden",
                "Immobilized",
                "Invisible",
                "Observed",
                "Off-Guard",
                "Paralyzed",
                "Persistent Damage",
                "Petrified",
                "Prone",
                "Quickened",
                "Restrained",
                "Sickened",
                "Slowed",
                "Stunned",
                "Stupefied",
                "Taunted",
                "Unconscious",
                "Undetected",
                "Unnoticed",
                "Wounded"
            ]
        },
        {
            id: 2,
            name:"Agronakis",
            order: 2,
            conditions: [
                "Blinded",
                "Clumsy",
                "Concealed",
                "Confused",
                "Controlled",
                "Dazzled",
                "Deafened",
                "Doomed",
                "Drained",
                "Dying",
                "Encumbered",
                "Enfeebled",
                "Fascinated",
                "Fatigued",
                "Fleeing",
                "Frightened",
                "Grabbed",
                "Hidden",
                "Immobilized",
                "Invisible",
                "Observed",
                "Off-Guard",
                "Paralyzed",
                "Persistent Damage",
                "Petrified",
                "Prone",
                "Quickened",
                "Restrained",
                "Sickened",
                "Slowed",
                "Stunned",
                "Stupefied",
                "Taunted",
                "Unconscious",
                "Undetected",
                "Unnoticed",
                "Wounded"
            ]
        },
        {
            id: 3,
            name:"Gadzius",
            order: 3,
            conditions: [
                "Blinded",
                "Clumsy",
                "Concealed",
                "Confused",
                "Controlled",
                "Dazzled",
                "Deafened",
                "Doomed",
                "Drained",
                "Dying",
                "Encumbered",
                "Enfeebled",
                "Fascinated",
                "Fatigued",
                "Fleeing",
                "Frightened",
                "Grabbed",
                "Hidden",
                "Immobilized",
                "Invisible",
                "Observed",
                "Off-Guard",
                "Paralyzed",
                "Persistent Damage",
                "Petrified",
                "Prone",
                "Quickened",
                "Restrained",
                "Sickened",
                "Slowed",
                "Stunned",
                "Stupefied",
                "Taunted",
                "Unconscious",
                "Undetected",
                "Unnoticed",
                "Wounded"
            ]
        },
        {
            id: 4,
            name:"Goblin 1",
            order: 4,
            conditions: [
                "Blinded",
                "Clumsy",
                "Concealed",
                "Confused",
                "Controlled",
                "Dazzled",
                "Deafened",
                "Doomed",
                "Drained",
                "Dying",
                "Encumbered",
                "Enfeebled",
                "Fascinated",
                "Fatigued",
                "Fleeing",
                "Frightened",
                "Grabbed",
                "Hidden",
                "Immobilized",
                "Invisible",
                "Observed",
                "Off-Guard",
                "Paralyzed",
                "Persistent Damage",
                "Petrified",
                "Prone",
                "Quickened",
                "Restrained",
                "Sickened",
                "Slowed",
                "Stunned",
                "Stupefied",
                "Taunted",
                "Unconscious",
                "Undetected",
                "Unnoticed",
                "Wounded"
            ]
        },
        {
            id: 5,
            name:"Goblin 2",
            order: 5,
            conditions: [
                "Blinded",
                "Clumsy",
                "Concealed",
                "Confused",
                "Controlled",
                "Dazzled",
                "Deafened",
                "Doomed",
                "Drained",
                "Dying",
                "Encumbered",
                "Enfeebled",
                "Fascinated",
                "Fatigued",
                "Fleeing",
                "Frightened",
                "Grabbed",
                "Hidden",
                "Immobilized",
                "Invisible",
                "Observed",
                "Off-Guard",
                "Paralyzed",
                "Persistent Damage",
                "Petrified",
                "Prone",
                "Quickened",
                "Restrained",
                "Sickened",
                "Slowed",
                "Stunned",
                "Stupefied",
                "Taunted",
                "Unconscious",
                "Undetected",
                "Unnoticed",
                "Wounded"
            ]
        },
        {
            id: 6,
            name:"Bugbear 1",
            order: 6,
            conditions: [
                "Blinded",
                "Clumsy",
                "Concealed",
                "Confused",
                "Controlled",
                "Dazzled",
                "Deafened",
                "Doomed",
                "Drained",
                "Dying",
                "Encumbered",
                "Enfeebled",
                "Fascinated",
                "Fatigued",
                "Fleeing",
                "Frightened",
                "Grabbed",
                "Hidden",
                "Immobilized",
                "Invisible",
                "Observed",
                "Off-Guard",
                "Paralyzed",
                "Persistent Damage",
                "Petrified",
                "Prone",
                "Quickened",
                "Restrained",
                "Sickened",
                "Slowed",
                "Stunned",
                "Stupefied",
                "Taunted",
                "Unconscious",
                "Undetected",
                "Unnoticed",
                "Wounded"
            ]
        }
    ]
    let creatures = $state<CreatureType[]>(defaultCreatures);
    let round = $state<number>(1);

    function handleDndConsider(e: CustomEvent) {
        creatures = e.detail.items;
    }
    function handleDndFinalize(e: CustomEvent) {
        // Update the initiatize order when drag and dropped
        creatures = e.detail.items.map((item: CreatureType, index: number) => {
            item.order = index + 1;
            return item;
        })
        console.log($state.snapshot(creatures));
    }
    function handleClickNext() {
        creatures.push(creatures.splice(0, 1)[0]);

        // If we're back to order 1, increase the round
        if (creatures.length > 0 && creatures[0].order === 1) {
            round += 1;
        }
    }
</script>

<header>
    <h1>Combat Tracker</h1>
</header>

<div class="toolbar">
    <button>🡐</button>
    <span>Round {round}</span>
    <button onclick={handleClickNext}>🡒</button>
</div>

<div
    class="initiative-list"
    use:dndzone={{
        items: creatures,
        dropTargetStyle: { outline: 'none'}
    }}
    onconsider="{handleDndConsider}"
    onfinalize="{handleDndFinalize}"
>
    {#each creatures as creature (creature.id)}
    <div animate:flip="{{duration: 200}}">
        <Creature name={creature.name} order={creature.order} conditions={creature.conditions} />

        {#if creature.order === creatures.length }
        <div class="new-round-divider">Round {round + 1}</div>
        {/if}
    </div>
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
    .new-round-divider {
        display: flex;
        justify-content: center;
        font-size: 1.5rem;
        padding: .5rem 0rem;
    }
</style>
