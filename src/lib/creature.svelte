<script lang="ts">
	import Condition from '$lib/condition.svelte';
	import type { ICondition } from '$lib/condition.svelte';

    export interface ICreature {
        id: number,
        name: string,
        order: number,
        conditions: ICondition[],
        isDead: boolean,
        team: string
    }
    interface ICreatureProps {
        name: string,
        order: number,
        conditions: ICondition[],
        isDead?: boolean,
        team: string,
        onEditClick: CallableFunction
    }

    let { name, order, conditions, isDead = false, team, onEditClick }: ICreatureProps = $props();
    let classDead = $derived(isDead ? "creature-dead": "");
    let classTeam = $derived(`creature-team-${team}`);

    export interface ICreatureOnEditClickData {
        name: string
    }
    function handleEditClick() {
        onEditClick?.({ name });
    }
</script>

<div class="creature {classDead} {classTeam}">
    <span class="order">{order}</span>
    <span class="name">{name}</span>
    <div class="conditions" onclick={handleEditClick} onkeypress="{handleEditClick}" role="button" tabindex="0">
        {#each conditions as condition, index (index)}
        <Condition name={condition.name} value={condition.value} category={condition.category} autoGrow={false}/>
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
    .creature-team-friendly {
        background-color: #303070;
    }
    .creature-team-neutral {
        background-color: #707030;
    }
    .creature-team-hostile {
        background-color: #703030;
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