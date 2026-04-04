<script lang="ts">
    import {flip} from "svelte/animate";
    import {dragHandleZone, dragHandle} from "svelte-dnd-action";
	import Creature from '$lib/creature.svelte';
    import AddForm from "$lib/add_form.svelte";
    import EditForm from "$lib/edit_form.svelte";

    interface ConditionType {
        name: string,
        value: number | null
    }

    interface CreatureType {
        id: number,
        name: string,
        order: number,
        conditions: ConditionType[]
    }
    interface AddFormData {
        name: string
    }
    interface EditClickData {
        name: string
    }

    let defaultCreatures: CreatureType[] = [
        {
            id: 1,
            name:"Blood",
            order: 1,
            conditions: [
                // { name: "Blinded", value: null },
                // { name: "Clumsy", value: 1 },
                // { name: "Concealed", value: null },
                // { name: "Confused", value: null },
                // { name: "Controlled", value: null },
                // { name: "Dazzled", value: null },
                // { name: "Deafened", value: null },
                // { name: "Doomed", value: 1 },
                // { name: "Drained", value: 1 },
                // { name: "Dying", value: 1 },
                // { name: "Encumbered", value: null },
                // { name: "Enfeebled", value: 1 },
                // { name: "Fascinated", value: null },
                // { name: "Fatigued", value: null },
                // { name: "Fleeing", value: null },
                // { name: "Frightened", value: 1 },
                // { name: "Grabbed", value: null },
                // { name: "Hidden", value: null },
                // { name: "Immobilized", value: null },
                // { name: "Invisible", value: null },
                // { name: "Observed", value: null },
                // { name: "Off-Guard", value: null },
                // { name: "Paralyzed", value: null },
                // { name: "Persistent Damage", value: 1 },
                // { name: "Petrified", value: null },
                // { name: "Prone", value: null },
                // { name: "Quickened", value: null },
                { name: "Restrained", value: null },
                { name: "Sickened", value: 1 },
                { name: "Slowed", value: 1 },
                { name: "Stunned", value: 1 },
                { name: "Stupefied", value: 1 },
                { name: "Taunted", value: null },
                { name: "Unconscious", value: null },
                { name: "Undetected", value: null },
                { name: "Unnoticed", value: null },
                { name: "Wounded", value: 1 }
            ]
        },
        {
            id: 2,
            name:"Agronakis",
            order: 2,
            conditions: [
                // { name: "Blinded", value: null },
                // { name: "Clumsy", value: 1 },
                // { name: "Concealed", value: null },
                // { name: "Confused", value: null },
                // { name: "Controlled", value: null },
                // { name: "Dazzled", value: null },
                // { name: "Deafened", value: null },
                // { name: "Doomed", value: 1 },
                // { name: "Drained", value: 1 },
                // { name: "Dying", value: 1 },
                // { name: "Encumbered", value: null },
                // { name: "Enfeebled", value: 1 },
                // { name: "Fascinated", value: null },
                // { name: "Fatigued", value: null },
                // { name: "Fleeing", value: null },
                // { name: "Frightened", value: 1 },
                // { name: "Grabbed", value: null },
                // { name: "Hidden", value: null },
                // { name: "Immobilized", value: null },
                // { name: "Invisible", value: null },
                // { name: "Observed", value: null },
                // { name: "Off-Guard", value: null },
                // { name: "Paralyzed", value: null },
                // { name: "Persistent Damage", value: 1 },
                // { name: "Petrified", value: null },
                // { name: "Prone", value: null },
                // { name: "Quickened", value: null },
                { name: "Restrained", value: null },
                { name: "Sickened", value: 1 },
                { name: "Slowed", value: 1 },
                { name: "Stunned", value: 1 },
                { name: "Stupefied", value: 1 },
                { name: "Taunted", value: null },
                { name: "Unconscious", value: null },
                { name: "Undetected", value: null },
                { name: "Unnoticed", value: null },
                { name: "Wounded", value: 1 }
            ]
        },
        {
            id: 3,
            name:"Gadzius",
            order: 3,
            conditions: [
                // { name: "Blinded", value: null },
                // { name: "Clumsy", value: 1 },
                // { name: "Concealed", value: null },
                // { name: "Confused", value: null },
                // { name: "Controlled", value: null },
                // { name: "Dazzled", value: null },
                // { name: "Deafened", value: null },
                // { name: "Doomed", value: 1 },
                // { name: "Drained", value: 1 },
                // { name: "Dying", value: 1 },
                // { name: "Encumbered", value: null },
                // { name: "Enfeebled", value: 1 },
                // { name: "Fascinated", value: null },
                // { name: "Fatigued", value: null },
                // { name: "Fleeing", value: null },
                // { name: "Frightened", value: 1 },
                // { name: "Grabbed", value: null },
                // { name: "Hidden", value: null },
                // { name: "Immobilized", value: null },
                // { name: "Invisible", value: null },
                // { name: "Observed", value: null },
                // { name: "Off-Guard", value: null },
                // { name: "Paralyzed", value: null },
                // { name: "Persistent Damage", value: 1 },
                // { name: "Petrified", value: null },
                // { name: "Prone", value: null },
                // { name: "Quickened", value: null },
                { name: "Restrained", value: null },
                { name: "Sickened", value: 1 },
                { name: "Slowed", value: 1 },
                { name: "Stunned", value: 1 },
                { name: "Stupefied", value: 1 },
                { name: "Taunted", value: null },
                { name: "Unconscious", value: null },
                { name: "Undetected", value: null },
                { name: "Unnoticed", value: null },
                { name: "Wounded", value: 1 }
            ]
        },
        {
            id: 4,
            name:"Goblin 1",
            order: 4,
            conditions: [
                // { name: "Blinded", value: null },
                // { name: "Clumsy", value: 1 },
                // { name: "Concealed", value: null },
                // { name: "Confused", value: null },
                // { name: "Controlled", value: null },
                // { name: "Dazzled", value: null },
                // { name: "Deafened", value: null },
                // { name: "Doomed", value: 1 },
                // { name: "Drained", value: 1 },
                // { name: "Dying", value: 1 },
                // { name: "Encumbered", value: null },
                // { name: "Enfeebled", value: 1 },
                // { name: "Fascinated", value: null },
                // { name: "Fatigued", value: null },
                // { name: "Fleeing", value: null },
                // { name: "Frightened", value: 1 },
                // { name: "Grabbed", value: null },
                // { name: "Hidden", value: null },
                // { name: "Immobilized", value: null },
                // { name: "Invisible", value: null },
                // { name: "Observed", value: null },
                // { name: "Off-Guard", value: null },
                // { name: "Paralyzed", value: null },
                // { name: "Persistent Damage", value: 1 },
                // { name: "Petrified", value: null },
                // { name: "Prone", value: null },
                // { name: "Quickened", value: null },
                { name: "Restrained", value: null },
                { name: "Sickened", value: 1 },
                { name: "Slowed", value: 1 },
                { name: "Stunned", value: 1 },
                { name: "Stupefied", value: 1 },
                { name: "Taunted", value: null },
                { name: "Unconscious", value: null },
                { name: "Undetected", value: null },
                { name: "Unnoticed", value: null },
                { name: "Wounded", value: 1 }
            ]
        },
        {
            id: 5,
            name:"Goblin 2",
            order: 5,
            conditions: [
                // { name: "Blinded", value: null },
                // { name: "Clumsy", value: 1 },
                // { name: "Concealed", value: null },
                // { name: "Confused", value: null },
                // { name: "Controlled", value: null },
                // { name: "Dazzled", value: null },
                // { name: "Deafened", value: null },
                // { name: "Doomed", value: 1 },
                // { name: "Drained", value: 1 },
                // { name: "Dying", value: 1 },
                // { name: "Encumbered", value: null },
                // { name: "Enfeebled", value: 1 },
                // { name: "Fascinated", value: null },
                // { name: "Fatigued", value: null },
                // { name: "Fleeing", value: null },
                // { name: "Frightened", value: 1 },
                // { name: "Grabbed", value: null },
                // { name: "Hidden", value: null },
                // { name: "Immobilized", value: null },
                // { name: "Invisible", value: null },
                // { name: "Observed", value: null },
                // { name: "Off-Guard", value: null },
                // { name: "Paralyzed", value: null },
                // { name: "Persistent Damage", value: 1 },
                // { name: "Petrified", value: null },
                // { name: "Prone", value: null },
                // { name: "Quickened", value: null },
                { name: "Restrained", value: null },
                { name: "Sickened", value: 1 },
                { name: "Slowed", value: 1 },
                { name: "Stunned", value: 1 },
                { name: "Stupefied", value: 1 },
                { name: "Taunted", value: null },
                { name: "Unconscious", value: null },
                { name: "Undetected", value: null },
                { name: "Unnoticed", value: null },
                { name: "Wounded", value: 1 }
            ]
        },
        {
            id: 6,
            name:"Bugbear 1",
            order: 6,
            conditions: [
                // { name: "Blinded", value: null },
                // { name: "Clumsy", value: 1 },
                // { name: "Concealed", value: null },
                // { name: "Confused", value: null },
                // { name: "Controlled", value: null },
                // { name: "Dazzled", value: null },
                // { name: "Deafened", value: null },
                // { name: "Doomed", value: 1 },
                // { name: "Drained", value: 1 },
                // { name: "Dying", value: 1 },
                // { name: "Encumbered", value: null },
                // { name: "Enfeebled", value: 1 },
                // { name: "Fascinated", value: null },
                // { name: "Fatigued", value: null },
                // { name: "Fleeing", value: null },
                // { name: "Frightened", value: 1 },
                // { name: "Grabbed", value: null },
                // { name: "Hidden", value: null },
                // { name: "Immobilized", value: null },
                // { name: "Invisible", value: null },
                // { name: "Observed", value: null },
                // { name: "Off-Guard", value: null },
                // { name: "Paralyzed", value: null },
                // { name: "Persistent Damage", value: 1 },
                // { name: "Petrified", value: null },
                // { name: "Prone", value: null },
                // { name: "Quickened", value: null },
                { name: "Restrained", value: null },
                { name: "Sickened", value: 1 },
                { name: "Slowed", value: 1 },
                { name: "Stunned", value: 1 },
                { name: "Stupefied", value: 1 },
                { name: "Taunted", value: null },
                { name: "Unconscious", value: null },
                { name: "Undetected", value: null },
                { name: "Unnoticed", value: null },
                { name: "Wounded", value: 1 }
            ]
        }
    ]
    let creatures = $state<CreatureType[]>(defaultCreatures);
    let round = $state<number>(1);
    let showAddForm = $state<boolean>(false);
    let showEditForm = $state<boolean>(false);
    let editingCreature = $state<CreatureType | undefined>(undefined);

    function handleDndConsider(e: CustomEvent) {
        creatures = e.detail.items;
    }
    function handleDndFinalize(e: CustomEvent) {
        // Update the initiative order when drag and dropped
        creatures = e.detail.items.map((item: CreatureType, index: number) => {
            item.order = index + 1;
            return item;
        })
    }
    function handleClickNext() {
        let creature = creatures.splice(0, 1)[0];
        creatures.push(creature);

        // If we're back to order 1, increase the round
        if (creatures.length > 0 && creatures[0].order === 1) {
            round += 1;
        }
    }
    function handleAddFormSubmit(data: AddFormData) {
        showAddForm = false;

        if ( creatures.some(creature => creature.name === data.name) ) {
            alert(`Creature with name "${data.name}" already exists!`)
            return;
        }
        let nextId = 1;
        let nextOrder = 1;

        if (creatures.length > 0) {
            nextId = Math.max(...creatures.map(creature => creature.id)) + 1;
        }
        if (creatures.length > 0) {
            nextOrder = Math.max(...creatures.map(creature => creature.order)) + 1;
        }
        creatures.push({
            id: nextId,
            name: data.name.trim(),
            order: nextOrder,
            conditions: []
        })
    }
    function handleClickEdit(data: EditClickData) {
        editingCreature = creatures.find((creature) => creature.name === data.name);
        if (editingCreature) {
            showEditForm = true;
        }
    }
