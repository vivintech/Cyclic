<script>
  import { onMount, onDestroy } from "svelte";
  import Pusher from "pusher-js";

  export let roomId;
  export let roomCreated;
  let messageInput;
  let messages = [];
  let showQuestion = [];
  let showSolution = false;
  let currentBatch;
  const pusher = new Pusher("f449e4a0099f05988090", {
    appId: "1733202",
    secret: "aea35c0840f440790a05",
    cluster: "eu",
    useTLS: true,
  });

  /*   async function fetchQuestion() {
    try {
      const response = await fetch(
        `${window.location.origin}/rooms/${roomId}/questions`,
        { method: "GET" },
      );
      questions = await response.json();
      console.log(questions[0])
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  } */

  async function fetchCurrentQuestionOfRoom() {
    try {
      const response = await fetch(
        `${window.location.origin}/rooms/${roomId}/question/current`,
        { method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ roomCreated })
        }
      );
      /* question = await response.json();
      const currentQuestion = questions[0]; // Get the latest question
      console.log(currentQuestion); */
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  }

  async function fetchNextQuestion() {
    try {
      const response = await fetch(
        `${window.location.origin}/rooms/${roomId}/question/next`,
        { method: "GET" },
      );
      /* question = await response.json();
      const currentQuestion = questions[0]; // Get the latest question
      console.log(currentQuestion); */
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  }

  onMount(async () => {
    // You can perform any initialization here when the component mounts
    console.log("JoinedRoom component has mounted");

    const channel = pusher.subscribe(roomId);
    fetchMessages();

    // Listening to the incoming-message event with pusher which gets triggered via button in MessagField.tsx and pushed in message/route.ts
    channel.bind("incoming-message", () => {
      fetchMessages();
    });

    // Listening to the incoming-message event with pusher which gets triggered via button in MessagField.tsx and pushed in message/route.ts
    channel.bind("incoming-question", ({ question, batch }) => {
      currentBatch = batch;
      showQuestion = question;
    });

    await fetchCurrentQuestionOfRoom();
  });

  function nextQuestion() {
    fetchNextQuestion();
    showSolution = false;
  }

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
          body: JSON.stringify({ messageInput, roomId })
        }
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

  function toggleSolution() {
    showSolution = !showSolution;
  }
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

  {#if showQuestion.length > 0}
    <div>
      <p>Question: {showQuestion[0].question}</p>
      {#if showSolution}
        <p>Solution: {showQuestion[0].solution}</p>
      {/if}
    </div>
    <button on:click={toggleSolution}>
      {#if showSolution}
        Hide Solution
      {:else}
        Show Solution
      {/if}
    </button>
    <button on:click={nextQuestion}>Next Question</button>
  {:else}
    <p>No questions available</p>
  {/if}
</main>

<style>
  /* Your component styles go here */
</style>
