<script lang="ts">
    export interface ICondition {
        id: number,
        name: string,
        valueRequired: boolean,
        categoryId: number,
        categoryName: string,
        categoryColor: string
    }

    export interface ISessionCondition {
        id: number,
        name: string,
        value: number | null,
        categoryId: number,
        categoryName: string,
        categoryColor: string
    }
    interface IConditionProps {
        condition: ISessionCondition
        autoGrow?: boolean
    }
    let { condition, autoGrow = true }: IConditionProps = $props();
    let autoGrowClass = $derived(autoGrow ? "condition-grow": "")
</script>

<span
    class="condition {autoGrowClass}"
    style:background-color={condition.categoryColor}
>
    {condition.name} {condition.value}
</span>

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
</style>
