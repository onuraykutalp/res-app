import { useEffect, useState } from "react";
import { useClientStore } from "../store/useClientStore";
import { Client } from "../types/Client";
import { useAuthStore } from "../store/useAuthStore";  // auth store'u import et

const ClientList = () => {
  const clients = useClientStore((state) => state.clients);
const fetchClients = useClientStore((state) => state.fetchClients);
const deleteClient = useClientStore((state) => state.deleteClient);
const updateClient = useClientStore((state) => state.updateClient);
  const user = useAuthStore((state) => state.user);  // login olan kullanıcı

  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    company: "",
    clientType: "",
    currency: "",
    tax: "",
    limit: 0,
    whoUpdatedId: "",  // burayı boş başlatıyoruz
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const handleEdit = (client: Client) => {
    setEditingClientId(client.id);
    setEditForm({
      company: client.company,
      clientType: client.clientType,
      currency: client.currency,
      tax: client.tax || "",
      limit: client.limit,
      whoUpdatedId: user?.id || "",  // login olan kullanıcının id'si
    });
  };

  const handleSave = async (id: string) => {
    if (!user) {
      alert("Öncelikle giriş yapmalısınız!");
      return;
    }
    await updateClient(id, editForm);
    setEditingClientId(null);
  };

  // JSX kısmı aynı kalabilir

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Müşteri Listesi</h2>
      <ul className="space-y-3">
        {clients.map((client) => (
          <li
            key={client.id}
            className="bg-white p-4 rounded shadow flex flex-col md:flex-row justify-between gap-4"
          >
            {editingClientId === client.id ? (
              <div className="flex flex-col md:flex-row gap-3 w-full">
                <input
                  value={editForm.company}
                  onChange={(e) =>
                    setEditForm({ ...editForm, company: e.target.value })
                  }
                  className="border px-2 py-1 rounded w-full md:w-1/5"
                />
                <input
                  value={editForm.clientType}
                  onChange={(e) =>
                    setEditForm({ ...editForm, clientType: e.target.value })
                  }
                  className="border px-2 py-1 rounded w-full md:w-1/5"
                />
                <input
                  value={editForm.currency}
                  onChange={(e) =>
                    setEditForm({ ...editForm, currency: e.target.value })
                  }
                  className="border px-2 py-1 rounded w-full md:w-1/5"
                />
                <input
                  value={editForm.tax}
                  onChange={(e) =>
                    setEditForm({ ...editForm, tax: e.target.value })
                  }
                  className="border px-2 py-1 rounded w-full md:w-1/5"
                />
                <input
                  type="number"
                  value={editForm.limit}
                  onChange={(e) =>
                    setEditForm({ ...editForm, limit: Number(e.target.value) })
                  }
                  className="border px-2 py-1 rounded w-full md:w-1/6"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(client.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Kaydet
                  </button>
                  <button
                    onClick={() => setEditingClientId(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                  >
                    İptal
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center w-full gap-3">
                <div className="flex flex-col">
                  <span className="font-medium">{client.company}</span>
                  <span className="text-sm text-gray-600">
                    {client.clientType} | {client.currency} | Limit: {client.limit}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(client)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => deleteClient(client.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Sil
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientList;
