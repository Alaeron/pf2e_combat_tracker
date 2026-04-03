<script lang="ts">
    let { showAddForm = $bindable() }: { showAddForm: boolean } = $props();

    let dialog = $state<HTMLDialogElement>();

    $effect(() => {
        if (showAddForm && dialog) {
            dialog.showModal();
        }
    });
</script>

<dialog
    bind:this={dialog}
    onclose={() => (showAddForm = false)}
    onclick={(e) => { if (e.target === dialog) dialog.close(); }}
>
    <form>
        <label for="name">Name</label>
        <input name="name" type=text/>

        <input type="submit" value="Add"/>

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
        flex-flow: row nowrap;
        gap: .5rem;
        justify-content: center;
        align-items: center;
        font-size: 1.2rem;
    }
    input[type="submit"],
    input[type="text"] {
        border: none;
        font-size: 1rem;
        padding: .2rem .4rem;
        background-color: #606060;
        color: #f0ede2;
    }
    input[type="submit"]{
        background-color: #707070;
        width: 4rem;

        &:hover {
            background-color: #808080;
            cursor: pointer;
        }
        &:active {
            background-color: #909090;
        }
    }
</style>