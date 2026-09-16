export default function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}
