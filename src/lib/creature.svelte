<script lang="ts">
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
        creature: ICreature
        onEditClick: CallableFunction
    }

    let { creature, onEditClick }: ICreatureProps = $props();
    let classDead = $derived(creature.isDead ? "creature-dead": "");

    function handleEditClick() {
        onEditClick?.({ creatureId: creature.id });
    }
</script>

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
</style>