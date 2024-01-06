<script>
  import { onMount, onDestroy } from "svelte";
  import Pusher from "pusher-js";

  export let roomId;
  let messageInput;
  let messages = [];
/*   let questions = [];
  let showSolution = false;
  let currentBatch = 0; */
  const pusher = new Pusher("f449e4a0099f05988090", {
    appId: "1733202",
    secret: "aea35c0840f440790a05",
    cluster: "eu",
    useTLS: true
  });

/*   async function fetchQuestions() {
    try {
      const response = await fetch(
        `${window.location.origin}/rooms/${roomId}/questions?batch=${currentBatch}`,
        { method: "GET" },
      );
      questions = await response.json();
      console.log(questions[0])
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  } */

  onMount(() => {
    // You can perform any initialization here when the component mounts
    console.log("JoinedRoom component has mounted");

    pusher.subscribe(roomId);
    fetchMessages();

    // Listening to the incoming-message event with pusher which gets triggered via button in MessagField.tsx and pushed in message/route.ts
    pusher.bind("incoming-message", (message) => {
      fetchMessages();
    });

    // fetchQuestions();
  });

/*   function nextBatch() {
    currentBatch += 1;
    fetchQuestions();
    showSolution = false;
  } */

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
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messageInput, roomId }),
        },
      );

      if (!response.ok) {
        // Handle the error, if any
        console.error("Error sending message:", response.statusText);
        return; // Exit early if there is an error
      }

      // Clear input field after sending a message
      messageInput = "";
      // Message sent successfully
      // fetchMessages();
      console.log("Message sent successfully!");
    } catch (error) {
      // Handle the error, if any
      console.error("Error sending message:", response.statusText);
    }
  }

  function leaveRoom() {
    pusher.unsubscribe(roomId);
    // After cleanup, navigate to a different route or perform any other actions
    //navigate("/");
    location.href = "/";
  }

/*   function toggleSolution() {
    showSolution = !showSolution;
  } */
</script>

<main>
  <!-- Your UI for the joined room goes here -->
  <h1>Welcome to Room {roomId}!</h1>
  <input type="text" id="messageInput" bind:value={messageInput} />
  <button on:click={sendMessage}>Send Message</button>
  <button on:click={leaveRoom}>Leave Room</button>
  {#if messages.length > 0}
    <ul>
      {#each messages as message (message.id)}
        <li>{message.text}</li>
      {/each}
    </ul>
  {:else}
    <p>No messages available</p>
  {/if}

<!--   {#if questions.length > 0}
    <div>
      <p>Question: {questions[0].question}</p>
      {#if showSolution}
      <p>Solution: {questions[0].solution}</p>
      {/if}
    </div>
    <button on:click={toggleSolution}>
      {#if showSolution}
        Hide Solution
      {:else}
        Show Solution
      {/if}
    </button>
    <button on:click={nextBatch}>Next Question</button>
  {:else}
    <p>No questions available</p>
  {/if} -->
</main>

<style>
  /* Your component styles go here */
</style>
