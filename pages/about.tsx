import Layout from '../components/layouts/Layout';

export default function About() {
  return (
    <Layout title="About Us">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-gray-900 mb-6">
            Journalism for the People.
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed font-serif">
            The Kivu Monitor is an independent newsroom dedicated to truthful reporting on the security, humanitarian, and political dynamics shaping the Great Lakes region.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center text-gray-400">
             <span className="font-bold">Newsroom Photo Placeholder</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <div className="prose text-gray-700 space-y-4">
              <p>
                Founded in 2024, we started as a simple newsletter to bridge the gap between complex regional events and the public&apos;s need for clarity.
              </p>
              <p>
                We believe that reliable information is the foundation of a just society. Our team of local journalists works around the clock to verify facts on the ground, bypassing rumors and algorithms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}