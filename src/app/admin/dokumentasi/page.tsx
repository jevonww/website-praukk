import React from 'react';

export default function DocumentationPage() {
  const mermaidDiagrams = {
    erd: `
erDiagram
    User ||--o{ Order : places
    Category ||--o{ Product : contains
    Product ||--o{ OrderItem : included_in
    Order ||--o{ OrderItem : contains
    
    User {
        int id
        string name
        string email
        string role
    }
    Product {
        int id
        string name
        float price
        int stock
    }
    Order {
        int id
        string status
        float totalAmount
    }
    `,
    dfd: `
graph LR
    User((User)) -->|Checkout| System[Sistem E-Commerce]
    System -->|Verifikasi| Admin((Admin))
    Admin -->|Update Status| System
    System -->|Invoice| User
    `
  };

  return (
    <div className="p-8 bg-white dark:bg-gray-900 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Dokumentasi Sistem</h1>
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold">1. Entity Relationship Diagram (ERD)</h2>
          <pre className="bg-gray-800 text-white p-4 rounded mt-2 text-xs overflow-x-auto">
            {mermaidDiagrams.erd}
          </pre>
        </section>
        <section>
          <h2 className="text-xl font-semibold">2. Data Flow Diagram (DFD)</h2>
          <pre className="bg-gray-800 text-white p-4 rounded mt-2 text-xs overflow-x-auto">
            {mermaidDiagrams.dfd}
          </pre>
        </section>
        <section>
          <h2 className="text-xl font-semibold">3. Analisa Tipe Data</h2>
          <table className="min-w-full mt-2 border">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="border p-2">Model</th>
                <th className="border p-2">Field</th>
                <th className="border p-2">Tipe</th>
                <th className="border p-2">Analisa</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border p-2">Product</td><td className="border p-2">price</td><td className="border p-2">Float</td><td className="border p-2">Cukup untuk e-commerce sederhana</td></tr>
              <tr><td className="border p-2">User</td><td className="border p-2">role</td><td className="border p-2">String</td><td className="border p-2">Sarankan Enum untuk validasi</td></tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
