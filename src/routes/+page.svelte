<script lang="ts">
	import { getAllSessions } from "$lib/remote/session.remote";

	let sessions = await getAllSessions();
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
				<button>Delete</button>
			</li>
			{/each}
		</ul>
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
		display: grid;
		grid-template-columns: 1fr 1fr;
		margin: 2rem auto;
		border: 1px solid #a8a7a5;
		padding: 2rem;
		max-width: 50rem;
	}
	ul {
		padding: 0rem 0.4rem;
	}
	li {
		list-style: none;

		&::before {
			content: '❯';
			padding-right: .4rem;
		}
	}
</style>
