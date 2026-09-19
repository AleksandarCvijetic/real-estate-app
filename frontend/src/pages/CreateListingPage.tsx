import { useNavigate } from "react-router-dom";
import { listingApi } from "../api/listingApi";
import { ListingForm } from "../components/listings/ListingForm";
import type { ListingCreateRequest } from "../types/listing";

export function CreateListingPage() {
  const navigate = useNavigate();

  async function handleCreate(request: ListingCreateRequest) {
    const created = await listingApi.create(request);
    navigate(`/listings/${created.id}`);
  }

  return (
    <>
      <h1 className="page-title">Novi oglas</h1>
      <ListingForm
        submitLabel="Objavi oglas"
        submittingLabel="Objavljivanje..."
        cancelTo="/my-listings"
        onSubmit={handleCreate}
      />
    </>
  );
}
