export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <h1 className="text-4xl font-bold text-foreground">
            Welcome to Gibbon-Writer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            A modern writing platform built with Next.js and Turborepo.
          </p>
        </div>
      </main>
    </div>
  );
}
