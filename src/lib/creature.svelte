<script lang="ts">
	import Condition from '$lib/condition.svelte';

    let { name, order } = $props();

    let conditions = [
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
</script>

<div class="creature">
    <span class="order">{order}</span>
    <span class="name">{name}</span>
    <div class="conditions">
        {#each conditions as condition, index (index)}
        <Condition name={condition} value={1}/>
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
    }
    .conditions {
        display: flex;
        flex-flow: row wrap;
        gap: 4px;
    }
</style>