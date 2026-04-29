<script lang="ts">
    import { TrendingDownIcon } from 'svelte-feather-icons';
	import Condition, { type ICondition, type ISessionCondition } from '$lib/condition.svelte';
	import { getAllConditions } from '$lib/remote/condition.remote';
    import type { ICreature } from '$lib/creature.svelte';
	import { addSessionCreatureCondition, decrementSessionCondition, deleteAllSessionCreatureConditions, deleteSessionCreatureCondition, incrementSessionCondition, updateSessionCondition } from './remote/session.remote';

    interface IEditFormProps {
        showEditForm: boolean,
        creature: ICreature | undefined,
        sessionId: number
    }

    let {
        showEditForm = $bindable(),
        creature = $bindable(),
        sessionId
    }: IEditFormProps = $props();

    let dialog = $state<HTMLDialogElement>();
    let allConditions: ICondition[] = $derived(await getAllConditions());
    let selectedConditions: ISessionCondition[] | undefined = $derived(creature?.conditions)

    let unselectedConditions: ICondition[] = $derived.by(() => {
        if (!selectedConditions) {
            return allConditions;
        }
        return allConditions.filter((condition) => {
            return selectedConditions.find((element) => condition.id === element.id) === undefined;
        });
    });
    let filterString = $state<string>("");

    $effect(() => {
        if (showEditForm && dialog) {
            filterString = "";
            (document.querySelector("#conditions-filter") as HTMLInputElement).focus();
            dialog.showModal();
        } else {
            dialog?.close()
        }
    });
</script>

<dialog
    bind:this={dialog}
    onclose={() => (showEditForm = false)}
    onclick={(e) => { if (e.target === dialog) dialog.close(); }}
