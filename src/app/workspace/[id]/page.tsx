import WorkspaceIDE from "@/components/WorkspaceIDE";

export default async function WorkspaceRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <WorkspaceIDE roomId={id || "Beta-Omega-9"} />;
}
