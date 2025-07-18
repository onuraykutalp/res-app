// pages/ResTablePage.tsx
import React from "react";
import ResTableForm from "../components/ResTableForm";
import ResTableList from "../components/ResTableList";

const ResTablePage: React.FC = () => {
  const handleSuccess = () => {
    // Örneğin form submit sonrası listeyi yeniden yüklemek için yapılabilir
    console.log("ResTable form işlemi başarılı.");
  };

  const handleCancel = () => {
    // İptal edildiğinde yapılacaklar
    console.log("ResTable form işlemi iptal edildi.");
  };

  return (
    <div className="container mx-auto p-4">
      <ResTableForm onSuccess={handleSuccess} onCancel={handleCancel} />
      <ResTableList />
    </div>
  );
};

export default ResTablePage;
