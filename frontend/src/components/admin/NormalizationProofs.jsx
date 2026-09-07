import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Layers,
  ArrowRight,
  Database,
  Search,
  ShieldCheck,
  Code,
  FileSpreadsheet,
  Cpu,
  Key,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export default function NormalizationProofs() {
  const [activeTab, setActiveTab] = useState('proofs'); // 'proofs' | 'fds' | 'dictionary'
  const [selectedProof, setSelectedProof] = useState('3nf'); // '1nf' | '2nf' | '3nf' | 'bcnf'
  const [dictSearch, setDictSearch] = useState('');
  const [dictCategory, setDictCategory] = useState('ALL');

  const proofs = {
    '1nf': {
      title: 'First Normal Form (1NF): Atomicity & No Repeating Groups',
      axiom: 'A relation R is in 1NF if and only if every attribute domain contains only atomic (indivisible) values, and there are no repeating groups or arrays.',
      violation: {
        table: 'unnormalized_bookings_bad',
        description: 'Multi-valued passenger names and phone numbers stored as comma-separated strings within a single cell.',
        columns: ['booking_id', 'user_id', 'passengers', 'contact_numbers', 'total_amount'],
        rows: [
          { booking_id: 'B-101', user_id: 'U-01', passengers: 'Alice, Bob, Charlie', contact_numbers: '+91-987..., +91-988...', total_amount: '₹3,600' },
          { booking_id: 'B-102', user_id: 'U-02', passengers: 'David, Emma', contact_numbers: '+91-912...', total_amount: '₹2,400' }
        ],
        problem: 'Requires regex parsing to query individual passengers. Cannot enforce foreign key integrity or index individual passenger records.'
      },
      solution: {
        table: 'bookings + booking_passengers (BookSphere 1NF Design)',
        description: 'Decomposed into master booking record and 1:N normalized atomic passenger rows.',
        tables: [
          {
            name: 'bookings (Master Entity)',
            columns: ['id (PK)', 'booking_reference', 'user_id (FK)', 'total_amount'],
            rows: [
              { 'id (PK)': '1', booking_reference: 'BK-2026-AI804', 'user_id (FK)': '2', total_amount: '3600.00' }
            ]
          },
          {
            name: 'booking_passengers (Atomic Discrete Rows)',
            columns: ['id (PK)', 'booking_id (FK)', 'full_name', 'phone_number', 'seat_number'],
            rows: [
              { 'id (PK)': '1', 'booking_id (FK)': '1', full_name: 'Alice Sharma', phone_number: '+91-9876543210', seat_number: '1A' },
              { 'id (PK)': '2', 'booking_id (FK)': '1', full_name: 'Bob Sharma', phone_number: '+91-9876543211', seat_number: '1B' },
              { 'id (PK)': '3', 'booking_id (FK)': '1', full_name: 'Charlie Verma', phone_number: '+91-9876543212', seat_number: '1C' }
            ]
          }
        ],
        verdict: 'Satisfies 1NF: All column values are strictly atomic scalars. Direct SQL queries like WHERE full_name = "Alice Sharma" operate in O(1) with B-Tree indexes.'
      }
    },
    '2nf': {
      title: 'Second Normal Form (2NF): Elimination of Partial Dependencies',
      axiom: 'A relation R is in 2NF if it is in 1NF and no non-prime attribute is partially dependent on any candidate key. Formally: If composite PK is (A, B), no non-key attribute Y can depend solely on A or solely on B (i.e. A -> Y is prohibited).',
      violation: {
        table: 'booking_line_items_bad (Composite Key: booking_id, service_id)',
        description: 'Table has composite primary key (booking_id, service_id), but service title, city, and base price depend ONLY on service_id, not on booking_id.',
        columns: ['booking_id (PK1)', 'service_id (PK2)', 'quantity', 'service_title (Partial)', 'service_city (Partial)', 'unit_price'],
        rows: [
          { 'booking_id (PK1)': '101', 'service_id (PK2)': 'S-5', quantity: '2', 'service_title (Partial)': 'Intercity Express AC', 'service_city (Partial)': 'Mumbai', unit_price: '₹1,200' },
          { 'booking_id (PK1)': '102', 'service_id (PK2)': 'S-5', quantity: '1', 'service_title (Partial)': 'Intercity Express AC', 'service_city (Partial)': 'Mumbai', unit_price: '₹1,200' }
        ],
        problem: 'Update Anomaly: Updating the title of Service S-5 requires mutating thousands of historical booking rows. Insertion Anomaly: Cannot register a new service until someone books it!'
      },
      solution: {
        table: 'services + booking_items (BookSphere 2NF Design)',
        description: 'Split into services entity table (PK: service_id) and association junction table (booking_id, service_id).',
        tables: [
          {
            name: 'services (Independent Entity)',
            columns: ['id (PK)', 'title', 'parent_type', 'city', 'base_price'],
            rows: [
              { 'id (PK)': '5', title: 'Intercity Express AC', parent_type: 'TRANSPORT', city: 'Mumbai', base_price: '1200.00' }
            ]
          },
          {
            name: 'booking_items (Pure Relation with zero partial dependencies)',
            columns: ['id (PK)', 'booking_id (FK)', 'service_id (FK)', 'unit_price', 'quantity'],
            rows: [
              { 'id (PK)': '1', 'booking_id (FK)': '101', 'service_id (FK)': '5', unit_price: '1200.00', quantity: '2' },
              { 'id (PK)': '2', 'booking_id (FK)': '102', 'service_id (FK)': '5', unit_price: '1200.00', quantity: '1' }
            ]
          }
        ],
        verdict: 'Satisfies 2NF: Non-key attributes (quantity, unit_price) depend strictly on the complete identity of the line item record. No partial dependencies exist.'
      }
    },
    '3nf': {
      title: 'Third Normal Form (3NF): Elimination of Transitive Dependencies',
      axiom: 'A relation R is in 3NF if it is in 2NF and for every non-trivial functional dependency X -> Y, either X is a superkey, or Y is a prime attribute (member of a candidate key). Non-prime attributes must NOT determine other non-prime attributes (i.e. A -> B -> C is decomposed).',
      violation: {
        table: 'services_unnormalized_3nf_bad',
        description: 'service_id determines category_id, which in turn determines category_name, category_description, and vertical_tax_rate.',
        columns: ['service_id (PK)', 'title', 'base_price', 'category_id (Non-Prime)', 'category_name (Transitive)', 'tax_rate (Transitive)'],
        rows: [
          { 'service_id (PK)': '1', title: 'Grand Royal Suite', base_price: '₹8,500', 'category_id (Non-Prime)': 'CAT-HOTEL', 'category_name (Transitive)': 'Luxury Hotels', 'tax_rate (Transitive)': '18%' },
          { 'service_id (PK)': '2', title: 'Azure Bay Villa', base_price: '₹14,000', 'category_id (Non-Prime)': 'CAT-HOTEL', 'category_name (Transitive)': 'Luxury Hotels', 'tax_rate (Transitive)': '18%' }
        ],
        problem: 'Transitive Dependency: service_id -> category_id -> tax_rate. If GST rate changes from 18% to 12%, modifying every hotel service leads to data inconsistency risk.'
      },
      solution: {
        table: 'categories + services (BookSphere 3NF Design)',
        description: 'Transitive dependency isolated into a dedicated categories relation with its own primary key.',
        tables: [
          {
            name: 'categories (Normalized Relation)',
            columns: ['id (PK)', 'slug', 'name', 'parent_vertical', 'tax_rate_percent'],
            rows: [
              { 'id (PK)': '1', slug: 'luxury-hotels', name: 'Luxury Hotels', parent_vertical: 'HOTEL', tax_rate_percent: '18.00' }
            ]
          },
          {
            name: 'services (Direct Foreign Key Reference)',
            columns: ['id (PK)', 'category_id (FK)', 'title', 'base_price'],
            rows: [
              { 'id (PK)': '1', 'category_id (FK)': '1', title: 'Grand Royal Suite', base_price: '8500.00' },
              { 'id (PK)': '2', 'category_id (FK)': '1', title: 'Azure Bay Villa', base_price: '14000.00' }
            ]
          }
        ],
        verdict: 'Satisfies 3NF: In both relations, every determinant is a superkey (categories.id is PK, services.id is PK). Zero transitive dependencies remain.'
      }
    },
    'bcnf': {
      title: 'Boyce-Codd Normal Form (BCNF): Determinant is Candidate Key',
      axiom: 'A relation R is in BCNF (Strict 3.5NF) if for EVERY functional dependency X -> Y, X is a superkey of R. There can be no functional dependency where a non-trivial attribute is determined by a non-superkey.',
      violation: {
        table: 'doctor_schedule_bad (Doctor, Patient, ClinicRoom)',
        description: 'Composite key (Doctor, Patient), but ClinicRoom -> Doctor (each room is reserved by one doctor per slot).',
        columns: ['Doctor', 'Patient', 'ClinicRoom'],
        rows: [
          { Doctor: 'Dr. Rao', Patient: 'Alice', ClinicRoom: 'Room-101' },
          { Doctor: 'Dr. Rao', Patient: 'Bob', ClinicRoom: 'Room-101' },
          { Doctor: 'Dr. Patel', Patient: 'Charlie', ClinicRoom: 'Room-102' }
        ],
        problem: 'ClinicRoom -> Doctor violates BCNF because ClinicRoom alone is not a candidate key for the relation.'
      },
      solution: {
        table: 'BookSphere Resource Slot Scheduling (BCNF Compliant)',
        description: 'In BookSphere, time slot reservations use discrete atomic keys (resource_id, start_time) with UNIQUE constraint.',
        tables: [
          {
            name: 'resource_schedules (BCNF Guaranteed)',
            columns: ['id (PK)', 'service_id (FK)', 'slot_start', 'slot_end', 'is_booked'],
            rows: [
              { 'id (PK)': '1', 'service_id (FK)': '6', slot_start: '2026-09-10 18:00:00', slot_end: '2026-09-10 19:00:00', is_booked: '1' }
            ]
          }
        ],
        verdict: 'Satisfies BCNF: Determinant (service_id, slot_start) is the exact unique candidate key. Guarantees zero schedule conflicts at database engine level.'
      }
    }
  };

  const functionalDependencies = [
    {
      source: 'users',
      determinant: 'id',
      dependents: ['email', 'password_hash', 'full_name', 'phone', 'role', 'status', 'created_at'],
      type: 'Primary Key FD (Full Superkey)',
      status: '3NF Verified'
    },
    {
      source: 'services',
      determinant: 'id',
      dependents: ['title', 'slug', 'parent_type', 'category_id', 'city', 'base_price', 'rating', 'status'],
      type: 'Primary Key FD (Full Superkey)',
      status: '3NF Verified'
    },
    {
      source: 'categories',
      determinant: 'slug',
      dependents: ['id', 'name', 'parent_type', 'description'],
      type: 'Alternate Candidate Key FD',
      status: 'BCNF Verified'
    },
    {
      source: 'bookings',
      determinant: 'booking_reference',
      dependents: ['id', 'user_id', 'parent_type', 'total_amount', 'discount_amount', 'final_amount', 'status'],
      type: 'Unique Candidate Key FD',
      status: '3NF Verified'
    },
    {
      source: 'coupons',
      determinant: 'code',
      dependents: ['id', 'discount_type', 'discount_value', 'min_order_amount', 'valid_until', 'is_active'],
      type: 'Candidate Key FD',
      status: '3NF Verified'
    },
    {
      source: 'reviews',
      determinant: 'id',
      dependents: ['booking_id', 'user_id', 'service_id', 'rating', 'comment', 'created_at'],
      type: 'Primary Key FD',
      status: '3NF Verified'
    },
    {
      source: 'payments',
      determinant: 'transaction_reference',
      dependents: ['id', 'booking_id', 'amount', 'payment_method', 'payment_status', 'created_at'],
      type: 'Unique Determinant FD',
      status: '3NF Verified'
    },
    {
      source: 'audit_logs',
      determinant: 'id',
      dependents: ['action_type', 'table_name', 'record_id', 'old_data', 'new_data', 'performed_by', 'timestamp'],
      type: 'Immutable Ledger FD',
      status: '3NF Verified'
    }
  ];

  const dataDictionary = [
    { name: 'users', category: 'Core', pk: 'id (INT AUTO_INCREMENT)', fk: 'None', nf: '3NF', desc: 'Central user authentication and identity directory with role-based access' },
    { name: 'services', category: 'Core', pk: 'id (INT AUTO_INCREMENT)', fk: 'category_id -> categories.id', nf: '3NF', desc: 'Universal service registry across transport, sports, entertainment, hospitality' },
    { name: 'categories', category: 'Core', pk: 'id (INT AUTO_INCREMENT)', fk: 'None', nf: '3NF', desc: 'Normalized service classification hierarchies to eliminate transitive dependencies' },
    { name: 'bookings', category: 'Core', pk: 'id (INT AUTO_INCREMENT)', fk: 'user_id -> users.id, coupon_id -> coupons.id', nf: '3NF', desc: 'Global transactional master booking ledger with composite status transitions' },
    { name: 'booking_items', category: 'Core', pk: 'id (INT AUTO_INCREMENT)', fk: 'booking_id -> bookings.id, service_id -> services.id', nf: '3NF', desc: 'Normalized line items resolving M:N relationship between bookings and services' },
    { name: 'booking_passengers', category: 'Transport', pk: 'id (INT AUTO_INCREMENT)', fk: 'booking_id -> bookings.id', nf: '1NF/3NF', desc: 'Atomic passenger records eliminating repeating groups from master booking' },
    { name: 'transport_routes', category: 'Transport', pk: 'id (INT AUTO_INCREMENT)', fk: 'service_id -> services.id', nf: '3NF', desc: 'Origin-destination pairs, departure schedules, and transit durations' },
    { name: 'transport_seats', category: 'Transport', pk: 'id (INT AUTO_INCREMENT)', fk: 'service_id -> services.id', nf: 'BCNF', desc: 'Individual aircraft/train/bus seat inventory and real-time locking state' },
    { name: 'entertainment_shows', category: 'Entertainment', pk: 'id (INT AUTO_INCREMENT)', fk: 'service_id -> services.id', nf: '3NF', desc: 'Movie and event screening showtimes with audio format and sensor specs' },
    { name: 'entertainment_seats', category: 'Entertainment', pk: 'id (INT AUTO_INCREMENT)', fk: 'show_id -> entertainment_shows.id', nf: 'BCNF', desc: 'Cinema hall layout grid with row numbers and seat tier pricing' },
    { name: 'sports_slots', category: 'Sports', pk: 'id (INT AUTO_INCREMENT)', fk: 'service_id -> services.id', nf: 'BCNF', desc: 'Hourly court/turf slot allocations preventing double-booking' },
    { name: 'sports_equipment', category: 'Sports', pk: 'id (INT AUTO_INCREMENT)', fk: 'service_id -> services.id', nf: '3NF', desc: 'Rental gear catalog available for sports arenas' },
    { name: 'hotel_rooms', category: 'Hospitality', pk: 'id (INT AUTO_INCREMENT)', fk: 'service_id -> services.id', nf: '3NF', desc: 'Room types, bed configurations, maximum occupancy, and base tariffs' },
    { name: 'hotel_amenities', category: 'Hospitality', pk: 'id (INT AUTO_INCREMENT)', fk: 'service_id -> services.id', nf: '3NF', desc: 'Normalized property amenities (WiFi, Pool, Breakfast, Parking)' },
    { name: 'restaurant_tables', category: 'Hospitality', pk: 'id (INT AUTO_INCREMENT)', fk: 'service_id -> services.id', nf: '3NF', desc: 'Dining table capacities, indoor/outdoor zones, and reservations' },
    { name: 'coupons', category: 'Finance', pk: 'id (INT AUTO_INCREMENT)', fk: 'None', nf: '3NF', desc: 'Promotional discount codes with percentage/flat reductions and validity limits' },
    { name: 'payments', category: 'Finance', pk: 'id (INT AUTO_INCREMENT)', fk: 'booking_id -> bookings.id', nf: '3NF', desc: 'ACID payment logs with unique gateway transaction references' },
    { name: 'reviews', category: 'Social', pk: 'id (INT AUTO_INCREMENT)', fk: 'user_id -> users.id, service_id -> services.id', nf: '3NF', desc: 'Verified customer feedback, ratings (1-5), and written reviews' },
    { name: 'audit_logs', category: 'System', pk: 'id (INT AUTO_INCREMENT)', fk: 'performed_by -> users.id', nf: '3NF', desc: 'Trigger-based forensic database mutation log capturing pre/post states' },
    { name: 'user_notifications', category: 'System', pk: 'id (INT AUTO_INCREMENT)', fk: 'user_id -> users.id', nf: '3NF', desc: 'Real-time alert messages for bookings, refunds, and security events' }
  ];

  const filteredDict = dataDictionary.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(dictSearch.toLowerCase()) ||
                          t.desc.toLowerCase().includes(dictSearch.toLowerCase()) ||
                          t.fk.toLowerCase().includes(dictSearch.toLowerCase());
    const matchesCat = dictCategory === 'ALL' || t.category === dictCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-[#E5E0D6] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#243B35]" />
            <h3 className="text-lg font-black text-[#1E1E1E] font-serif">Relational Normalization Proofs & Data Dictionary</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-[#243B35]/10 text-[#243B35] font-mono text-xs font-bold border border-[#243B35]/20">
              DBMS Theory & Formal Proofs
            </span>
          </div>
          <p className="text-xs text-[#5E5A54] mt-1 max-w-2xl leading-relaxed">
            Mathematical demonstrations of 1NF, 2NF, 3NF, and BCNF normalization applied to the BookSphere relational engine, complete with functional dependency analysis and a comprehensive schema data dictionary.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-[#2E7D32]/15 text-[#2E7D32] font-mono text-xs font-bold border border-[#2E7D32]/30 flex items-center gap-1.5 shadow-sm">
            <ShieldCheck className="w-4 h-4" />
            100% 3NF Verified
          </span>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex gap-2 border-b border-[#E5E0D6] pb-2">
        <button
          onClick={() => setActiveTab('proofs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'proofs'
              ? 'bg-[#243B35] text-white shadow-sm border border-[#243B35]'
              : 'bg-white text-[#5E5A54] hover:text-[#1E1E1E] hover:bg-[#F8F6F1] border border-[#E5E0D6]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" />
          <span>Normal Form Mathematical Proofs</span>
        </button>

        <button
          onClick={() => setActiveTab('fds')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'fds'
              ? 'bg-[#243B35] text-white shadow-sm border border-[#243B35]'
              : 'bg-white text-[#5E5A54] hover:text-[#1E1E1E] hover:bg-[#F8F6F1] border border-[#E5E0D6]'
          }`}
        >
          <Key className="w-3.5 h-3.5 text-[#C9A96E]" />
          <span>Functional Dependencies & Keys</span>
        </button>

        <button
          onClick={() => setActiveTab('dictionary')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'dictionary'
              ? 'bg-[#243B35] text-white shadow-sm border border-[#243B35]'
              : 'bg-white text-[#5E5A54] hover:text-[#1E1E1E] hover:bg-[#F8F6F1] border border-[#E5E0D6]'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-[#C9A96E]" />
          <span>Schema Data Dictionary (20+ Tables)</span>
        </button>
      </div>

      {/* 1. MATHEMATICAL PROOFS VIEW */}
      {activeTab === 'proofs' && (
        <div className="space-y-6">
          {/* Normal Form Selectors */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: '1nf', label: '1NF: Atomicity & Repeating Groups' },
              { id: '2nf', label: '2NF: Partial Functional Dependencies' },
              { id: '3nf', label: '3NF: Transitive Dependencies' },
              { id: 'bcnf', label: 'BCNF: Boyce-Codd Superkey Axiom' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProof(p.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedProof === p.id
                    ? 'bg-[#243B35] text-white border border-[#243B35] shadow-sm'
                    : 'bg-white hover:bg-[#F8F6F1] border border-[#E5E0D6] text-[#5E5A54] hover:text-[#1E1E1E]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Proof Body */}
          <div className="bg-white rounded-3xl border border-[#E5E0D6] shadow-sm p-6 space-y-6 animate-in fade-in">
            <div>
              <h3 className="text-base font-extrabold text-[#1E1E1E] font-serif">{proofs[selectedProof].title}</h3>
              <div className="mt-2 p-4 rounded-2xl bg-[#F8F6F1] border border-[#E5E0D6] text-xs leading-relaxed text-[#1E1E1E]">
                <strong className="text-[#243B35] uppercase tracking-wider block mb-1 font-mono text-[11px]">Formal Relational Calculus Axiom:</strong>
                {proofs[selectedProof].axiom}
              </div>
            </div>

            {/* Violation Demonstration */}
            <div className="p-5 rounded-2xl bg-[#B86B4B]/5 border border-[#B86B4B]/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#B86B4B] uppercase tracking-wider">
                  ⚠️ Violation Demonstration: {proofs[selectedProof].violation.table}
                </span>
                <span className="text-[10px] text-[#B86B4B] font-bold px-2 py-0.5 rounded bg-[#B86B4B]/15 border border-[#B86B4B]/30">
                  Unnormalized State
                </span>
              </div>
              <p className="text-xs text-[#5E5A54]">{proofs[selectedProof].violation.description}</p>

              <div className="overflow-x-auto rounded-xl border border-[#E5E0D6] bg-white">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#F8F6F1] text-[#6F6A62] text-[10px] uppercase font-bold border-b border-[#E5E0D6]">
                    <tr>
                      {proofs[selectedProof].violation.columns.map((c, i) => (
                        <th key={i} className="p-2.5 whitespace-nowrap text-[#B86B4B]">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E0D6] text-[11px]">
                    {proofs[selectedProof].violation.rows.map((r, i) => (
                      <tr key={i} className="hover:bg-[#F8F6F1]">
                        {proofs[selectedProof].violation.columns.map((c, ci) => (
                          <td key={ci} className="p-2.5 text-[#1E1E1E] whitespace-nowrap">{r[c]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-[11px] text-[#B86B4B] font-medium pt-1">
                <strong>Anomalies:</strong> {proofs[selectedProof].violation.problem}
              </div>
            </div>

            {/* Normalized Solution */}
            <div className="p-5 rounded-2xl bg-[#243B35]/5 border border-[#243B35]/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#243B35] uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                  Normalized Architecture: {proofs[selectedProof].solution.table}
                </span>
                <span className="text-[10px] text-[#2E7D32] font-bold px-2 py-0.5 rounded bg-[#2E7D32]/15 border border-[#2E7D32]/30">
                  Lossless Join & Dependency Preserved
                </span>
              </div>
              <p className="text-xs text-[#5E5A54]">{proofs[selectedProof].solution.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {proofs[selectedProof].solution.tables.map((t, idx) => (
                  <div key={idx} className="space-y-2">
                    <span className="text-xs font-bold font-mono text-[#243B35] block">{t.name}</span>
                    <div className="overflow-x-auto rounded-xl border border-[#E5E0D6] bg-white">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-[#F8F6F1] text-[#6F6A62] text-[10px] uppercase font-bold border-b border-[#E5E0D6]">
                          <tr>
                            {t.columns.map((c, i) => (
                              <th key={i} className="p-2 text-[#243B35] whitespace-nowrap">{c}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E0D6] text-[11px]">
                          {t.rows.map((r, ri) => (
                            <tr key={ri} className="hover:bg-[#F8F6F1]">
                              {t.columns.map((c, ci) => (
                                <td key={ci} className="p-2 text-[#1E1E1E] whitespace-nowrap">{r[c]}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#E5E0D6] text-[11px] text-[#243B35] font-semibold">
                <strong>DBMS Mathematical Proof:</strong> {proofs[selectedProof].solution.verdict}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. FUNCTIONAL DEPENDENCIES VIEW */}
      {activeTab === 'fds' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="text-xs text-[#5E5A54] font-medium">
            Verified functional dependencies across relational relations (X → Y, where X is a candidate key / superkey):
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {functionalDependencies.map((fd, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-[#E5E0D6] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1E1E1E] uppercase font-mono">Relation: {fd.source}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#2E7D32]/15 text-[#2E7D32] border border-[#2E7D32]/30">
                    {fd.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-xl bg-[#F8F6F1] border border-[#E5E0D6] text-xs font-mono">
                  <span className="text-[#B86B4B] font-bold">{fd.determinant}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#243B35]" />
                  <div className="flex flex-wrap gap-1">
                    {fd.dependents.map((dep, dIdx) => (
                      <span key={dIdx} className="px-1.5 py-0.5 rounded bg-white text-[#1E1E1E] border border-[#E5E0D6] text-[10px]">
                        {dep}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-[11px] text-[#6F6A62]">
                  Classification: <strong className="text-[#243B35] font-mono">{fd.type}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. DATA DICTIONARY VIEW */}
      {activeTab === 'dictionary' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5 text-xs">
              {['ALL', 'Core', 'Transport', 'Entertainment', 'Sports', 'Hospitality', 'Finance', 'System'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setDictCategory(cat)}
                  className={`px-3 py-1 rounded-xl font-bold transition-all ${
                    dictCategory === cat
                      ? 'bg-[#243B35] text-white border border-[#243B35] shadow-sm'
                      : 'bg-white hover:bg-[#F8F6F1] border border-[#E5E0D6] text-[#5E5A54]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center bg-white px-3 py-1.5 rounded-xl border border-[#E5E0D6] text-xs shadow-sm">
              <Search className="w-3.5 h-3.5 text-[#6F6A62] mr-2" />
              <input
                type="text"
                placeholder="Search table or column..."
                value={dictSearch}
                onChange={(e) => setDictSearch(e.target.value)}
                className="bg-transparent text-[#1E1E1E] outline-none text-xs placeholder:text-[#9E988F]"
              />
            </div>
          </div>

          {/* Dictionary Table */}
          <div className="bg-white rounded-2xl border border-[#E5E0D6] overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F6F1] text-[#6F6A62] uppercase text-[10px] font-bold tracking-wider border-b border-[#E5E0D6]">
                <tr>
                  <th className="p-3.5">Table</th>
                  <th className="p-3.5">Domain</th>
                  <th className="p-3.5">Primary Key</th>
                  <th className="p-3.5">Foreign Key Constraints</th>
                  <th className="p-3.5">Normal Form</th>
                  <th className="p-3.5">Subsystem Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D6]">
                {filteredDict.map((t, idx) => (
                  <tr key={idx} className="hover:bg-[#F8F6F1]/80 transition-colors">
                    <td className="p-3.5 font-bold font-mono text-[#1E1E1E]">{t.name}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F8F6F1] text-[#243B35] border border-[#E5E0D6]">
                        {t.category}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-[#B86B4B] font-semibold">{t.pk}</td>
                    <td className="p-3.5 font-mono text-[#243B35] text-[11px] font-semibold">{t.fk}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#2E7D32]/15 text-[#2E7D32] border border-[#2E7D32]/30">
                        {t.nf}
                      </span>
                    </td>
                    <td className="p-3.5 text-[#5E5A54] leading-relaxed max-w-sm">{t.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
