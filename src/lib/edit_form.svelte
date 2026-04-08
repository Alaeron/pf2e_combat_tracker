<script lang="ts">
	import Condition from '$lib/condition.svelte';
    import type { ICreature } from './creature.svelte';

    interface IEditFormProps {
        showEditForm: boolean,
        creature: ICreature | undefined,
        onClearClick: CallableFunction,
        onLevelIncrease: CallableFunction,
        onLevelDecrease: CallableFunction
    }

    let {
        showEditForm = $bindable(),
        creature = $bindable(),
        onClearClick,
        onLevelIncrease,
        onLevelDecrease
    }: IEditFormProps = $props();

    let dialog = $state<HTMLDialogElement>();

    let allConditions: { name: string, requires_value: boolean, category: string }[] = [
        { name: "Blinded",             requires_value: false, category: "senses"    },
        { name: "Clumsy",              requires_value: true,  category: "lowered"   },
        { name: "Concealed",           requires_value: false, category: "senses"    },
        { name: "Confused",            requires_value: false, category: "mental"    },
        { name: "Controlled",          requires_value: false, category: "mental"    },
        { name: "Dazzled",             requires_value: false, category: "senses"    },
        { name: "Deafened",            requires_value: false, category: "senses"    },
        { name: "Doomed",              requires_value: true,  category: "death"     },
        { name: "Drained",             requires_value: true,  category: "lowered"   },
        { name: "Dying",               requires_value: true,  category: "death"     },
        { name: "Encumbered",          requires_value: false, category: "movement"  },
        { name: "Enfeebled",           requires_value: true,  category: "lowered"   },
        { name: "Fascinated",          requires_value: false, category: "mental"    },
        { name: "Fatigued",            requires_value: false, category: "lowered"   },
        { name: "Fleeing",             requires_value: false, category: "movement"  },
        { name: "Frightened",          requires_value: false, category: "mental"    },
        { name: "Grabbed",             requires_value: false, category: "movement"  },
        { name: "Hidden",              requires_value: false, category: "detection" },
        { name: "Immobilized",         requires_value: false, category: "senses"    },
        { name: "Invisible",           requires_value: false, category: "movement"  },
        { name: "Observed",            requires_value: false, category: "detection" },
        { name: "Off-Guard",           requires_value: false, category: "lowered"   },
        { name: "Paralyzed",           requires_value: false, category: "movement"  },
        { name: "Persist. Damage",     requires_value: true,  category: "damage"    },
        { name: "Petrified",           requires_value: false, category: "movement"  },
        { name: "Prone",               requires_value: false, category: "movement"  },
        { name: "Quickened",           requires_value: false, category: "buff"      },
        { name: "Restrained",          requires_value: false, category: "movement"  },
        { name: "Sickened",            requires_value: true,  category: "lowered"   },
        { name: "Slowed",              requires_value: true,  category: "lowered"   },
        { name: "Stunned",             requires_value: true,  category: "mental"    },
        { name: "Stupefied",           requires_value: true,  category: "lowered"   },
        { name: "Taunted",             requires_value: false, category: "mental"    },
        { name: "Unconscious",         requires_value: false, category: "death"     },
        { name: "Undetected",          requires_value: false, category: "detection" },
        { name: "Unnoticed",           requires_value: false, category: "detection" },
        { name: "Wounded",             requires_value: true,  category: "death"     },
        { name: "Other Buff",          requires_value: true,  category: "buff"      },
        { name: "Other Debuff",        requires_value: true,  category: "mental"    },
        { name: "Duration",            requires_value: true,  category: "death"     },
        { name: "Bravos Brew",         requires_value: true,  category: "buff"      },
        { name: "Cat's Eye Elixir",    requires_value: true,  category: "buff"      },
        { name: "Juggernaut Mutagen",  requires_value: true,  category: "buff"      },
        { name: "Numbing Tonic",       requires_value: true,  category: "buff"      },
        { name: "Quicksilver Mutagen", requires_value: true,  category: "buff"      },
        { name: "Other Elixir",        requires_value: true,  category: "buff"      },
        { name: "Other Mutagen",       requires_value: true,  category: "buff"      }
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

    function handleUnselectedClick(e:
        MouseEvent & { currentTarget: EventTarget & HTMLDivElement }
        | KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement }
    ) {
        e.preventDefault();
        if (!creature) return;

        let newCondition = allConditions.find((condition) => condition.name === e.currentTarget.innerText )
        let newValue: number | null = null;
        let newCategory: string = "other";

        if (newCondition?.requires_value) {
            newValue = 1;
        }
        if (newCondition?.category) {
            newCategory = newCondition.category;
        }
        creature.conditions.push({
            name: e.currentTarget.innerText,
            value: newValue,
            category: newCategory
        });
        creature.conditions = creature.conditions.sort((a, b) => a.name.localeCompare(b.name));
    }
    function handleSelectedClick(e:
        MouseEvent & { currentTarget: EventTarget & HTMLDivElement }
        | KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement }
    ) {
        e.preventDefault();
        if (!creature) return;

        let targetCondition = creature.conditions.find((condition) => {
            return condition.name === e.currentTarget.innerText
        });
        if (targetCondition) {
            creature.conditions.splice(creature.conditions.indexOf(targetCondition), 1);
        }
        creature.conditions = creature.conditions.sort((a, b) => a.name.localeCompare(b.name));
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    export interface IEditFormOnClearClickData {}
    function handleSelectedClear() {
        onClearClick?.({});
    }

    export interface IEditFormOnLevelIncreaseData {
        name: string
    }
    function handleSelectedIncrease(e:
        MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }
        | KeyboardEvent & { currentTarget: EventTarget & HTMLButtonElement }
    ) {
        let name = e.currentTarget.closest('.condition-row')?.querySelector('.condition')?.innerHTML;
        name = name?.trim();
        onLevelIncrease?.({name});
    }

    export interface IEditFormOnLevelDecreaseData {
        name: string
    }
    function handleSelectedDecrease(e:
        MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }
        | KeyboardEvent & { currentTarget: EventTarget & HTMLButtonElement }
    ) {
        let name = e.currentTarget.closest('.condition-row')?.querySelector('.condition')?.innerHTML;
        name = name?.trim();
        onLevelDecrease?.({name});
    }
