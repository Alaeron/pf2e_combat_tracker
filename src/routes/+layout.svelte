<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<style>
	:global(html, body) {
		margin: 0px;
		background-color: #202020;
		color: #f0ede2;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}
	:global(a) {
		color: #6f6fe9;

		&:visited {
			color: #ae6fe9;
		}
		&:active {
			color: #f0ede2;
		}
	}
	:global(button) {
		background-color: #404040;
		border: none;
		color: #f0ede2;
		padding: .4rem .8rem;

		&:hover {
			background-color: #505050;
			cursor: pointer;
		}
	}
	:global(header) {
		& h1 {
			margin: 0px;
		}
		& a,
		& a:visited {
			text-decoration: none;
			color: unset;
		}
		& a:hover {
			text-decoration: underline;
		}
	}
</style>
