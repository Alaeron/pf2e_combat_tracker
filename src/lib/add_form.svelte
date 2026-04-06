<script lang="ts">
    export interface IAddFormOnSubmitData {
        name: string,
        team: string
    }
    interface IAddFormProps {
        showAddForm: boolean,
        onSubmit: CallableFunction
    }
    let {
        showAddForm = $bindable(),
        onSubmit,
    }: IAddFormProps = $props();

    let dialog = $state<HTMLDialogElement>();
    let name = $state<string>('');
    let team = $state<string>('environment');

    $effect(() => {
        if (showAddForm && dialog) {
            dialog.showModal();
            const nameElement: HTMLInputElement | null = document.querySelector("dialog input[type='text'][name='name']");
            if (nameElement) {
                nameElement.focus();
            }
            const friendlyRadioElement: HTMLInputElement | null = document.querySelector("dialog input[type='radio'][value='friendly']");
            if (friendlyRadioElement) {
                friendlyRadioElement.click();
            }
        } else {
            dialog?.close()
        }
    });

    function handleSubmit(e: SubmitEvent) {
        e.preventDefault();
        onSubmit?.({ name, team });
        name = '';
        team = '';
    }
</script>

<dialog
    bind:this={dialog}
    onclose={() => (showAddForm = false)}
    onclick={(e) => { if (e.target === dialog) dialog.close(); }}
>
    <form onsubmit={handleSubmit}>
        <div class="add-form-row">
            <label for="name">Name</label>
            <input name="name" type="text" title="Name" bind:value={name}/>
        </div>

        <div class="add-form-row">
            <div>
                <label for="environment">Environment</label>
                <input id="environment" name="team" type="radio" title="Environment" value="environment" bind:group={team}/>
            </div>
            <div>
                <label for="friendly">Friendly</label>
                <input id="friendly" name="team" type="radio" title="Friendly" value="friendly" bind:group={team} checked/>
            </div>
            <div>
                <label for="neutral">Neutral</label>
                <input id="neutral" name="team" type="radio" title="Neutral" value="neutral" bind:group={team}/>
            </div>
            <div>
                <label for="hostile">Hostile</label>
                <input id="hostile" name="team" type="radio" title="Hostile" value="hostile" bind:group={team}/>
            </div>
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

        & > div {
            flex-grow: 1;
            display: flex;
            flex-flow: row;
            justify-content: space-between;
            gap: 1rem;

            & label {
                cursor: pointer;
            }
        }
    }
    input[type="submit"],
    input[type="text"] {
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