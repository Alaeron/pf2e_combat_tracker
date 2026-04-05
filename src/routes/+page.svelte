<script lang="ts">
    import { flip } from "svelte/animate";
    import { browser } from "$app/environment";
    import { dragHandleZone, dragHandle } from "svelte-dnd-action";
    import { ChevronsLeftIcon, ChevronsRightIcon, XIcon, FrownIcon, MenuIcon, PlusIcon, RotateCcwIcon, UploadIcon, DownloadIcon } from "svelte-feather-icons";
	import Creature from '$lib/creature.svelte';
    import AddForm from "$lib/add_form.svelte";
    import EditForm from "$lib/edit_form.svelte";
    import type { ICreature, ICreatureOnEditClickData } from "$lib/creature.svelte";
    import type { IAddFormOnSubmitData } from "$lib/add_form.svelte";
    import type { IEditFormOnLevelDecreaseData, IEditFormOnLevelIncreaseData } from "$lib/edit_form.svelte";

    let currentRoundState = $state<ICreature[]>([]);
    let nextRoundState = $state<ICreature[]>([]);
    let allCreatures = $derived(currentRoundState.concat(nextRoundState));
    let currentRound = $state<number>(1);
    let showAddForm = $state<boolean>(false);
    let showEditForm = $state<boolean>(false);
    let editingCreature = $state<ICreature|undefined>(undefined);

    if (browser) {
        let currentRoundStateLocal = localStorage.getItem("currentRoundState");
        let nextRoundStateLocal = localStorage.getItem("nextRoundState");
        let currentRoundLocal = localStorage.getItem("currentRound");

        currentRound = currentRoundLocal ? parseInt(currentRoundLocal) : 0;
        currentRoundState = currentRoundStateLocal ? JSON.parse(currentRoundStateLocal) : [];
        nextRoundState = nextRoundStateLocal ? JSON.parse(nextRoundStateLocal) : [];
    }
    $effect(() => {
        if (browser) {
            localStorage.setItem("currentRoundState", JSON.stringify(currentRoundState));
            localStorage.setItem("nextRoundState", JSON.stringify(nextRoundState));
            localStorage.setItem("currentRound", currentRound.toString());
        }
    });

    function calculateOrder(current: ICreature[], next: ICreature[]) {
        let nextRoundMaxOrder = 0;
        if (next.length > 0) {
            nextRoundState = next.map((item, index) => {
                item.order = index + 1;
                return item;
            })
            nextRoundMaxOrder = Math.max(...nextRoundState.map(creature => creature.order));
        }
        currentRoundState = current.map((item, index) => {
            item.order = nextRoundMaxOrder + index + 1;
            return item;
        });
    }
    function handleDndCurrent(e: CustomEvent) {
        calculateOrder(e.detail.items, nextRoundState);
    }
    function handleDndNext(e: CustomEvent) {
        calculateOrder(currentRoundState, e.detail.items);
    }
    function handleClickPrevious() {
        if (currentRoundState.length === 0) {
            return;
        }
        // Prevent going past round 1 if all creatures are in the currentRoundState
        if (nextRoundState.length === 0 && currentRoundState.length > 0 && currentRound === 1) {
            return;
        }

        // If the current round is full, move them to the next round
        if (nextRoundState.length === 0 && currentRoundState.length > 0) {
            nextRoundState = currentRoundState;
            currentRoundState = [];
            currentRound -= 1;
        }

        // Move creature from next round to this round start
        if (nextRoundState.length > 0) {
            let creature = nextRoundState.pop();
            if (creature) {
                currentRoundState.unshift(creature);
            }
        }
    }
    function handleClickNext() {
        if (currentRoundState.length === 0) {
            return;
        }
        let creature = currentRoundState.splice(0, 1)[0];
        nextRoundState.push(creature);

        // If currentRound is empty, move to the next round
        if (currentRoundState.length === 0 && nextRoundState.length > 0) {
            currentRoundState = nextRoundState;
            nextRoundState = [];
            currentRound += 1;
        }
    }
    function handleAddFormSubmit(data: IAddFormOnSubmitData) {
        showAddForm = false;

        if ( allCreatures.some(creature => creature.name === data.name) ) {
            alert(`Creature with name "${data.name}" already exists!`)
            return;
        }
        let nextId = 1;
        let nextOrder = 1;

        if (allCreatures.length > 0) {
            nextId = Math.max(...allCreatures.map(creature => creature.id)) + 1;
        }
        if (allCreatures.length > 0) {
            nextOrder = Math.max(...allCreatures.map(creature => creature.order)) + 1;
        }
        currentRoundState.push({
            id: nextId,
            name: data.name.trim(),
            order: nextOrder,
            isDead: false,
            team: data.team,
            conditions: []
        })
    }
    function handleClickEdit(data: ICreatureOnEditClickData) {
        editingCreature = allCreatures.find((creature) => creature.name === data.name);
        if (editingCreature) {
            showEditForm = true;
        }
    }
    function handleClearClick() {
        if (editingCreature) {
            editingCreature.conditions = [];
        }
    }
    function handleDeleteClick(id: number) {
        nextRoundState = nextRoundState
            .filter((creature) => creature.id !== id)
            .map((item, index) => {
                item.order = index + 1;
                return item;
            })
        let nextRoundMaxOrder = 0;
        if (nextRoundState.length > 0) {
            nextRoundMaxOrder = Math.max(...nextRoundState.map(creature => creature.order));
        }
        currentRoundState = currentRoundState
            .filter((creature) => creature.id !== id)
            .map((item, index) => {
                item.order = nextRoundMaxOrder + index + 1;
                return item;
            });
    }
    function handleKillClick(id: number) {
        let targetCreature = allCreatures.find((creature) => creature.id === id);
        if (targetCreature) {
            targetCreature.isDead = ! targetCreature.isDead;
        }
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
    function handleDownloadClick() {
        let exportData = {
            currentRoundState: $state.snapshot(currentRoundState),
            nextRoundState: $state.snapshot(nextRoundState),
            currentRound: $state.snapshot(currentRound)
        }
        // TODO: Better date formatting
        let date = new Date();
        let timestamp = `${date.getFullYear()}${date.getMonth()}${date.getDay()}_${date.getHours()}${date.getMinutes()}${date.getSeconds()}`

        let hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:attachment/text,' + encodeURI(JSON.stringify(exportData));
        hiddenElement.target = '_blank';
        hiddenElement.download = `combat_${timestamp}.json`;
        hiddenElement.click();
        hiddenElement.remove();
    }
    function handleUploadClick() {
        let uploadElement: HTMLInputElement | null = document.querySelector("#upload-combat");
        if (uploadElement) {
            uploadElement.click();
        }
    }
    function handleUploadChanged(e: Event & { currentTarget: EventTarget & HTMLInputElement}) {
        if (!e.currentTarget) {
            return;
        }
        const uploadElement = e.currentTarget;
        const reader = new FileReader();

        reader.onload = (e) => {
            if (e.target && e.target.result) {
                let importDataJson = e.target.result.toString();
                let importData = JSON.parse(importDataJson);

                currentRound = importData.currentRound ?? 1;
                currentRoundState = importData.currentRoundState ?? [];
                nextRoundState = importData.nextRoundState ?? [];
            }
        }

        if (uploadElement.files && uploadElement.files.length > 0) {
            for (let file of uploadElement.files) {
                reader.readAsText(file);
            }
        }
    }
</script>

<header>
    <h1>Combat Tracker</h1>
    <div class="header-right">
        <button title="Add" onclick={() => (showAddForm = true)}><PlusIcon /></button>
        <input id="upload-combat" title="Upload Combat" type="file" accept="application/json" style="display: none" onchange={handleUploadChanged}/>
        <button title="Upload Combat" onclick={handleUploadClick}><UploadIcon /></button>
        <button title="Download Combat" onclick={handleDownloadClick}><DownloadIcon /></button>
        <button title="Reset Combat" onclick={() => {currentRoundState = []; nextRoundState = []; currentRound = 1;}}><RotateCcwIcon /></button>
    </div>
</header>

<div class="toolbar">
    <button title="Previous Turn" onclick={handleClickPrevious}><ChevronsLeftIcon size="32"/></button>
    <span>Round {currentRound}</span>
    <button title="Next Turn" onclick={handleClickNext}><ChevronsRightIcon size="32"/></button>
</div>

<div
    class="initiative-list"
    use:dragHandleZone={{
        items: currentRoundState,
        dropTargetStyle: { outline: 'none'},
        type: "currentRound"
    }}
    onconsider="{handleDndCurrent}"
    onfinalize="{handleDndCurrent}"
>
    {#each currentRoundState as creature (creature.id)}
    <div
        class="creature-wrapper {creature.isDead ? 'creature-dead': ''} creature-team-{creature.team}"
        animate:flip="{{duration: 200}}"
    >
        <div class="creature-drag-handle" use:dragHandle >
            <span><MenuIcon /></span>
        </div>
        <Creature
            name={creature.name}
            order={creature.order}
            isDead={creature.isDead}
            team={creature.team}
            conditions={creature.conditions}
            onEditClick={handleClickEdit}
        />
        <button class="creature-kill" title="Toggle Dead" onclick={() => handleKillClick(creature.id)} data-id={creature.id}>
            <span><FrownIcon /></span>
        </button>
        <button class="creature-delete" title="Remove" onclick={() => handleDeleteClick(creature.id)} data-id={creature.id}>
            <span><XIcon /></span>
        </button>
    </div>
    {/each}
</div>
{#if nextRoundState.length > 0 }
<div class="new-round-divider">Round {currentRound + 1}</div>
{/if}
<div
    class="initiative-list"
    use:dragHandleZone={{
        items: nextRoundState,
        dropTargetStyle: { outline: 'none'},
        type: "nextRound"
    }}
    onconsider="{handleDndNext}"
    onfinalize="{handleDndNext}"
>
    {#each nextRoundState as creature (creature.id)}
    <div
        class="creature-wrapper {creature.isDead ? 'creature-dead': ''} creature-team-{creature.team}"
        animate:flip="{{duration: 200}}"
    >
        <div class="creature-drag-handle" use:dragHandle >
            <span><MenuIcon /></span>
        </div>
        <Creature
            name={creature.name}
            order={creature.order}
            isDead={creature.isDead}
            team={creature.team}
            conditions={creature.conditions}
            onEditClick={handleClickEdit}
        />

        <button class="creature-kill" onclick={() => handleKillClick(creature.id)} data-id={creature.id}>
            <span><FrownIcon /></span>
        </button>
        <button class="creature-delete" onclick={() => handleDeleteClick(creature.id)} data-id={creature.id}>
            <span><XIcon /></span>
        </button>
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
            padding: .8rem;
            background-color: #505050;
            width: 3rem;
            height: 3rem;
            display: flex;
            justify-content: center;
            align-items: center;

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
            min-width: 4rem;
            font-size: 2.2rem;
            background-color: #505050;
            border: none;
            border-radius: 0px;
            height: 2.5rem;
            color: #f0ede2;
            display: flex;
            justify-content: center;
            align-items: center;

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
        gap: .4rem;
        margin: 0rem .4rem;
    }
    .creature-wrapper {
        display: grid;
        grid-template-rows: auto;
        grid-template-columns: 2rem 1fr 2rem 2rem;

        & .creature-drag-handle {
            background-color: #404040;
            font-size: 2rem;
            width: 2rem;
            padding: 0rem 0rem .3rem 0.2rem;
            display: flex;
            align-items: center;
            color: #8f8f8f;
            transition: 0.2s;
        }
    }
    .creature-team-friendly .creature-drag-handle,
    .creature-team-friendly .creature-kill,
    .creature-team-friendly .creature-delete {
        background-color: #303070;
    }
    .creature-team-neutral .creature-drag-handle,
    .creature-team-neutral .creature-kill,
    .creature-team-neutral .creature-delete {
        background-color: #707030;
    }
    .creature-team-hostile .creature-drag-handle,
    .creature-team-hostile .creature-kill,
    .creature-team-hostile .creature-delete {
        background-color: #703030;
    }
    .creature-dead .creature-drag-handle,
    .creature-dead .creature-kill,
    .creature-dead .creature-delete {
        background-color: #202020;
    }
    .creature-delete,
    .creature-kill {
        background-color: #404040;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0rem 0rem 0rem 0rem;
        border: none;
        color: #f0ede2;
        transition: 0.2s;

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
        grid-column: 1 / 5;
    }
</style>
