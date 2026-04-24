<script lang="ts">
    import { addSessionCreature } from "$lib/remote/session.remote";
	import { getAllTeams } from "$lib/remote/team.remote";

    interface IAddFormProps {
        showAddForm: boolean
        sessionId: number
    }
    let { showAddForm = $bindable(), sessionId }: IAddFormProps = $props();
    let teams = await getAllTeams();

    let dialog = $state<HTMLDialogElement>();

    $effect(() => {
        if (showAddForm && dialog) {
            dialog.showModal();

            const nameElement: HTMLInputElement | null = document.querySelector("dialog input[type='text'][name='name']");
            nameElement?.focus();

            const firstRadioElement: HTMLInputElement | null = document.querySelector("dialog input[type='radio']");
            firstRadioElement?.click();
        } else {
            dialog?.close()
        }
    });

</script>

<dialog
    bind:this={dialog}
    onclose={() => (showAddForm = false)}
    onclick={(e) => { if (e.target === dialog) dialog.close(); }}
>
    <form {...addSessionCreature.enhance(async ({ form, submit }) => {
        if (await submit()) {
            form.reset();
        }
        dialog?.close();
    })}>
        <input {...addSessionCreature.fields.sessionId.as('hidden', `${sessionId}`)} />
        <div class="add-form-row">
            <label for="add-creature-name">Name</label>
            <input id="add-creature-name" {...addSessionCreature.fields.name.as('text')} title="Name" />
        </div>

        <div class="add-form-row">
            {#each teams as team (team.id)}
            <label>
                <span>{team.name}</span>
                <input {...addSessionCreature.fields.teamId.as("radio", `${team.id}`)} title={team.name} />
            </label>
            {/each}
        </div>
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
        flex-flow: column nowrap;
        gap: .5rem;
        justify-content: center;
        align-items: center;
        font-size: 1.2rem;
    }
    .add-form-row {
        border: none;
        display: flex;
        flex-flow: column;

        & > label {
            flex-grow: 1;
            display: flex;
            flex-flow: row;
            justify-content: space-between;
            gap: 1rem;
            cursor: pointer;
        }
    }
    input[type="submit"],
    input:not([type]) {
        border: none;
        font-size: 1rem;
        padding: .2rem .4rem;
        background-color: #606060;
        color: #f0ede2;
    }
    input[type="radio"] {
        cursor: pointer;
        transform: scale(1.2);
        background-color: black;
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