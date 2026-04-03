<script lang="ts">
	import Condition from '$lib/condition.svelte';

    interface ConditionType {
        name: string,
        value: number | null
    }

    interface Props {
        name: string,
        order: number,
        conditions: ConditionType[]
    }
    let { name, order, conditions }: Props = $props();
</script>

<div class="creature">
    <span class="order">{order}</span>
    <span class="name">{name}</span>
    <div class="conditions">
        {#each conditions as condition, index (index)}
        <Condition name={condition.name} value={condition.value}/>
        {/each}
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
        padding: .8rem 1rem;
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
        transition: 0.3s;

        &:hover {
            box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
        }
    }
    .name {
        text-wrap: nowrap;
        flex-basis: 15rem;
    }
    .conditions {
        display: flex;
        flex-flow: row wrap;
        gap: 4px;
    }
</style>