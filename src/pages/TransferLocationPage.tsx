// src/pages/TransferLocationPage.tsx
import React, { useEffect } from "react";
import TransferLocationForm from "../components/TransferLocationForm";
import TransferLocationList from "../components/TransferLocationList";
import { useTransferLocationStore } from "../store/useTransferLocationStore";

const TransferLocationPage = () => {
  const fetchTransferLocations = useTransferLocationStore(
    (state) => state.fetchTransferLocations
  );

  useEffect(() => {
    fetchTransferLocations();
  }, [fetchTransferLocations]);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Transfer Lokasyonları</h1>

      <div className="bg-white rounded-xl shadow p-4">
        <TransferLocationForm />
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <TransferLocationList />
      </div>
    </div>
  );
};

export default TransferLocationPage;
