<script>
  import { onMount, onDestroy } from "svelte";
  //import pusher from "../lib/pusher";
  import Pusher from "pusher-js";
  export let roomId;
  let messageInput;
  let showMessage; // Store received messages
  let messages = [];
  const pusher = new Pusher("f449e4a0099f05988090", {
    appId: "1733202",
    secret: "aea35c0840f440790a05",
    cluster: "eu",
    useTLS: true,
  });

  onMount(() => {
    // You can perform any initialization here when the component mounts
    console.log("JoinedRoom component has mounted");

    pusher.subscribe(roomId);

    // Listening to the incoming-message event with pusher which gets triggered via button in MessagField.tsx and pushed in message/route.ts
    pusher.bind("incoming-message", (message) => {
      showMessage = message;
    });

    fetchMessages();
  });

  /*   onDestroy(() => {
    // Unsubscribe from the Pusher channel when the component is unmounted
    if (pusher) {
      pusher.unsubscribe(roomId);
    }
  }); */

  async function fetchMessages() {
    try {
      const response = await fetch(
        `${window.location.origin}/rooms/${roomId}/messages`, // Correct the URL path
        { method: "GET" },
      );
      messages = await response.json();

      // Handle the fetched messages (update UI, etc.)
      console.log("Fetched messages:", messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      // Handle other errors here
    }
  }

  // UI button send which sends message to users in room
  async function sendMessage() {
    try {
      const response = await fetch(
        `${window.location.origin}/rooms/${roomId}/sendMessage`,
        {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ messageInput, roomId })
        });

      if (!response.ok) {
        // Handle the error, if any
        console.error("Error sending message:", response.statusText);
        return; // Exit early if there is an error
      } 

      // Message sent successfully
      fetchMessages();
      console.log("Message sent successfully!");
    } catch (error) {
      // Handle the error, if any
      console.error("Error sending message:", response.statusText);
    }
  }
</script>

<main>
  <!-- Your UI for the joined room goes here -->
  <h1>Welcome to Room {roomId}!</h1>
  <input type="text" id="messageInput" bind:value={messageInput} />
  <button on:click={sendMessage}>Send Message</button>
  {#if messages.length > 0}
    <ul>
      {#each messages as message (message.id)}
        <li>{message.text}</li>
      {/each}
    </ul>
  {:else}
    <p>No messages available</p>
  {/if}
</main>

<style>
  /* Your component styles go here */
</style>
