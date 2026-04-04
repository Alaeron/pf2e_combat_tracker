<script lang="ts">
	import Condition from '$lib/condition.svelte';

    let { name, order, conditions, onEditClick } = $props();

    function handleEditClick() {
        onEditClick?.({ name });
    }
</script>

<div class="creature">
    <span class="order">{order}</span>
    <span class="name">{name}</span>
    <div class="conditions">
        {#each conditions as condition, index (index)}
        <Condition name={condition.name} value={condition.value}/>
        {/each}
        <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
        <div class="edit-overlay" onclick={handleEditClick}><span>click to edit</span></div>
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
        transition: 0.3s;
    }
    .order {
        flex-basis: 1rem;
        text-align: center;
    }
    .name {
        text-wrap: nowrap;
        flex-basis: 10rem;
    }
    .conditions {
        display: flex;
        flex-flow: row wrap;
        gap: 4px;
        position: relative;
        height: 100%;
        width: 100%;
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