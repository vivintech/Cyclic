<script>
	import { onMount } from "svelte";
	import { navigate } from "svelte-routing";

	let roomIdInput = ""; // Input field to get room ID from the user

	onMount(() => {
		console.log("the component has mounted");
	});

	function navigateToRoom(roomId) {
		// Use the Svelte routing to navigate to the room
		navigate(`/room/${roomId}`);
	}

	async function joinRoom() {
		try {
			const response = await fetch(
				`${window.location.href}rooms/${roomIdInput}`,
			{ method: "GET" });
			const room = await response.json();

			if (room) {
				navigateToRoom(room.id);
			} else {
				console.error("Room not found");
				// Handle the case when the room with the given ID is not found
			}
		} catch (error) {
			console.error("Error joining room:", error);
			// Handle other errors here
		}
	}

	async function createRoom() {
		const roomId = await fetch(`${window.location.href}api/createRoom`, {
			method: "POST",
		});

		navigateToRoom(roomId); // Navigate to the newly created room
	}
</script>

<main>
	<h1>Der dümmste fliegt!</h1>
	<label for="roomIdInput">Enter Room ID:</label>
	<input type="text" id="roomIdInput" bind:value={roomIdInput} />
	<button on:click={joinRoom}>Join Room</button>
	<button on:click={createRoom}>Create Room</button>
</main>

<style>
	/* Your component styles go here */
</style>
