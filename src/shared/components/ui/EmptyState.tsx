interface EmptyStateProps {
  readonly icon?: string;
  readonly title: string;
  readonly description?: string;
}

export default function EmptyState({ icon = '📭', title, description }: Readonly<EmptyStateProps>) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      {description && (
        <p className="text-slate-500 max-w-sm">{description}</p>
      )}
    </div>
  );
}
