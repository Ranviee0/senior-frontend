export default function LandNotFound() {
  return (
    <div className="text-center py-20 space-y-4">
      <h1 className="text-4xl font-bold">Land Not Found</h1>
      <p className="text-gray-600">
        We couldn't find the land listing you're looking for. Please check the ID or return to the land list.
      </p>
      <a href="/" className="text-blue-600 underline">
        Go back to land listings
      </a>
    </div>
  );
}
