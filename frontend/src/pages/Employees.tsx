import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

type Employee = {
  id: number;
  name: string;
  position?: string;
  department?: string;
  teams?: Array<{ id: number; name: string }>;
};
type Team = { id: number; name: string };

export default function Employees() {
  const qc = useQueryClient();

  const { data: teams } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const r = await api.get("/teams");
      // backend returns teams with members; map to id/name
      return (r.data || []).map((t: any) => ({
        id: t.id,
        name: t.name,
      })) as Team[];
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await api.get("/employees");
      return res.data as Employee[];
    },
  });

  const addMutation = useMutation({
    mutationFn: (payload: any) => api.post("/employees", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["employees"] });
      qc.invalidateQueries({ queryKey: ["teams"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/employees/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["employees"] }),
  });

  const assignMutation = useMutation({
    mutationFn: (payload: any) => api.post("/assignments", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["employees"] });
      qc.invalidateQueries({ queryKey: ["teams"] });
    },
  });

  const unassignMutation = useMutation({
    mutationFn: (payload: any) => api.delete("/assignments", { data: payload }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["employees"] });
      qc.invalidateQueries({ queryKey: ["teams"] });
    },
  });

  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [selectedTeamIds, setSelectedTeamIds] = useState<number[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<number | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addMutation.mutateAsync({
      name,
      position,
      department,
      teamIds: selectedTeamIds,
    });
    setName("");
    setPosition("");
    setDepartment("");
    setSelectedTeamIds([]);
  };

  const toggleAssignPanel = (id: number) => {
    setEditingEmployee(editingEmployee === id ? null : id);
  };

  const onTeamCheckbox = async (
    employeeId: number,
    teamId: number,
    checked: boolean
  ) => {
    if (checked) {
      await assignMutation.mutateAsync({ employeeId, teamId });
    } else {
      await unassignMutation.mutateAsync({ employeeId, teamId });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Employees</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium mb-2">Add Employee</h3>
          <form onSubmit={submit} className="space-y-2">
            <input
              className="w-full border p-2 rounded"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />

            <div className="pt-2">
              <div className="text-sm font-medium mb-1">Assign to teams</div>
              <div className="flex flex-wrap gap-2">
                {teams?.map((t) => (
                  <label key={t.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedTeamIds.includes(t.id)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setSelectedTeamIds((prev) =>
                          checked
                            ? [...prev, t.id]
                            : prev.filter((x) => x !== t.id)
                        );
                      }}
                    />
                    {t.name}
                  </label>
                ))}
              </div>
            </div>

            <button className="bg-blue-600 text-white px-3 py-1 rounded">
              Add
            </button>
          </form>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium mb-2">List</h3>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <ul className="space-y-2">
              {data?.map((emp) => (
                <li key={emp.id} className="border-b py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{emp.name}</div>
                      <div className="text-sm text-gray-600">
                        {emp.position} • {emp.department}
                      </div>
                      <div className="text-sm mt-1">
                        Teams:{" "}
                        {emp.teams && emp.teams.length ? (
                          emp.teams.map((t) => t.name).join(", ")
                        ) : (
                          <span className="text-gray-400">None</span>
                        )}
                      </div>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => toggleAssignPanel(emp.id)}
                        className="text-sm text-blue-600"
                      >
                        Manage
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(emp.id)}
                        className="text-sm text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {editingEmployee === emp.id && (
                    <div className="mt-2 p-2 border rounded bg-gray-50">
                      <div className="text-sm font-medium mb-1">Teams</div>
                      <div className="flex flex-wrap gap-2">
                        {teams?.map((t) => {
                          const checked = !!(emp.teams || []).find(
                            (x: any) => x.id === t.id
                          );
                          return (
                            <label
                              key={t.id}
                              className="flex items-center gap-2 text-sm"
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) =>
                                  onTeamCheckbox(emp.id, t.id, e.target.checked)
                                }
                              />
                              {t.name}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
