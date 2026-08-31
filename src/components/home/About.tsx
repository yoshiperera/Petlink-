export function About() {
  return (
    <section className="bg-blue-brand/40 py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
        <div>
          <h2 className="text-4xl text-foreground">About Us</h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Petlink is a community-powered platform designed to help reunite lost pets with their
            families. With easy reporting tools, real-time updates, and a caring network, we make it
            simple to connect pet owners with those who've found their furry friends because every
            pawprint matters.
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=1200&q=80"
            alt="Family with their dog"
            loading="lazy"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