</script>

<dialog
    bind:this={dialog}
    onclose={() => (showEditForm = false)}
    onclick={(e) => { if (e.target === dialog) dialog.close(); }}
>
    <form>
        <div class="conditions-list-wrapper">
            <div>
                <span>Conditions</span>
                <div class="all-conditions-list">
                    {#each unselectedConditions as condition (condition.name)}
                    <div class="condition-wrapper" onclick="{handleUnselectedClick}" onkeypress={handleUnselectedClick} role="button" tabindex="0">
                        <Condition name={condition.name}  value={null} category={allConditions.find((c) => condition.name == c.name)?.category ?? "other"}/>
                    </div>
                    {/each}
                </div>
            </div>

            <div>
                <span class="current-conditions-header">
                    <span>Current</span>
                    <button onclick="{handleSelectedClear}">Clear</button>
                </span>
                <div class="current-conditions-list">
                    {#if creature }
                    {#each creature.conditions as condition (condition.name)}
                    <div class="condition-row">
                        <div class="condition-wrapper" onclick="{handleSelectedClick}" onkeypress={handleSelectedClick} role="button" tabindex="0">
                            <Condition name={condition.name}  value={null} category={allConditions.find((c) => condition.name == c.name)?.category ?? "other"} />
                        </div>
                        <div class="condition-level-controls">
                            {#if condition.value}
                            <button onclick={handleSelectedDecrease}>-</button>
                            <span>{condition.value}</span>
                            <button onclick={handleSelectedIncrease}>+</button>
                            {/if}
                        </div>
                    </div>
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
        max-width: 100%;
    }
    .all-conditions-list,
    .current-conditions-list {
        display: flex;
        flex-direction: column;
        max-height: 70vh;
        gap: .4rem;
        min-width: 10rem;
        overflow-y: scroll;
        padding: 0rem .4rem 0rem .2rem;
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
        justify-content: space-between;
    }
    .condition-level-controls {
        display: flex;
        align-self: flex-end;
    }
    .condition-row button,
    .condition-row span {
        width: 1.5rem;
        text-align: center;
    }
    button {
        border-radius: 0;
        border: none;
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
    .condition-wrapper:hover {
        cursor: pointer;
    }
</style>
