import CompanyRateForm from "../components/CompanyRateForm";
import CompanyRateList from "../components/CompanyRateList";

export default function CompanyRatePage() {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <CompanyRateForm />
      <hr className="my-6" />
      <CompanyRateList />
    </div>
  );
}