</script>

<header>
    <h1>Combat Tracker</h1>
    <div class="header-right">
        <button onclick={() => (showAddForm = true)}>Add</button>
        <button onclick={() => (creatures = [])}>Clear</button>
    </div>
</header>

<div class="toolbar">
    <button>🡐</button>
    <span>Round {round}</span>
    <button onclick={handleClickNext}>🡒</button>
</div>

<div
    class="initiative-list"
    use:dragHandleZone={{
        items: creatures,
        dropTargetStyle: { outline: 'none'}
    }}
    onconsider="{handleDndConsider}"
    onfinalize="{handleDndFinalize}"
>
    {#each creatures as creature (creature.id)}
    <div
        class="creature-wrapper"
        animate:flip="{{duration: 200}}"
    >
        <div class="creature-drag-handle" use:dragHandle >
            <span>≡</span>
        </div>
        <Creature name={creature.name} order={creature.order} conditions={creature.conditions} onEditClick={handleClickEdit} />

        {#if creature.order === Math.max(...creatures.map(creature => creature.order)) }
        <div class="new-round-divider">Round {round + 1}</div>
        {/if}
    </div>
    {/each}
</div>

<AddForm bind:showAddForm onSubmit={handleAddFormSubmit}/>
<EditForm bind:showEditForm creature={editingCreature}/>

<style>
    :global(html, body) {
        margin: 0px;
        background-color: #202020;
        color: #f0ede2;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;

        & h1 {
            margin: 0px;
        }
    }

    .header-right {
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-end;
        gap: .4rem;

        & button {
            border: none;
            font-size: 1rem;
            color: #f0ede2;
            padding: 1rem;
            background-color: #505050;
            width: 4rem;

            &:hover {
                background-color: #606060;
                cursor: pointer;
            }
            &:active {
                background-color: #707070;
            }
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
    .creature-wrapper {
        display: grid;
        grid-template-rows: auto;
        grid-template-columns: 2rem 1fr;

        & .creature-drag-handle {
            background-color: #404040;
            font-size: 2rem;
            width: 2rem;
            padding: 0rem 0rem .5rem 0.2rem;
            display: flex;
            align-items: center;
            color: #8f8f8f;
        }
    }
    .new-round-divider {
        display: flex;
        justify-content: center;
        font-size: 1.5rem;
        padding: .5rem 0rem;
        grid-column: 1/3;
    }
</style>
