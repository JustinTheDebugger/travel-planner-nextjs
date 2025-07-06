import NewLocationClient from "@/components/NewLocationClient";

interface NewLocationProps {
  params: Promise<{ tripId: string }>;
}

const NewLocation = async ({ params }: NewLocationProps) => {
  const { tripId } = await params;

  return <NewLocationClient tripId={tripId} />;
};

export default NewLocation;
