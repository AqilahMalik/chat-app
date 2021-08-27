const { useEffect, useState } = require("react");
const supabase = require("../utils/supabase");

function Chat() {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");

  let messagesMarkup = messages.map(function (message) {
    return (
      <div>
        <p>{message.content}</p>
        <p>Written by {message.email}</p>
      </div>
    );
  });

  function getAllMessage() {
    // Load all of the messages in the database
    supabase
      .from("messages")
      .select("*")
      .order("id", { ascending: false })
      .then(function (data) {
        setMessages(data.body);
      });
  }
  useEffect(function () {
    getAllMessage();
    setInterval(function () {
      getAllMessage();
    }, 10000);
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    // Send the message to the database
    supabase
      .from("messages")
      .insert({ content: content, email: "temporary" })
      .then(function (data) {
        console.log(data);
      });
  }

  function handleChange(event) {
    setContent(event.target.value);
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Message"
          value={content}
          onChange={handleChange}
        ></input>
        <input type="submit" value="send"></input>
      </form>
      <h3>All Massages!</h3>
      {messagesMarkup}
    </div>
  );
}

module.exports = Chat;
