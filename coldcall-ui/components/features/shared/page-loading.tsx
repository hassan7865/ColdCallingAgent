import { ListLoading } from "@/components/features/shared/list-loading";

export function PageLoading({ title }: { title: string }) {
  return (
    <section className="space-y-4 p-6">
      <h2 className="text-lg font-semibold text-on-surface-variant">{title}</h2>
      <ListLoading />
    </section>
  );
}
