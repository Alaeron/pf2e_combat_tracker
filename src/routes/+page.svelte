<script lang="ts">
	import { getAllSessions, createSession, deleteSession } from "$lib/remote/session.remote";

	let sessions = $derived(await getAllSessions());
</script>

<header>
	<h1>Combat Tracker</h1>
</header>

<section>
	<div>
		<h2>Sessions</h2>
		<ul>
			{#each sessions as session (session.id)}
			<li>
				<a href="/session/{session.id}">{session.name}</a>
				<button onclick={async () => {
					if (confirm(`Deleting session: ${session.name}\nAre you sure?`)) {
						await deleteSession(session.id)
					}
				}}>Delete</button>
			</li>
			{/each}
		</ul>
		<form {...createSession}>
			<input {...createSession.fields.name.as("text")} placeholder="New Session" title="Name">
			<button>Create</button>
		</form>
	</div>
	<div>
		<h2>Admin</h2>
		<ul>
			<li><a href="/settings">Settings</a></li>
		</ul>
	</div>
</section>

<style>
	header {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0.4rem;

		& h1 {
			margin: 0px;
		}
	}
	section {
		display: flex;
		flex-flow: row wrap;
		margin: 2rem auto;
		border: 1px solid #a8a7a5;
		padding: 2rem;
		max-width: min(50rem, 100vw);
		justify-content: space-between;

		& > * {
			flex-basis: 20rem;
		}
	}
	ul {
		padding: 0rem 0.4rem;
		display: flex;
		flex-flow: column;
		gap: .4rem;
	}
	li {
		list-style: none;
		display: flex;
		justify-content: flex-start;

		& a {
			flex-grow: 1;
		}

		&::before {
			content: '❯';
			padding-right: .4rem;
		}
		& button {
			margin-right: auto;
		}
	}
	input {
		border-radius: 0px;
		border: none;
        font-size: 1rem;
        background-color: #505050;
        color: #f0ede2;
        padding: .2rem .4rem;
	}
</style>
