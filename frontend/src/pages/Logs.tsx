import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

type LogRow = {
  id: number;
  action: string;
  user_id?: number | null;
  user_email?: string | null;
  details?: string | null;
  timestamp: string;
};

export default function Logs() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["logs"],
    queryFn: async () => {
      const r = await api.get("/logs");
      return r.data as LogRow[];
    },
  });

  if (isLoading) return <div>Loading logs...</div>;
  if (error) return <div>Error loading logs</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Audit Logs</h2>
      <div className="bg-white p-4 rounded shadow overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="pb-2">Time</th>
              <th className="pb-2">Action</th>
              <th className="pb-2">User</th>
              <th className="pb-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length ? (
              data.map((row) => (
                <tr key={row.id} className="border-t">
                  <td className="py-2 align-top">
                    {new Date(row.timestamp).toLocaleString()}
                  </td>
                  <td className="py-2 align-top">{row.action}</td>
                  <td className="py-2 align-top">{row.user_email || row.user_id || "-"}</td>
                  <td className="py-2 align-top">
                    <pre className="whitespace-pre-wrap text-xs">{row.details}</pre>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-500">
                  No logs yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
