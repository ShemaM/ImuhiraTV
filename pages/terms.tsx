import Layout from '../components/layouts/Layout';

export default function Terms() {
  return (
    <Layout title="Terms of Service">
      <div className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <div className="prose prose-red max-w-none text-gray-700">
          <h3>1. Acceptance of Terms</h3>
          <p>By accessing this website, you agree to be bound by these Terms and Conditions of Use.</p>
          <h3>2. Intellectual Property</h3>
          <p>All content published on The Kivu Monitor is the property of The Kivu Monitor and protected by international copyright laws.</p>
        </div>
      </div>
    </Layout>
  );
}