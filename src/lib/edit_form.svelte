<script lang="ts">
	import Condition from '$lib/condition.svelte';

    let {
        showEditForm = $bindable(),
        creature = $bindable(),
    } : {
        showEditForm: boolean,
        creature: {
            id: number,
            name: string,
            order: number,
            conditions: {
                name: string,
                value: number | null
            }[]
        }
    } = $props();

    let dialog = $state<HTMLDialogElement>();

    let allConditions: { name: string, requires_value: boolean }[] = [
        { name: "Blinded", requires_value: false },
        { name: "Clumsy", requires_value: true },
        { name: "Concealed", requires_value: false },
        { name: "Confused", requires_value: false },
        { name: "Controlled", requires_value: false },
        { name: "Dazzled", requires_value: false },
        { name: "Deafened", requires_value: false },
        { name: "Doomed", requires_value: true },
        { name: "Drained", requires_value: true },
        { name: "Dying", requires_value: true },
        { name: "Encumbered", requires_value: false },
        { name: "Enfeebled", requires_value: true },
        { name: "Fascinated", requires_value: false },
        { name: "Fatigued", requires_value: false },
        { name: "Fleeing", requires_value: false },
        { name: "Frightened", requires_value: false },
        { name: "Grabbed", requires_value: false },
        { name: "Hidden", requires_value: false },
        { name: "Immobilized", requires_value: false },
        { name: "Invisible", requires_value: false },
        { name: "Observed", requires_value: false },
        { name: "Off-Guard", requires_value: false },
        { name: "Paralyzed", requires_value: false },
        { name: "Persistent Damage", requires_value: true },
        { name: "Petrified", requires_value: false },
        { name: "Prone", requires_value: false },
        { name: "Quickened", requires_value: false },
        { name: "Restrained", requires_value: false },
        { name: "Sickened", requires_value: true },
        { name: "Slowed", requires_value: true },
        { name: "Stunned", requires_value: true },
        { name: "Stupefied", requires_value: true },
        { name: "Taunted", requires_value: true },
        { name: "Unconscious", requires_value: false },
        { name: "Undetected", requires_value: false },
        { name: "Unnoticed", requires_value: false },
        { name: "Wounded", requires_value: true }
    ]
    let unselectedConditions = $derived.by(() => {
        if (!creature?.conditions) {
            return []
        }
        return allConditions.filter((condition) => {
            return creature.conditions.find((element) => condition.name === element.name) === undefined;
        });
    });

    $effect(() => {
        if (showEditForm && dialog) {
            dialog.showModal();
        } else {
            dialog?.close()
        }
    });

    function handleUnselectedClick(e: MouseEvent & { currentTarget: EventTarget & HTMLDivElement }) {
        let newValue: number | null = null;

        if (allConditions.find((condition) => {
            return condition.name === e.currentTarget.innerText
        })?.requires_value) {
            newValue = 1;
        }
        creature.conditions.push({
            name: e.currentTarget.innerText,
            value: newValue
        });
    }
    function handleSelectedClick(e: MouseEvent & { currentTarget: EventTarget & HTMLDivElement }) {
        let targetCondition = creature.conditions.find((condition) => {
            return condition.name === e.currentTarget.innerText
        });
        if (targetCondition) {
            creature.conditions.splice(creature.conditions.indexOf(targetCondition), 1);
        }
    }
</script>

<dialog
    bind:this={dialog}
    onclose={() => (showEditForm = false)}
    onclick={(e) => { if (e.target === dialog) dialog.close(); }}
>
    <form>
        <div class="conditions-list-wrapper">
            <div class="all-conditions-list">
                <span>Conditions</span>
                {#each unselectedConditions as condition (condition.name)}
                <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
                <div class="condition-wrapper" onclick="{handleUnselectedClick}">
                    <Condition name={condition.name}  value={null} />
                </div>
                {/each}
            </div>

            <div class="current-conditions-list">
                <span>Current</span>
                {#if creature }
                {#each creature.conditions as condition (condition.name)}
                <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
                <div class="condition-wrapper" onclick="{handleSelectedClick}">
                    <Condition name={condition.name}  value={null} />
                </div>
                {/each}
                {/if}
            </div>
        </div>
    </form>
</dialog>

<style>
    dialog::backdrop {
        background-color: rgb(10 10 10 / 80%);
    }
    dialog {
        padding: 0px;
        border: none;
        color: #f0ede2;
    }
    form {
        background-color: #303030;
        padding: 1rem;
        display: flex;
        flex-flow: column;
        gap: .5rem;
        justify-content: center;
        align-items: center;
        font-size: 1.2rem;
    }
    .conditions-list-wrapper {
        display: flex;
        flex-flow: row;
        overflow-y: scroll;
        max-width: 90vw;
    }
    .all-conditions-list,
    .current-conditions-list {
        display: flex;
        flex-direction: column;
        max-height: 90vh;
        gap: .2rem;
        min-width: 10rem;
    }
    .condition-wrapper:hover {
        cursor: pointer;
    }
</style>