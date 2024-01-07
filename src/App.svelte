<script>
	import { onMount } from "svelte";
	import { navigate } from "svelte-routing";
	import JoinedRoom from "./components/joinedRoom.svelte";
	let roomIdInput = ""; // Input field to get room ID from the user
	let joinedRoom = false;
	let roomId = false;
	let roomCreated = false;

	onMount(() => {
		console.log("App component has mounted");
	});

	function navigateToRoom(roomId) {
		// Use the Svelte routing to navigate to the room
		navigate(`/room/${roomId}`);
	}

	async function joinRoom() {
		try {
			const response = await fetch(
				`${window.location.href}rooms/${roomIdInput}`,
				{ method: "GET" },
			);
			const room = await response.json();
			roomCreated = false;

			if (room.id) {
				navigateToRoom(room.id);
				joinedRoom = true;
				// Set the flag to show the JoinedRoom component
				roomId = room.id;
				// Pusher subscribe, etc.
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
		const response = await fetch(`${window.location.href}api/createRoom`, {
			method: "POST",
		});
		const room = await response.json();
		// Navigate to the newly created room
		navigateToRoom(room.id);
		// Set the flag to show the JoinedRoom component
		joinedRoom = true;
		// Set the flag to show the JoinedRoom component
		roomId = room.id;
		roomCreated = true;
	}
</script>


<main>
	{#if joinedRoom}
		<JoinedRoom {roomId} {roomCreated}/>
	{:else}
		<h1>Der dümmste fliegt!</h1>
		<label for="roomIdInput">Enter Room ID:</label>
		<input type="text" id="roomIdInput" bind:value={roomIdInput} />
		<button on:click={joinRoom}>Join Room</button>
		<button on:click={createRoom}>Create Room</button>
	{/if}
</main>

<style>
	/* Your component styles go here */
</style>
