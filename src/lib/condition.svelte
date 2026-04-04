<script lang="ts">
    export interface ICondition {
        name: string,
        value: number | null
    }
    interface IConditionProps {
        name: string,
        value: number | null
        autoGrow?: boolean
    }
    let { name, value, autoGrow = true }: IConditionProps = $props();
    let elementClass = $derived(name.toLowerCase().replace(" ", "-"))
    let autoGrowClass = $derived(autoGrow ? "condition-grow": "")
</script>

<span class="condition {elementClass} {autoGrowClass}">{name} {value}</span>

<style>
    .condition {
        font-size: 1rem;
        padding: .1rem .5rem .2rem .5rem;
        flex-shrink: 1;
        max-width: 14rem;
        max-height: 1.5rem;
        white-space: nowrap;
        text-align: center;
        flex-basis: 6rem;
    }
    .condition-grow {
        flex-grow: 1;
    }

    /* degrees of detection */
    .hidden,
    .observed,
    .undetected,
    .unnoticed {
        background-color: #2b2b91;
    }

    /* death and dying */
    .doomed,
    .dying,
    .unconscious,
    .wounded {
        background-color: #000000;
    }
    /* lowered abilities */
    .clumsy,
    .drained,
    .enfeebled,
    .sickened,
    .slowed,
    .fatigued,
    .stupefied,
    .off-guard {
        background-color: #7d2b91;
    }

    /* senses */
    .blinded,
    .concealed,
    .dazzled,
    .deafened,
    .invisible {
        background-color: #918c47;
    }

    /* mental */
    .confused,
    .controlled,
    .frightened,
    .fascinated,
    .stunned,
    .taunted {
        background-color: #af5b55;
    }

    /* movement */
    .encumbered,
    .fleeing,
    .paralyzed,
    .immobilized,
    .petrified,
    .prone,
    .restrained,
    .grabbed {
        background-color: #ad7a3f;
    }

    /* damage */
    .persistent-damage {
        background-color: rgb(179, 31, 31);
    }

    /* buffed */
    .quickened {
        background-color: rgb(63, 155, 63);
    }
</style>

<!--
Full List:

Blinded
Broken
Clumsy
Concealed
Confused
Controlled
Dazzled
Deafened
Doomed
Drained
Dying
Encumbered
Enfeebled
Fascinated
Fatigued
Fleeing
Friendly
Frightened
Grabbed
Helpful
Hidden
Hostile
Immobilized
Indifferent
Invisible
Observed
Off-Guard
Paralyzed
Persistent Damage
Petrified
Prone
Quickened
Restrained
Sickened
Slowed
Stunned
Stupefied
Unconscious
Undetected
Unfriendly
Unnoticed
Wounded
-->
