import Button from "../components/ui/Button.jsx";

export default function ComingSoon({ title = "Coming soon" }) {
  return (
    <div className="mx-auto max-w-[1360px] px-4 py-24 sm:px-6 lg:px-8">
      <div className="max-w-lg">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-600">In progress</p>
        <h1 className="font-display text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">{title}</h1>
        <p className="mb-6 mt-3 text-neutral-500">
          This page is scheduled for an upcoming development phase and isn&apos;t built yet.
        </p>
        <Button to="/" variant="secondary">
          Back to home
        </Button>
      </div>
    </div>
  );
}

export function NotFound() {
  return (
    <div className="mx-auto max-w-[1360px] px-4 py-24 sm:px-6 lg:px-8">
      <div className="max-w-lg">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-600">404</p>
        <h1 className="font-display text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">Page not found</h1>
        <p className="mb-6 mt-3 text-neutral-500">
          The page you&apos;re looking for doesn&apos;t exist. It may have moved.
        </p>
        <Button to="/" variant="secondary">
          Back to home
        </Button>
      </div>
    </div>
  );
}
