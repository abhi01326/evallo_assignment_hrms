import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const [org, setOrg] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      await api.post("/auth/register", {
        organisation_name: org,
        email,
        password,
      });
      setMessage("Registered. Please login.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Create Organisation</h2>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm">Organisation Name</label>
          <input
            className="w-full border p-2 rounded"
            value={org}
            onChange={(e) => setOrg(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input
            type="password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {message && <div className="text-sm text-gray-700">{message}</div>}
        <div>
          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
