<script lang="ts">
    export interface ICondition {
        name: string,
        value: number | null,
        category: string
    }
    interface IConditionProps {
        name: string,
        value: number | null,
        category: string,
        autoGrow?: boolean
    }
    let { name, value, category, autoGrow = true }: IConditionProps = $props();
    let autoGrowClass = $derived(autoGrow ? "condition-grow": "")
</script>

<span class="condition {category} {autoGrowClass}">{name} {value}</span>

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
    .detection {
        background-color: #2b2b91;
    }
    .death {
        background-color: #000000;
    }
    .lowered {
        background-color: #7d2b91;
    }
    .senses {
        background-color: #918c47;
    }
    .mental {
        background-color: #af5b55;
    }
    .movement {
        background-color: #ad7a3f;
    }
    .damage {
        background-color: #b31f1f;
    }
    .buff {
        background-color: #3f9b3f;
    }
</style>
