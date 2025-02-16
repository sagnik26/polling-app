import React, { useState, useEffect } from "react";
import { supabase } from "../../config/supabase";
import { Poll } from "./props.interface";

export const PollingApp = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [newPoll, setNewPoll] = useState({
    question: "",
    options: ["", "", "", ""],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPolls();
    const interval = setInterval(fetchPolls, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchPolls = async () => {
    const { data, error } = await supabase.from("polls").select("*");
    if (!error) setPolls(data || []);
  };

  const createPoll = async () => {
    setLoading(true);
    const optionsArray = newPoll.options.filter((opt) => opt.trim() !== "");
    const { error } = await supabase.from("polls").insert([
      {
        question: newPoll.question,
        options: optionsArray,
        votes: new Array(optionsArray.length).fill(0),
      },
    ]);
    if (!error) {
      fetchPolls();
      setNewPoll({ question: "", options: ["", "", "", ""] });
    }
    setLoading(false);
  };

  const votePoll = async (pollId: string, optionIndex: number) => {
    const poll = polls.find((p) => p.id === pollId);
    if (!poll) return;
    const newVotes = [...poll.votes];
    newVotes[optionIndex]++;

    await supabase.from("polls").update({ votes: newVotes }).eq("id", pollId);
    fetchPolls();
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "600px",
        margin: "auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center" }}>
        Quick Polling App
      </h1>

      <div
        style={{
          padding: "15px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          marginBottom: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Poll Question"
          value={newPoll.question}
          onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
          style={{
            width: "98%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        {newPoll.options.map((option, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Option ${index + 1}`}
            value={option}
            onChange={(e) => {
              const updatedOptions = [...newPoll.options];
              updatedOptions[index] = e.target.value;
              setNewPoll({ ...newPoll, options: updatedOptions });
            }}
            style={{
              width: "98%",
              padding: "10px",
              marginBottom: "5px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        ))}
        <button
          onClick={createPoll}
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#0073b1",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: 20,
          }}
        >
          {loading ? "Creating..." : "Create Poll"}
        </button>
      </div>

      {polls.map((poll) => (
        <div
          key={poll.id}
          style={{
            padding: "15px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            marginBottom: "15px",
          }}
        >
          <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>
            {poll.question}
          </h2>
          {poll.options.map((option, index) => (
            <button
              key={index}
              onClick={() => votePoll(poll.id, index)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{option}</span>
              <span style={{ fontWeight: "bold" }}>{poll.votes[index]}</span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PollingApp;
