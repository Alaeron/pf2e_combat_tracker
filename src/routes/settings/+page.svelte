<script lang="ts">
	import { getAllConditions } from "$lib/remote/condition.remote";
	import { getAllTeams } from "$lib/remote/team.remote";
	import { getAllConditionCategories } from "$lib/remote/condition_category.remote";

	let teams = await getAllTeams()
	let conditions = await getAllConditions();
	let conditionCategories = await getAllConditionCategories();

</script>

<header>
	<h1><a href="/">Combat Tracker</a></h1>
</header>

<form>
	<h2>Settings</h2>
	<div>
		<fieldset>
			<legend>Teams</legend>
			{#each teams as team (team.id)}
			<div class="item-wrapper">
				<label>
					<p>Name</p>
					<input value={team.name} />
				</label>
				<label>
					<p>Color</p>
					<input type="color" value={team.color} />
				</label>
				<button>Delete</button>
			</div>
			{/each}
			<div class="item-wrapper add-item">
				<label>
					<p>Name</p>
					<input value="" placeholder="New Team" />
				</label>
				<label>
					<p>Color</p>
					<input type="color" value="" />
				</label>
				<button>Add</button>
			</div>
		</fieldset>
		<fieldset>
			<legend>Condition Categories</legend>
			{#each conditionCategories as category (category.id)}
			<div class="item-wrapper">
				<label>
					<p>Name</p>
					<input value={category.name} />
				</label>
				<label>
					<p>Color</p>
					<input type="color" value={category.color} />
				</label>
				<button>Delete</button>
			</div>
			{/each}
			<div class="item-wrapper add-item">
				<label>
					<p>Name</p>
					<input value="" placeholder="New Category" />
				</label>
				<label>
					<p>Color</p>
					<input type="color" value="" />
				</label>
				<button>Add</button>
			</div>
		</fieldset>
		<fieldset>
			<legend>Conditions</legend>
			{#each conditions as condition (condition.id)}
			<div class="item-wrapper">
				<label>
					<p>Name</p>
					<input value={condition.name} />
				</label>
				<label>
					<p>Category</p>
					<select>
						{#each conditionCategories as category (category.id)}
						<option value={category.id} style:background-color={category.color}>{category.name}</option>
						{/each}
					</select>
				</label>
				<label>
					<p>Value Required</p>
					<input type="checkbox" />
				</label>
				<button>Delete</button>
			</div>
			{/each}
			<div class="item-wrapper add-item">
				<label>
					<p>Name</p>
					<input value="" placeholder="New Condition" />
				</label>
				<label>
					<p>Category</p>
					<select>
						{#each conditionCategories as category (category.id)}
						<option value={category.id} style:background-color={category.color}>{category.name}</option>
						{/each}
					</select>
				</label>
				<label>
					<p>Value Required</p>
					<input type="checkbox" />
				</label>
				<button>Add</button>
			</div>
		</fieldset>
	</div>
	<div class="form-footer">
		<button>Save</button>
	</div>
</form>

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
	h1, h2 {
		margin: 0rem;
	}
	form {
		display: flex;
		flex-flow: column;
		margin: 2rem auto;
		padding: 2rem;
		max-width: 50rem;
	}
	fieldset {
		border: 1px solid #a8a7a5;
	}
	label p {
		margin: 0rem;
	}
	label {
		margin: 0.2rem .8rem;
		display: grid;
	}
	.item-wrapper {
		display: flex;
		align-items: flex-end;
	}
	.add-item {
		margin-top: 1rem;
		border-top: 1px solid #505050;
	}
	input,
	select {
		border-radius: 0px;
		border: none;
        font-size: 1rem;
        background-color: #505050;
        color: #f0ede2;
        padding: .2rem .4rem;

	}
	input[type="color"] {
		padding: 0px;
		height: 1.6rem;
	}
	input[type="checkbox"] {
        transform: scale(1.2);

		&:hover {
			cursor: pointer;
		}
	}
	input[type="color"],
	select,
	option {
		&:hover {
			cursor: pointer;
		}
	}
	select * {
		border-radius: 0px;
	}
	button {
		height: 2rem
	}
	.form-footer {
		display: flex;
		flex-flow: row-reverse;
		padding: .8rem;
	}
</style>
