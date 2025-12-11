import Layout from '../components/layouts/Layout';

export default function Privacy() {
  return (
    <Layout title="Privacy Policy">
      <div className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last Updated: December 2025</p>
        
        <div className="prose prose-red max-w-none text-gray-700">
          <p>The Kivu Monitor respects your privacy. This policy describes the types of information we may collect from you.</p>
          <h3>1. Information We Collect</h3>
          <p>We collect information by which you may be personally identified, such as name and e-mail address when you subscribe to our newsletter.</p>
          <h3>2. How We Use Your Information</h3>
          <p>We use information that we collect about you to present our Website and to provide you with the news and services that you request from us.</p>
        </div>
      </div>
    </Layout>
  );
}