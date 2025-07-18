import React from "react";
import GeneralIncomeForm from "../components/GeneralIncomeForm";
import GeneralIncomeList from "../components/GeneralIncomeList";

const GeneralIncomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Genel Gelir Yönetimi</h1>

      <div className="bg-white p-6 rounded-xl shadow mb-10">
        <GeneralIncomeForm />
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <GeneralIncomeList />
      </div>
    </div>
  );
};

export default GeneralIncomePage;
