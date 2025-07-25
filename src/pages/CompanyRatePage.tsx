import CompanyRateForm from "../components/CompanyRateForm";
import CompanyRateList from "../components/CompanyRateList";

export default function CompanyRatePage() {
  return (
    <div className="p-4">
      <CompanyRateForm />
      <hr className="my-6" />
      <CompanyRateList />
    </div>
  );
}
