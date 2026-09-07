import React, { useState } from 'react';
import {
  Share2,
  Key,
  Database,
  ArrowRight,
  Shield,
  Layers,
  Search,
  Maximize2,
  Info
} from 'lucide-react';

export default function ErDiagramViewer() {
  const [searchTable, setSearchTable] = useState('');
  const [selectedEntity, setSelectedEntity] = useState(null);

  const domains = [
    {
      name: 'Security & Memberships',
      color: 'border-blue-500/40 text-blue-400 bg-blue-50',
      tables: [
        {
          name: 'memberships',
          pk: 'id',
          fks: [],
          fields: ['tier_name (VARCHAR)', 'min_points (INT)', 'discount_pct (DECIMAL)', 'points_multiplier (DECIMAL)']
        },
        {
          name: 'users',
          pk: 'id',
          fks: [{ field: 'membership_id', ref: 'memberships.id' }],
          fields: ['full_name (VARCHAR)', 'email (VARCHAR UNIQUE)', 'password_hash (VARCHAR)', 'reward_points (INT)']
        },
        {
          name: 'admins',
          pk: 'id',
          fks: [{ field: 'user_id', ref: 'users.id' }],
          fields: ['role (ENUM)', 'department (VARCHAR)', 'permissions (JSON)']
        }
      ]
    },
    {
      name: 'Catalog & Locations',
      color: 'border-cyan-500/40 text-[#B86B4B] bg-emerald-50',
      tables: [
        {
          name: 'categories',
          pk: 'id',
          fks: [],
          fields: ['name (VARCHAR)', 'slug (VARCHAR UNIQUE)', 'parent_type (ENUM)', 'icon_name (VARCHAR)']
        },
        {
          name: 'locations',
          pk: 'id',
          fks: [],
          fields: ['city (VARCHAR)', 'state (VARCHAR)', 'country (VARCHAR)', 'landmark (VARCHAR)']
        },
        {
          name: 'services',
          pk: 'id',
          fks: [{ field: 'category_id', ref: 'categories.id' }, { field: 'location_id', ref: 'locations.id' }],
          fields: ['title (VARCHAR)', 'slug (VARCHAR UNIQUE)', 'base_price (DECIMAL)', 'price_unit (VARCHAR)', 'rating (DECIMAL)']
        },
        {
          name: 'service_amenities',
          pk: 'id',
          fks: [{ field: 'service_id', ref: 'services.id' }],
          fields: ['amenity_name (VARCHAR)', 'icon_name (VARCHAR)']
        },
        {
          name: 'schedules',
          pk: 'id',
          fks: [{ field: 'service_id', ref: 'services.id' }],
          fields: ['departure_time (TIME)', 'arrival_time (TIME)', 'operating_days (VARCHAR)']
        }
      ]
    },
    {
      name: 'Granular Inventory & Locks',
      color: 'border-emerald-500/40 text-emerald-400 bg-teal-50',
      tables: [
        {
          name: 'seats',
          pk: 'id',
          fks: [{ field: 'service_id', ref: 'services.id' }],
          fields: ['seat_number (VARCHAR)', 'seat_class (ENUM)', 'price_multiplier (DECIMAL)']
        },
        {
          name: 'slots',
          pk: 'id',
          fks: [{ field: 'service_id', ref: 'services.id' }],
          fields: ['slot_date (DATE)', 'start_time (TIME)', 'end_time (TIME)', 'capacity (INT)']
        },
        {
          name: 'rooms',
          pk: 'id',
          fks: [{ field: 'service_id', ref: 'services.id' }],
          fields: ['room_type (VARCHAR)', 'max_guests (INT)', 'price_per_night (DECIMAL)']
        },
        {
          name: 'restaurant_tables',
          pk: 'id',
          fks: [{ field: 'service_id', ref: 'services.id' }],
          fields: ['table_number (VARCHAR)', 'seating_capacity (INT)', 'table_type (ENUM)']
        },
        {
          name: 'seat_reservations_temp',
          pk: 'id',
          fks: [{ field: 'service_id', ref: 'services.id' }, { field: 'user_id', ref: 'users.id' }],
          fields: ['resource_id (VARCHAR)', 'expires_at (TIMESTAMP)', 'status (ENUM)']
        }
      ]
    },
    {
      name: 'Booking & Order Subsystem',
      color: 'border-purple-500/40 text-purple-400 bg-amber-50',
      tables: [
        {
          name: 'bookings',
          pk: 'id',
          fks: [{ field: 'user_id', ref: 'users.id' }, { field: 'service_id', ref: 'services.id' }],
          fields: ['booking_ref (VARCHAR UNIQUE)', 'scheduled_date (DATE)', 'scheduled_time (VARCHAR)', 'final_amount (DECIMAL)', 'status (ENUM)']
        },
        {
          name: 'booking_items',
          pk: 'id',
          fks: [{ field: 'booking_id', ref: 'bookings.id' }],
          fields: ['item_type (ENUM)', 'item_ref (VARCHAR)', 'unit_price (DECIMAL)', 'quantity (INT)']
        },
        {
          name: 'passengers',
          pk: 'id',
          fks: [{ field: 'booking_id', ref: 'bookings.id' }],
          fields: ['full_name (VARCHAR)', 'age (INT)', 'gender (ENUM)', 'seat_or_ticket_number (VARCHAR)']
        }
      ]
    },
    {
      name: 'Financials, Refunds & Coupons',
      color: 'border-amber-500/40 text-amber-400 bg-orange-50',
      tables: [
        {
          name: 'payments',
          pk: 'id',
          fks: [{ field: 'booking_id', ref: 'bookings.id' }, { field: 'user_id', ref: 'users.id' }],
          fields: ['payment_ref (VARCHAR UNIQUE)', 'amount (DECIMAL)', 'payment_method (ENUM)', 'transaction_id (VARCHAR)', 'status (ENUM)']
        },
        {
          name: 'refunds',
          pk: 'id',
          fks: [{ field: 'booking_id', ref: 'bookings.id' }, { field: 'payment_id', ref: 'payments.id' }],
          fields: ['refund_ref (VARCHAR UNIQUE)', 'original_amount (DECIMAL)', 'cancellation_fee (DECIMAL)', 'refund_amount (DECIMAL)']
        },
        {
          name: 'coupons',
          pk: 'id',
          fks: [],
          fields: ['code (VARCHAR UNIQUE)', 'discount_type (ENUM)', 'discount_value (DECIMAL)', 'min_spend (DECIMAL)']
        },
        {
          name: 'booking_coupons',
          pk: 'id',
          fks: [{ field: 'booking_id', ref: 'bookings.id' }, { field: 'coupon_id', ref: 'coupons.id' }],
          fields: ['discount_applied (DECIMAL)', 'applied_at (TIMESTAMP)']
        }
      ]
    },
    {
      name: 'Audit, Reviews & Queues',
      color: 'border-rose-500/40 text-rose-400 bg-rose-950/20',
      tables: [
        {
          name: 'reviews',
          pk: 'id',
          fks: [{ field: 'service_id', ref: 'services.id' }, { field: 'user_id', ref: 'users.id' }],
          fields: ['rating (INT CHECK)', 'title (VARCHAR)', 'review_text (TEXT)', 'is_verified_booking (BOOLEAN)']
        },
        {
          name: 'reward_points_ledger',
          pk: 'id',
          fks: [{ field: 'user_id', ref: 'users.id' }],
          fields: ['points_change (INT)', 'transaction_type (ENUM)', 'balance_after (INT)']
        },
        {
          name: 'notifications',
          pk: 'id',
          fks: [{ field: 'user_id', ref: 'users.id' }],
          fields: ['title (VARCHAR)', 'message (TEXT)', 'notification_type (ENUM)', 'is_read (BOOLEAN)']
        },
        {
          name: 'audit_logs',
          pk: 'id',
          fks: [{ field: 'user_id', ref: 'users.id' }],
          fields: ['action_type (VARCHAR)', 'entity_name (VARCHAR)', 'entity_id (VARCHAR)', 'details (JSON)']
        },
        {
          name: 'waiting_list',
          pk: 'id',
          fks: [{ field: 'service_id', ref: 'services.id' }, { field: 'user_id', ref: 'users.id' }],
          fields: ['desired_date (DATE)', 'desired_slot (VARCHAR)', 'status (ENUM)']
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 via-space-900 to-purple-950/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#B86B4B]" />
            <h3 className="text-lg font-black text-[#171513]">Entity-Relationship (ER) Architecture</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30">
              3NF Relational Model
            </span>
          </div>
          <p className="text-xs text-[#38342F] mt-1 max-w-2xl leading-relaxed">
            Visualized relational layout mapping primary keys [PK], foreign key [FK] references, and entity cardinalities (1:1, 1:N, M:N) across 25 normalized tables.
          </p>
        </div>

        {/* Search Input */}
        <div className="flex items-center glass-panel px-3 py-1.5 rounded-xl border border-[#E8DFD1] text-xs">
          <Search className="w-3.5 h-3.5 text-[#5C554B] mr-2" />
          <input
            type="text"
            placeholder="Search table..."
            value={searchTable}
            onChange={(e) => setSearchTable(e.target.value)}
            className="bg-transparent text-[#171513] outline-none text-xs placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Relational Domains Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {domains.map((dom, dIdx) => (
          <div
            key={dIdx}
            className="glass-panel rounded-3xl p-5 border border-[#E8DFD1] space-y-4"
          >
            {/* Domain Title */}
            <div className="flex items-center justify-between border-b border-[#E8DFD1] pb-3">
              <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${dom.color}`}>
                {dom.name}
              </span>
              <span className="text-[10px] text-[#5C554B] font-mono">{dom.tables.length} Tables</span>
            </div>

            {/* Tables Inside Domain */}
            <div className="space-y-3">
              {dom.tables
                .filter(t => !searchTable || t.name.toLowerCase().includes(searchTable.toLowerCase()))
                .map((table) => {
                  const isSelected = selectedEntity?.name === table.name;
                  return (
                    <div
                      key={table.name}
                      onClick={() => setSelectedEntity(table)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-400 shadow-glow-cyan'
                          : 'bg-white/70 hover:bg-[#FAF8F3] border-[#E8DFD1]'
                      }`}
                    >
                      {/* Table Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Database className="w-3.5 h-3.5 text-[#B86B4B]" />
                          <span className="text-xs font-bold font-mono text-[#171513]">{table.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-500/30">
                          PK: {table.pk}
                        </span>
                      </div>

                      {/* Foreign Key Connectors */}
                      {table.fks.length > 0 && (
                        <div className="mb-2 space-y-1">
                          {table.fks.map((fk, fIdx) => (
                            <div key={fIdx} className="text-[10px] font-mono text-purple-300 flex items-center gap-1">
                              <span className="px-1 rounded bg-purple-950 border border-purple-500/30">FK</span>
                              <span>{fk.field}</span>
                              <ArrowRight className="w-2.5 h-2.5 text-slate-500" />
                              <span className="text-[#B86B4B]">{fk.ref}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Key Attributes */}
                      <div className="text-[10px] text-[#5C554B] font-mono space-y-0.5 pt-1 border-t border-[#E8DFD1]">
                        {table.fields.slice(0, 3).map((f, i) => (
                          <div key={i} className="truncate">• {f}</div>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Entity Inspector Modal */}
      {selectedEntity && (
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/40 shadow-glow-cyan flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
          <div>
            <div className="text-xs font-mono font-bold text-[#B86B4B] uppercase">Selected Entity</div>
            <h4 className="text-base font-extrabold text-[#171513] font-mono">TABLE: {selectedEntity.name}</h4>
            <div className="text-xs text-[#5C554B] mt-1 flex flex-wrap gap-2">
              <span className="font-semibold text-slate-200">Primary Key: {selectedEntity.pk}</span>
              <span>•</span>
              <span>Foreign Keys: {selectedEntity.fks.length}</span>
              <span>•</span>
              <span>Total Columns: {selectedEntity.fields.length + 1}</span>
            </div>
          </div>

          <button
            onClick={() => setSelectedEntity(null)}
            className="self-start sm:self-auto px-4 py-1.5 rounded-xl text-xs font-semibold glass-panel text-[#38342F] hover:text-[#171513]"
          >
            Close Inspector
          </button>
        </div>
      )}
    </div>
  );
}
