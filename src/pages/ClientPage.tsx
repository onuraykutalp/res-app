// src/pages/ClientPage.tsx

import React from "react";
import ClientForm from "../components/ClientForm";
import ClientList from "../components/ClientList";
import { useAuthStore } from "../store/useAuthStore";

const ClientPage = () => {

    const user = useAuthStore((state) => state.user);
    const userId = user?.id;
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Müşteri Yönetimi</h1>
      <ClientForm whoCreatedId={userId || "test-user-id"} />
      <hr className="my-6" />
      <ClientList />
    </div>
  );
};

export default ClientPage;
