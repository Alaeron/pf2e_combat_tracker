<script lang="ts">
    import { XIcon, FrownIcon, MenuIcon } from 'svelte-feather-icons';
	import { dragHandle } from 'svelte-dnd-action';
	import {
		deleteSessionCreature,
		toggleSessionCreatureDeath,
	} from '$lib/remote/session.remote';
   	import Condition from '$lib/condition.svelte';
	import type { ISessionCondition } from '$lib/condition.svelte';

    export interface ICreature {
        id: number,
        name: string,
        order: number,
        round: number,
        conditions: ISessionCondition[],
        isDead: boolean,
        team: {
            id: number,
            name: string,
            color: string
        }
    }
    interface ICreatureProps {
        creature: ICreature,
        sessionId: number,
        onEditClick: CallableFunction
    }

    let { creature, sessionId, onEditClick }: ICreatureProps = $props();
    let classDead = $derived(creature.isDead ? "creature-dead": "");

    function handleEditClick() {
        onEditClick?.({ creatureId: creature.id });
    }
</script>

<div class="creature-drag-handle" use:dragHandle style:background-color={creature.team.color}>
    <span><MenuIcon /></span>
</div>
<div class="creature {classDead}" style:background-color={creature.team.color}>
    <span class="order">{creature.order}</span>
    <span class="name">{creature.name}</span>
    <div class="conditions" onclick={handleEditClick} onkeypress="{handleEditClick}" role="button" tabindex="0">
        {#each creature.conditions as condition, index (index)}
        <Condition condition={condition} autoGrow={false} />
        {/each}
        <div class="edit-overlay"><span>click to edit</span></div>
    </div>
</div>
<button
    class="creature-kill"
    style:background-color={creature.team.color}
    onclick={async () => await toggleSessionCreatureDeath({sessionId: sessionId, creatureId: creature.id})}
>
    <span><FrownIcon /></span>
</button>
<button
    class="creature-delete"
    style:background-color={creature.team.color}
    onclick={async () => await deleteSessionCreature({sessionId: sessionId, creatureId: creature.id})}
>
    <span><XIcon /></span>
</button>

<style>
    .creature {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 1rem;
        background-color: #404040;
        font-size: 18px;
        padding: .8rem 1rem .8rem 0.1rem;
        transition: 0.2s;
    }
    .creature-dead {
        background-color: #303030;
    }
    .creature-dead .name {
        text-decoration: line-through;
    }
    .order {
        flex-basis: 1rem;
        text-align: center;
    }
    .name {
        flex-basis: 15rem;
    }
    .conditions {
        display: flex;
        flex-flow: row wrap;
        gap: 4px;
        position: relative;
        height: 100%;
        width: 100%;
        align-items: center;
    }
    .edit-overlay {
        display: none;
    }
    .conditions:hover .edit-overlay {
        background-color: rgba(139, 139, 139, 0.8);
        position: absolute;
        left: 0;
        right:0;
        top: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }
    .creature-drag-handle {
        font-size: 2rem;
        width: 3rem;
        padding: 0rem 0rem 0.3rem 0.2rem;
        display: flex;
        align-items: center;
        color: #8f8f8f;
        transition: 0.2s;
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
</style>