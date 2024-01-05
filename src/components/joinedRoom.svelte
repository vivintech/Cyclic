<script>
  import { onMount } from "svelte";
  //import pusher from "../lib/pusher";
  import Pusher from "pusher-js";
  export let roomId;
  let messageInput;
  let showMessage; // Store received messages

  onMount(() => {
    // You can perform any initialization here when the component mounts
    console.log("JoinedRoom component has mounted");
    const pusher = new Pusher("f449e4a0099f05988090", {
      appId: "1733202",
      secret: "aea35c0840f440790a05",
      cluster: "eu",
      useTLS: true,
    });

    pusher.subscribe(roomId);

    // Listening to the incoming-message event with pusher which gets triggered via button in MessagField.tsx and pushed in message/route.ts
    pusher.bind("incoming-message", (message) => {
      showMessage = message;
    });
  });

  // UI button send which sends message to users in room
  async function sendMessage() {
    const response = await fetch(`${window.location.href}/api/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Specify the content type as JSON
      },
      body: JSON.stringify({ messageInput, roomId })
    });

    if (!response.ok) {
      // Handle the error, if any
      console.error("Error sending message:", response.statusText);
    } else {
      // Message sent successfully
      console.log("Message sent successfully!");
    }
  }
</script>

<main>
  <!-- Your UI for the joined room goes here -->
  <p>{showMessage}</p>
  <h1>Welcome to Room {roomId}!</h1>
  <input type="text" id="messageInput" bind:value={messageInput} />
  <button on:click={sendMessage}>Send Message</button>
</main>

<style>
  /* Your component styles go here */
</style>
