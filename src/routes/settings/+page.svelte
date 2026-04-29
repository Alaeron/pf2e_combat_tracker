<script lang="ts">
	import {
		getAllTeams,
		updateAllTeams,
		addTeam,
	} from "$lib/remote/team.remote";
	import {
		getAllConditionCategories,
		updateAllConditionCategories,
		addConditionCategory,
	} from "$lib/remote/condition_category.remote";
	import {
		getAllConditions,
		updateAllConditions,
		addCondition,
	} from "$lib/remote/condition.remote";


	let teams = $derived(await getAllTeams());
	let conditions = $derived(await getAllConditions());
	let conditionCategories = $derived(await getAllConditionCategories());
	let messageTeams = $state<string>("");
	let messageCategories = $state<string>("");
	let messageConditions = $state<string>("");
</script>

<header>
	<h1><a href="/">Combat Tracker</a></h1>
</header>

<main>
	<h2>Settings</h2>
	<div class="form-wrapper">
		<div class="form-group">
			<form {...updateAllTeams.enhance(async ({ submit }) => {
				if (await submit()) {
					messageTeams = "Saved ✅";
					setTimeout(() => { messageTeams = "" }, 1000)
				} else {
					messageTeams = "An error occurred!";
					setTimeout(() => { messageTeams = "" }, 1000)
				}
			})}>
				<fieldset>
					<legend>Teams</legend>
					{#each teams as team, idx (team.id)}
					<div class="item-wrapper">
						<input {...updateAllTeams.fields.id[idx].as("hidden", `${team.id}`)} title="ID"/>
						<input {...updateAllTeams.fields.name[idx].as("text", team.name)} title="Name"/>
						<input {...updateAllTeams.fields.color[idx].as("color", team.color)} title="Color"/>
						<button onclick={async (e) => {
							e.preventDefault();
							if (confirm(`Deleting team: ${team.name}\nAre you sure?`)) {
								teams = teams.filter((e: { id: number }) => e.id !== team.id)
							}
						}}>Delete</button>
					</div>
					{/each}
					<div class="form-footer">
						<button>Save</button>
						<span>{messageTeams}</span>
					</div>
				</fieldset>
			</form>
			<form {...addTeam}>
				<fieldset>
					<legend>Add Team</legend>
					<div class="item-wrapper add-item">
						<label>
							<p>Name</p>
							<input {...addTeam.fields.name.as("text")} placeholder="New Team" title="Name" />
						</label>
						<label>
							<p>Color</p>
							<input {...addTeam.fields.color.as("color")}  title="Color"/>
						</label>
						<button>Add</button>
					</div>
				</fieldset>
			</form>
		</div>

		<div class="form-group">
			<form {...updateAllConditionCategories.enhance(async ({ submit }) => {
				if (await submit()) {
					messageCategories = "Saved ✅";
					setTimeout(() => { messageCategories = "" }, 1000)
				} else {
					messageCategories = "An error occurred!";
					setTimeout(() => { messageCategories = "" }, 1000)
				}
			})}>
				<fieldset>
					<legend>Condition Categories</legend>
					{#each conditionCategories as category, idx (category.id)}
					<div class="item-wrapper">
						<input {...updateAllConditionCategories.fields.id[idx].as("hidden", `${category.id}`)} title="ID"/>
						<input {...updateAllConditionCategories.fields.name[idx].as("text", category.name)} title="Name"/>
						<input {...updateAllConditionCategories.fields.color[idx].as("color", category.color)} title="Color"/>
						<button onclick={async (e) => {
							e.preventDefault();
							if (confirm(`Deleting category: ${category.name}\nAre you sure?`)) {
								conditionCategories = conditionCategories.filter((e: { id: number }) => e.id !== category.id)
							}
						}}>Delete</button>
					</div>
					{/each}
					<div class="form-footer">
						<button>Save</button>
						<span>{messageCategories}</span>
					</div>
				</fieldset>
			</form>
			<form {...addConditionCategory}>
				<fieldset>
					<legend>Add Condition Category</legend>
					<div class="item-wrapper add-item">
						<label>
							<p>Name</p>
							<input {...addConditionCategory.fields.name.as("text")} placeholder="New Category" title="Name" />
						</label>
						<label>
							<p>Color</p>
							<input {...addConditionCategory.fields.color.as("color")} title="Color" />
						</label>
						<button>Add</button>
					</div>
				</fieldset>
			</form>
		</div>

		<div class="form-group">
			<form {...updateAllConditions.enhance(async ({ submit }) => {
				if (await submit()) {
					messageConditions = "Saved ✅";
					setTimeout(() => { messageConditions = "" }, 1000)
				} else {
					messageConditions = "An error occurred!";
					setTimeout(() => { messageConditions = "" }, 1000)
				}
			})}>
				<fieldset>
					<legend>Conditions</legend>
					{#each conditions as condition, idx (condition.id)}
					<div class="item-wrapper">
						<input {...updateAllConditions.fields.id[idx].as("hidden", `${condition.id}`)} title="ID"/>
						<input {...updateAllConditions.fields.name[idx].as("text", condition.name)} title="Name"/>
						<select {...updateAllConditions.fields.categoryId[idx].as("select", `${condition.categoryId}`)} value={condition.categoryId} title="Category">
							{#each conditionCategories as category (category.id)}
							<option value={category.id} style:background-color={category.color}>{category.name}</option>
							{/each}
						</select>
						<input {...updateAllConditions.fields.valueRequired[idx].as("checkbox", condition.valueRequired)} checked={condition.valueRequired} title="Requires a value?"/>
						<button onclick={async (e) => {
							e.preventDefault();
							if (confirm(`Deleting condition: ${condition.name}\nAre you sure?`)) {
								conditions = conditions.filter((e: { id: number }) => e.id !== condition.id)
							}
						}}>Delete</button>
					</div>
					{/each}
					<div class="form-footer">
						<button>Save</button>
						<span>{messageConditions}</span>
					</div>
				</fieldset>
			</form>
			<form {...addCondition}>
				<fieldset>
					<legend>Add Condition</legend>
					<div class="item-wrapper add-item">
						<label>
							<p>Name</p>
							<input {...addCondition.fields.name.as("text")} placeholder="New Condition" title="Name"/>
						</label>
						<label>
							<p>Category</p>
							<select {...addCondition.fields.categoryId.as("select", "1")} title="Category">
								{#each conditionCategories as category (category.id)}
								<option value={`${category.id}`} style:background-color={category.color}>{category.name}</option>
								{/each}
							</select>
						</label>
						<label>
							<p>Requires<br>a value?</p>
							<input {...addCondition.fields.valueRequired.as("checkbox")} title="Requires a value?"/>
						</label>
						<button>Add</button>
					</div>
				</fieldset>
			</form>
		</div>
	</div>
</main>

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
		align-self: flex-start;
	}
	main {
		flex-flow: column;
		margin: auto;
		max-width: 80rem;
		margin-bottom: 10rem;
	}
	.form-wrapper {
		display: flex;
		flex-flow: row wrap;
		gap: .4rem;
		justify-content: flex-start;
	}
	form {
		display: flex;
		flex-flow: column;
		max-width: min(30rem, calc(100vw - .8rem));
	}
	fieldset {
		border: 1px solid #a8a7a5;
	}
	label p {
		margin: 0rem;
	}
	label {
		margin: 0.2rem;
		display: flex;
		flex-flow: column;
		justify-content: center;
	}
	.item-wrapper {
		display: flex;
		flex-flow: row wrap;
		align-items: center;
		justify-content: flex-start;
		gap: .4rem;
		margin: 0rem auto .2rem auto;
		max-width: min(50rem, calc(100vw - .8rem));

		& > button {
			align-self: flex-end;
		}
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
	input:not([type]) {
		width: 10rem;
	}
	input[type="color"],
	select,
	option {
		&:hover {
			cursor: pointer;
		}
	}
	select {
		border: none;
	}
	.form-footer {
		display: flex;
		flex-flow: row-reverse;
		padding: .8rem;
		align-items: center;
  		gap: .4rem;
	}
</style>
