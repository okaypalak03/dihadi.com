import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="page-container py-8">
      <header className="mb-10">
        <h1 className="heading-1 mb-2">Admin dashboard</h1>
        <p className="text-stone-600">
          User management, worker management, and view all jobs (coming soon).
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="card p-6 border-l-4 border-orange-500">
          <h3 className="font-bold text-stone-800 mb-2">Users</h3>
          <p className="text-stone-500 text-sm">
            Manage registered users and roles.
          </p>
        </div>
        <div className="card p-6 border-l-4 border-teal-500">
          <h3 className="font-bold text-stone-800 mb-2">Workers</h3>
          <p className="text-stone-500 text-sm">
            Approve and manage worker profiles.
          </p>
        </div>
        <div className="card p-6 border-l-4 border-violet-500">
          <h3 className="font-bold text-stone-800 mb-2">Jobs</h3>
          <p className="text-stone-500 text-sm">
            View and oversee all hiring requests.
          </p>
        </div>
      </div>

      <div className="card p-8 mt-8 text-center">
        <p className="text-stone-600">
          Admin features (user management, worker management, viewing all jobs) will be implemented here.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
