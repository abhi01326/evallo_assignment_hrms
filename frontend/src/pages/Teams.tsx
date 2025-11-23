import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

type Team = {
  id: number;
  name: string;
  lead?: string;
  members?: Array<{ id: number; name: string }>;
};

export default function Teams() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const res = await api.get("/teams");
      return res.data as Team[];
    },
  });

  const addMutation = useMutation({
    mutationFn: (payload: any) => api.post("/teams", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["teams"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/teams/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["teams"] }),
  });

  const unassignMutation = useMutation({
    mutationFn: (payload: any) => api.delete("/assignments", { data: payload }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["teams"] });
      qc.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  const [name, setName] = useState("");
  const [lead, setLead] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addMutation.mutateAsync({ name, lead });
    setName("");
    setLead("");
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Teams</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium mb-2">Create Team</h3>
          <form onSubmit={submit} className="space-y-2">
            <input
              className="w-full border p-2 rounded"
              placeholder="Team name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Team lead"
              value={lead}
              onChange={(e) => setLead(e.target.value)}
            />
            <button className="bg-green-600 text-white px-3 py-1 rounded">
              Create
            </button>
          </form>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium mb-2">List</h3>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <ul className="space-y-2">
              {data?.map((team) => (
                <li key={team.id} className="border-b py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{team.name}</div>
                      <div className="text-sm text-gray-600">
                        Lead: {team.lead}
                      </div>
                      <div className="text-sm mt-2">Members:</div>
                      <ul className="pl-4 text-sm">
                        {team.members && team.members.length ? (
                          team.members.map((m) => (
                            <li key={m.id} className="flex justify-between">
                              <span>{m.name}</span>
                              <button
                                onClick={() =>
                                  unassignMutation.mutate({
                                    employeeId: m.id,
                                    teamId: team.id,
                                  })
                                }
                                className="text-red-600 text-sm"
                              >
                                Remove
                              </button>
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-400">No members</li>
                        )}
                      </ul>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => deleteMutation.mutate(team.id)}
                        className="text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
