<script lang="ts">
	import { flip } from 'svelte/animate';
	import {
		deleteSessionCreature,
		getSessionState,
		loadSession,
		nextSessionTurn,
		previousSessionTurn,
		reorderSession,
		resetSession,
		toggleSessionCreatureDeath,
	} from '$lib/remote/session.remote';
	import { dragHandleZone, dragHandle } from 'svelte-dnd-action';
	import {
		ChevronsLeftIcon,
		ChevronsRightIcon,
		XIcon,
		FrownIcon,
		MenuIcon,
		PlusIcon,
		RotateCcwIcon,
		UploadIcon,
		DownloadIcon,
		Maximize2Icon,
		Minimize2Icon

	} from 'svelte-feather-icons';
	import Creature from '$lib/creature.svelte';
	import AddForm from '$lib/add_form.svelte';
	import EditForm from '$lib/edit_form.svelte';
	import type { ICreature } from '$lib/creature.svelte';
	import { browser } from '$app/environment';

	let { data }          = $props();
	let sessionState      = $derived(await getSessionState(data.sessionId));
	let currentRound      = $derived<number>(sessionState ? sessionState.round : 1);
	let currentRoundState = $derived.by<ICreature[]>(() => {
		if (!sessionState.creatures) {
			return []
		}
		return sessionState.creatures
			.filter((item) => item.round === currentRound)
			.sort((a, b) => a.order - b.order )
	});
	let nextRoundState    = $derived.by<ICreature[]>(() => {
		if (!sessionState.creatures) {
			return []
		}
		return sessionState.creatures
			.filter((item) => item.round === currentRound + 1)
			.sort((a, b) => a.order - b.order )
	});
	let showAddForm       = $state<boolean>(false);
	let showEditForm      = $state<boolean>(false);
	let isFullscreen      = $state<boolean>(false);
	let editingCreatureId = $state<number | undefined>(undefined);
	let editingCreature   = $derived.by(() => sessionState.creatures?.find((c) => c.id === editingCreatureId))
	let pollingTimeout: NodeJS.Timeout | null = null;

	startPolling();

	if (browser) {
		document.body.addEventListener("fullscreenchange", () => {
			isFullscreen = document.fullscreenElement !== null
		})
	}

	function startPolling() {
		if (browser) {
			pollingTimeout = setInterval(async () => getSessionState(data.sessionId).refresh(), 1000)
		}
	}
	function stopPolling() {
		if (browser && pollingTimeout) {
			clearInterval(pollingTimeout);
		}
	}
	function handleDndCurrentConsider(e: CustomEvent) {
		stopPolling();
		currentRoundState = e.detail.items;
	}
	async function handleDndCurrentFinalize(e: CustomEvent) {
		await reorderSession({sessionId: data.sessionId, creatures: e.detail.items.concat(nextRoundState)});
		startPolling();
	}
	function handleDndNextConsider(e: CustomEvent) {
		stopPolling();
		nextRoundState = e.detail.items;
	}
	async function handleDndNextFinalize(e: CustomEvent) {
		await reorderSession({sessionId: data.sessionId, creatures: e.detail.items.concat(currentRoundState)});
		startPolling();
	}
	function handleClickEdit(data: { creatureId: number }) {
		editingCreatureId = data.creatureId;
		if (editingCreature) {
			showEditForm = true;
		}
	}
	function handleKeyboardShortcuts(e: KeyboardEvent) {
		// Don't activate when editing forms are open
		if (showAddForm || showEditForm) {
			return;
		}
		switch (e.key) {
			case 'a':
				showAddForm = true;
				e.preventDefault();
				break;
			case 'n':
			case 'ArrowRight':
			case ' ':
				e.preventDefault();
				nextSessionTurn(data.sessionId);
				break;
			case 'b':
			case 'ArrowLeft':
			case 'Backspace':
				e.preventDefault();
				previousSessionTurn(data.sessionId);
				break;
			default:
				break;
		}
	}
	function handleDownloadClick() {
		const exportData = {
			sessionState: $state.snapshot(sessionState),
		};
		// TODO: Better date formatting
		const date = new Date();
		const timestamp = `${date.getFullYear()}${date.getMonth()}${date.getDay()}_${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;

		const hiddenElement = document.createElement('a');
		hiddenElement.href = 'data:attachment/text,' + encodeURIComponent(JSON.stringify(exportData));
		hiddenElement.target = '_blank';
		hiddenElement.download = `combat_${timestamp}.json`;
		hiddenElement.click();
		console.log(hiddenElement);
		hiddenElement.remove();
	}
	function handleUploadClick() {
		let uploadElement: HTMLInputElement | null = document.querySelector('#upload-combat');
		if (uploadElement) {
			uploadElement.click();
		}
	}
	function handleUploadChanged(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		if (!e.currentTarget) {
			return;
		}
		const uploadElement = e.currentTarget;
		const reader = new FileReader();

		reader.onload = async (e) => {
			if (e.target && e.target.result) {
				let importDataJson = e.target.result.toString();
				await loadSession({sessionId: data.sessionId, data: importDataJson})
			}
		};

		if (uploadElement.files && uploadElement.files.length > 0) {
			for (let file of uploadElement.files) {
				reader.readAsText(file);
			}
		}
	}
</script>

<header>
	<h1><a href="/">Combat Tracker</a></h1>
	<h2>{ sessionState.name }</h2>
	<div class="header-right">
		<button title="Add" onclick={() => (showAddForm = true)}><PlusIcon /></button>
		<input
			id="upload-combat"
			title="Upload Combat"
			type="file"
			accept="application/json"
			style="display: none"
			onchange={handleUploadChanged}
		/>
		<button title="Upload Combat" onclick={handleUploadClick}><UploadIcon /></button>
		<button title="Download Combat" onclick={handleDownloadClick}><DownloadIcon /></button>
		<button
			title="Reset Combat"
			onclick={async () => await resetSession(data.sessionId)}><RotateCcwIcon /></button
		>
		{#if isFullscreen }
		<button id="maximize-button" onclick={() => {
			document.body.style.zoom = "100%";
			document?.exitFullscreen();
		}}><Minimize2Icon/></button>
		{:else}
		<button id="minimize-button" onclick={() => {
			document.body.style.zoom = "200%";
			document?.querySelector("body")?.requestFullscreen()
		}}><Maximize2Icon/></button>
		{/if}
	</div>
</header>

<div class="toolbar">
	<button title="Previous Turn" onclick={async () => await previousSessionTurn(data.sessionId)}><ChevronsLeftIcon size="32" /></button
	>
	<span>Round {currentRound}</span>
	<button title="Next Turn" onclick={async () => await nextSessionTurn(data.sessionId)}><ChevronsRightIcon size="32" /></button>
</div>

<div
	class="initiative-list"
	use:dragHandleZone={{
		items: currentRoundState,
		dropTargetStyle: { outline: 'none' },
		type: 'currentRound'
	}}
	onconsider={handleDndCurrentConsider}
	onfinalize={handleDndCurrentFinalize}
>
	{#each currentRoundState as creature (creature.id)}
		<div
			class="creature-wrapper {creature.isDead ? 'creature-dead' : ''}"
			style:background-color={creature.team.color}
			animate:flip={{ duration: 200 }}
		>
			<div class="creature-drag-handle" use:dragHandle style:background-color={creature.team.color}>
				<span><MenuIcon /></span>
			</div>
			<Creature creature={creature} onEditClick={handleClickEdit} />
			<button
				class="creature-kill"
				style:background-color={creature.team.color}
				onclick={async () => await toggleSessionCreatureDeath({sessionId: data.sessionId, creatureId: creature.id})}
			>
				<span><FrownIcon /></span>
			</button>
			<button
				class="creature-delete"
				style:background-color={creature.team.color}
				onclick={async () => await deleteSessionCreature({sessionId: data.sessionId, creatureId: creature.id})}
			>
				<span><XIcon /></span>
			</button>
		</div>
	{/each}
</div>
{#if nextRoundState.length > 0}
	<div class="new-round-divider">Round {currentRound + 1}</div>
{/if}
<div
	class="initiative-list"
	use:dragHandleZone={{
		items: nextRoundState,
		dropTargetStyle: { outline: 'none' },
		type: 'nextRound'
	}}
	onconsider={handleDndNextConsider}
	onfinalize={handleDndNextFinalize}
>
	{#each nextRoundState as creature (creature.id)}
		<div
			class="creature-wrapper {creature.isDead ? 'creature-dead' : ''}"
			style:background-color={creature.team.color}
			animate:flip={{ duration: 200 }}
		>
			<div class="creature-drag-handle" style:background-color={creature.team.color} use:dragHandle>
				<span><MenuIcon /></span>
			</div>
			<Creature creature={creature} onEditClick={handleClickEdit} />
			<button
				class="creature-kill"
				style:background-color={creature.team.color}
				onclick={async () => await toggleSessionCreatureDeath({sessionId: data.sessionId, creatureId: creature.id})}
			>
				<span><FrownIcon /></span>
			</button>
			<button
				class="creature-delete"
				style:background-color={creature.team.color}
				onclick={async () => await deleteSessionCreature({sessionId: data.sessionId, creatureId: creature.id})}
			>
				<span><XIcon /></span>
			</button>
		</div>
	{/each}
</div>

<AddForm bind:showAddForm sessionId={data.sessionId} />
<EditForm
	bind:showEditForm
	bind:creature={editingCreature}
	sessionId={data.sessionId}
/>

<svelte:window on:keydown={handleKeyboardShortcuts} />

<style>
	header {
		display: flex;
		flex-flow: row wrap;
		align-items: center;
		padding: 0.5rem;

		& h1,
		& h2 {
			margin: 0rem;
		}

		& a,
		& a:visited {
			text-decoration: none;
			color: unset;
		}
		& a:hover {
			text-decoration: underline;
		}
		& > * {
			display: flex;
		}
	}
	@media screen and (min-width: 700px){
		header {
			justify-content: space-between;
		}
		h1 {
			width: 18rem;
		}
		.header-right {
			width: 18rem;
			justify-content: flex-end;
		}
	}
	@media screen and (min-width: 100px) and (max-width: 699px) {
		header {
			justify-content: stretch;
			& > * {
				flex-grow: 1;
				width: 100%;
				justify-content: center;
			}
		}
		header .header-right {
			justify-content: center;
		}
	}

	.header-right {
		display: flex;
		flex-flow: row nowrap;
		justify-content: flex-end;
		gap: 0.4rem;

		& button {
			border: none;
			font-size: 1rem;
			color: #f0ede2;
			padding: 0.8rem;
			background-color: #505050;
			flex-basis: 3rem;
			flex-shrink: 1;
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
		padding: 0.4rem;
		min-width: calc(360px - 0.8rem);
		max-width: min(1200px, 100vw);
		margin: auto;

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
		gap: 0.4rem;
		min-width: calc(360px - 0.8rem);
		max-width: min(1200px, 100vw);
		margin: auto;
		padding: 0.4rem;
	}
	.creature-wrapper {
		display: grid;
		grid-template-rows: auto;
		grid-template-columns: 2rem 1fr 3rem 3rem;

		& .creature-drag-handle {
			font-size: 2rem;
			width: 3rem;
			padding: 0rem 0rem 0.3rem 0.2rem;
			display: flex;
			align-items: center;
			color: #8f8f8f;
			transition: 0.2s;
		}
	}
	.creature-wrapper.creature-dead {
		filter: opacity(0.5) grayscale(0.5);
	}
	.creature-delete,
	.creature-kill {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0rem 0rem 0rem 0rem;
		border: none;
		color: #f0ede2;
		transition: 0.2s;
		width: 3rem;

		&:hover {
			background-color: #802020 !important;
			cursor: pointer;
		}

		&:active {
			background-color: #903030 !important;
			cursor: pointer;
		}
	}
	.new-round-divider {
		display: flex;
		justify-content: center;
		font-size: 1.5rem;
		padding: 0.5rem 0rem;
		grid-column: 1 / 5;
	}
</style>
