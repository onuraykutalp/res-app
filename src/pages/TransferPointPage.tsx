import React, { useEffect } from "react";
import { useTransferPointStore } from "../store/useTransferPointStore";
import { useTransferLocationStore } from "../store/useTransferLocationStore";
import TransferPointForm from "../components/TransferPointForm";
import TransferPointList from "../components/TransferPointList";

const TransferPointPage = () => {
  const fetchTransferPoints = useTransferPointStore((state) => state.fetchTransferPoints);
  const fetchTransferLocations = useTransferLocationStore((state) => state.fetchTransferLocations);

  useEffect(() => {
    fetchTransferPoints();
    fetchTransferLocations();
  }, [fetchTransferPoints, fetchTransferLocations]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Transfer Noktaları</h1>
      <TransferPointForm />
      <TransferPointList />
    </div>
  );
};

export default TransferPointPage;
