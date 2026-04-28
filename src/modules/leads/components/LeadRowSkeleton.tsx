import { Skeleton } from '#/components/ui/skeleton';

export function LeadRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-40" />
      </td>
      {columns >= 5 && (
        <td className="px-4 py-3">
          <Skeleton className="h-5 w-28 rounded-full" />
        </td>
      )}
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="px-4 py-3 text-right">
        <Skeleton className="ml-auto size-6 rounded" />
      </td>
    </tr>
  );
}
