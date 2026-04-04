<script lang="ts">
    import { flip } from "svelte/animate";
    import { dragHandleZone, dragHandle } from "svelte-dnd-action";
	import Creature from '$lib/creature.svelte';
    import AddForm from "$lib/add_form.svelte";
    import EditForm from "$lib/edit_form.svelte";
    import type { ICreature, ICreatureOnEditClickData } from "$lib/creature.svelte";
    import type { IAddFormOnSubmitData } from "$lib/add_form.svelte";
    import type { IEditFormOnLevelDecreaseData, IEditFormOnLevelIncreaseData } from "$lib/edit_form.svelte";

    let creatures = $state<ICreature[]>([]);
    let round = $state<number>(1);
    let showAddForm = $state<boolean>(false);
    let showEditForm = $state<boolean>(false);
    let editingCreature = $state<ICreature|undefined>(undefined);

    function handleDndConsider(e: CustomEvent) {
        creatures = e.detail.items;
    }
    function handleDndFinalize(e: CustomEvent) {
        // Update the initiative order when drag and dropped
        creatures = e.detail.items.map((item: ICreature, index: number) => {
            item.order = index + 1;
            return item;
        })
    }
    function handleClickPrevious() {
        if (creatures.length === 0) {
            return;
        }
        let creature = creatures.pop();
        if (creature) {
            creatures.unshift(creature);
        }

        // If we're back to the max order, decrease the round
        let maxOrder: number = Math.max(...creatures.map(creature => creature.order));
        if (creatures.length > 0 && creatures[0].order === maxOrder) {
            round -= 1;
        }
    }
    function handleClickNext() {
        if (creatures.length === 0) {
            return;
        }
        let creature = creatures.splice(0, 1)[0];
        creatures.push(creature);

        // If we're back to order 1, increase the round
        let minOrder: number = Math.min(...creatures.map(creature => creature.order));
        if (creatures.length > 0 && creatures[0].order === minOrder) {
            round += 1;
        }
    }
    function handleAddFormSubmit(data: IAddFormOnSubmitData) {
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
    function handleClickEdit(data: ICreatureOnEditClickData) {
        editingCreature = creatures.find((creature) => creature.name === data.name);
        if (editingCreature) {
            showEditForm = true;
        }
    }
    function handleClearClick() {
        if (editingCreature) {
            editingCreature.conditions = [];
            round = 1;
            editingCreature = undefined;
        }
    }
    function handleDeleteClick(id: number) {
        creatures = creatures
            .filter((creature) => creature.id !== id)
            .map((item, index) => {
                item.order = index + 1;
                return item;
            })
    }
    function handleLevelIncrease(data: IEditFormOnLevelIncreaseData) {
        if (editingCreature && data?.name) {
            let index = editingCreature.conditions.map((e) => { return e.name }).indexOf(data.name)

            if (editingCreature.conditions[index].value) {
                editingCreature.conditions[index].value += 1;
            }
        }
    }
    function handleLevelDecrease(data: IEditFormOnLevelDecreaseData) {
        if (editingCreature && data?.name) {
            let index = editingCreature.conditions.map((e) => { return e.name }).indexOf(data.name)

            if (editingCreature.conditions[index].value) {
                editingCreature.conditions[index].value -= 1;

                if (editingCreature.conditions[index].value < 1) {
                    editingCreature.conditions.splice(index, 1);
                }
            }
        }
    }
    function handleKeyboardShortcuts(e: KeyboardEvent) {
        // Don't activate when editing forms are open
        if (showAddForm || showEditForm) {
            return;
        }
        switch (e.key) {
            case "a":
                showAddForm = true;
                e.preventDefault()
                break;
            case "n":
            case "ArrowRight":
            case " ":
                e.preventDefault();
                handleClickNext();
                break;
            case "b":
            case "ArrowLeft":
            case "Backspace":
                e.preventDefault();
                handleClickPrevious();
                break;
            default:
                break;
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
    <button onclick={handleClickPrevious}>🡐</button>
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

        <button class="creature-delete" onclick={() => handleDeleteClick(creature.id)} data-id={creature.id}>
            <span>🗙</span>
        </button>
        {#if creature.order === Math.max(...creatures.map(creature => creature.order)) }
        <div class="new-round-divider">Round {round + 1}</div>
        {/if}
    </div>
    {/each}
</div>

<AddForm bind:showAddForm onSubmit={handleAddFormSubmit}/>
<EditForm
    bind:showEditForm
    bind:creature={editingCreature}
    onClearClick={handleClearClick}
    onLevelIncrease={handleLevelIncrease}
    onLevelDecrease={handleLevelDecrease}
/>

<svelte:window on:keydown={handleKeyboardShortcuts} />

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
        grid-template-columns: 2rem 1fr 2rem;

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
    .creature-delete {
        background-color: #404040;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0rem 0rem 0.2rem 0rem;
        border: none;
        color: #f0ede2;

        &:hover {
            background-color: #802020;
            cursor: pointer;
        }

        &:active{
            background-color: #903030;
            cursor: pointer;
        }
    }
    .new-round-divider {
        display: flex;
        justify-content: center;
        font-size: 1.5rem;
        padding: .5rem 0rem;
        grid-column: 1 / 4;
    }
</style>