>
    <form>
        <input id="conditions-filter" placeholder="Filter conditions..." bind:value={filterString}/>
        <div class="conditions-list-wrapper">
            <div>
                <span>Conditions</span>
                <div class="all-conditions-list">
                    {#each unselectedConditions as condition (condition.id)}
                    {#if filterString === "" || condition.name.toLowerCase().includes(filterString.toLowerCase())}
                    <div class="condition-wrapper" onclick={async () => {
                        if (creature) {
                            return await addSessionCreatureCondition({
                                sessionId: sessionId,
                                creatureId: creature.id,
                                conditionId: condition.id
                            })}
                        }
                    } onkeypress={async () => {
                        if (creature) {
                            return await addSessionCreatureCondition({
                                sessionId: sessionId,
                                creatureId: creature.id,
                                conditionId: condition.id
                            })}
                        }
                    } role="button" tabindex="0">
                        <Condition condition={ {value: null, autoReduceStart: null, autoReduceEnd: null, ...condition} } />
                    </div>
                    {/if}
                    {/each}
                </div>
            </div>

            <div>
                <span class="current-conditions-header">
                    <span>Current</span>
                    <button onclick={async () => {
                        if (sessionId && creature) {
                            await deleteAllSessionCreatureConditions({
                                sessionId: sessionId,
                                creatureId: creature.id
                            })
                        }
                    }
                }>Clear</button>
                </span>
                <div class="current-conditions-list">
                    {#if creature }
                    {#each selectedConditions as condition (condition.id)}
                    {#if filterString === "" || condition.name.toLowerCase().includes(filterString.toLowerCase())}
                    <div class="condition-row">
                        <div class="condition-wrapper" onclick={async () => {
                        if (creature) {
                            return await deleteSessionCreatureCondition({
                                sessionId: sessionId,
                                creatureId: creature?.id,
                                conditionId: condition.id
                            })}
                        }
                    } onkeypress={async () => {
                        if (creature) {
                            return await deleteSessionCreatureCondition({
                                sessionId: sessionId,
                                creatureId: creature?.id,
                                conditionId: condition.id
                            })}
                        }
                    } role="button" tabindex="0">
                            <Condition condition={condition} hideValue={true} />
                        </div>
                        {#if condition.value !== null }
                        <div class="condition-level-controls">
                            {#if condition.value}
                            <button title="Decrease condition" onclick={async() => {
                                return await decrementSessionCondition({
                                    sessionId: sessionId,
                                    creatureId: creature.id,
                                    conditionId: condition.id
                                })
                            }}>-</button>
                            <input
                                type="number"
                                value={condition.value}
                                pattern="[0-9]"
                                onkeydown={(e) => {
                                    if (!/[0-9]/.test(e?.key)
                                        && ! ["Enter", "Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e?.key)
                                    ) {
                                        e.preventDefault()
                                    }
                                }}
                                onchange={(e) => {
                                    updateSessionCondition({
                                        sessionId: sessionId,
                                        creatureId: creature.id,
                                        conditionId: condition.id,
                                        autoReduceStart: condition.autoReduceStart,
                                        autoReduceEnd: condition.autoReduceEnd,
                                        value: parseInt((e.target as HTMLInputElement).value)
                                    })
                            }}/>
                            <button title="Increase condition" onclick={async() => {
                                return await incrementSessionCondition({
                                    sessionId: sessionId,
                                    creatureId: creature.id,
                                    conditionId: condition.id
                                })
                            }}>+</button>
                            <button class="auto-reduce auto-reduce-start { condition.autoReduceStart ? "" : "auto-reduce-disabled" }" title="Toggle auto reduce (start)" onclick={async () => {
                                updateSessionCondition({
                                        sessionId: sessionId,
                                        creatureId: creature.id,
                                        conditionId: condition.id,
                                        autoReduceStart: !condition.autoReduceStart,
                                        autoReduceEnd: condition.autoReduceEnd,
                                        value: condition.value ?? 1,
                                    })
                            }}>
                                <TrendingDownIcon size="16"/>
                            </button>
                            <button class="auto-reduce auto-reduce-end { condition.autoReduceEnd ? "" : "auto-reduce-disabled" }" title="Toggle auto reduce (end)" onclick={async () => {
                                updateSessionCondition({
                                        sessionId: sessionId,
                                        creatureId: creature.id,
                                        conditionId: condition.id,
                                        autoReduceStart: condition.autoReduceStart,
                                        autoReduceEnd: !condition.autoReduceEnd,
                                        value: condition.value ?? 1,
                                    })
                            }}>
                                <TrendingDownIcon size="16"/>
                            </button>
                            {/if}
                        </div>
                        {/if}
                    </div>
                    {/if}
                    {/each}
                    {/if}
                </div>
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
        max-width: 100vw;
        background-color: #303030;
    }
    form {
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
        max-width: 100%;
    }
    .all-conditions-list,
    .current-conditions-list {
        display: flex;
        flex-direction: column;
        max-height: 70vh;
        gap: .4rem;
        min-width: 10rem;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 0rem .2rem 0rem .2rem;
        margin-top: .4rem;
    }
    .current-conditions-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .condition-wrapper {
        display: flex;
        flex-grow: 1;
        max-height: 1.6rem;
        width: 100%;
    }
    .condition-row {
        display: flex;
        flex-flow: row;
        gap: .1rem;
    }
    .condition-level-controls {
        display: flex;
        align-self: flex-end;
        gap: .1rem;
    }
    .condition-row button,
    .condition-row input {
        width: 1.5rem;
        height: 1.6rem;
        text-align: center;
    }
    .condition-level-controls button.auto-reduce {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.4rem 0.2rem 0rem 0rem;
        width: 1.5rem;
        border-radius: 1.5rem;
        position: relative;

        &.auto-reduce-disabled {
            background-color: unset;
        }

        &.auto-reduce-disabled:hover {
            background-color: #505050;
        }

        &.auto-reduce-start::after {
            content: 's';
        }
        &.auto-reduce-end::after {
            content: 'e';
        }

        &::after {
            position: absolute;
            top: -0.1rem;
            right: 0.35rem;
        }
    }
    button {
        border-radius: 0;
        border: none;
        padding: 0rem .4rem;
        background-color: #606060;
        color: #f0ede2;

        &:hover {
            background-color: #707070;
            cursor: pointer;
        }
        &:active {
            background-color: #808080;
        }
    }
    input {
        background-color: #606060;
        color: #f0ede2;
        border-radius: 0;
        border: 1px solid #606060;
        font-size: 1rem;
        box-sizing: border-box;
        padding: .2rem .4rem;

        &:focus,
        &:focus-visible,
        &:active {
            border: 1px solid #f0ede2;
            outline: 0;
        }
    }
    .condition-row input {
        padding: 0rem .2rem;
        width: 2rem;
    }
    .condition-row input[type="number"],
    .condition-row input[type="number"]::-webkit-inner-spin-button,
    .condition-row input[type="number"]::-webkit-outer-spin-button {
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: textfield;
    }
    .condition-wrapper:hover {
        cursor: pointer;
    }

	@media screen and (min-width: 100px) and (max-width: 699px) {
        dialog {
            width: 100vw;
            max-width: 100vw;
            margin: 10vh 0rem;
        }
	}
</style>
