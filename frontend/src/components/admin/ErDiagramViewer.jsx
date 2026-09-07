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
      color: 'border-[#243B35]/30 text-[#243B35] bg-[#243B35]/10',
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
      color: 'border-[#B86B4B]/30 text-[#B86B4B] bg-[#B86B4B]/10',
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
      color: 'border-[#2E7D32]/30 text-[#2E7D32] bg-[#2E7D32]/10',
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
      color: 'border-[#C9A96E]/40 text-[#8C6B28] bg-[#C9A96E]/15',
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
      color: 'border-[#B86B4B]/30 text-[#B86B4B] bg-[#B86B4B]/10',
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
      color: 'border-[#4A6FA5]/30 text-[#4A6FA5] bg-[#4A6FA5]/10',
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
      <div className="bg-white p-6 rounded-3xl border border-[#E5E0D6] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#243B35]" />
            <h3 className="text-lg font-black text-[#1E1E1E] font-serif">Entity-Relationship (ER) Architecture</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-[#243B35]/10 text-[#243B35] font-mono text-xs font-bold border border-[#243B35]/20">
              3NF Relational Model
            </span>
          </div>
          <p className="text-xs text-[#5E5A54] mt-1 max-w-2xl leading-relaxed">
            Visualized relational layout mapping primary keys [PK], foreign key [FK] references, and entity cardinalities (1:1, 1:N, M:N) across 25 normalized tables.
          </p>
        </div>

        {/* Search Input */}
        <div className="flex items-center bg-[#F8F6F1] px-3.5 py-2 rounded-xl border border-[#E5E0D6] text-xs shadow-sm">
          <Search className="w-3.5 h-3.5 text-[#6F6A62] mr-2" />
          <input
            type="text"
            placeholder="Search table..."
            value={searchTable}
            onChange={(e) => setSearchTable(e.target.value)}
            className="bg-transparent text-[#1E1E1E] outline-none text-xs placeholder:text-[#9E988F]"
          />
        </div>
      </div>

      {/* Relational Domains Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {domains.map((dom, dIdx) => (
          <div
            key={dIdx}
            className="bg-white rounded-3xl p-5 border border-[#E5E0D6] shadow-sm space-y-4"
          >
            {/* Domain Title */}
            <div className="flex items-center justify-between border-b border-[#E5E0D6] pb-3">
              <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${dom.color}`}>
                {dom.name}
              </span>
              <span className="text-[10px] text-[#6F6A62] font-mono font-semibold">{dom.tables.length} Tables</span>
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
                          ? 'bg-[#F8F6F1] border-2 border-[#243B35] shadow-sm'
                          : 'bg-white hover:bg-[#F8F6F1] border-[#E5E0D6] shadow-sm'
                      }`}
                    >
                      {/* Table Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Database className="w-3.5 h-3.5 text-[#243B35]" />
                          <span className="text-xs font-bold font-mono text-[#1E1E1E]">{table.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#B86B4B] bg-[#B86B4B]/10 px-1.5 py-0.5 rounded border border-[#B86B4B]/20 font-bold">
                          PK: {table.pk}
                        </span>
                      </div>

                      {/* Foreign Key Connectors */}
                      {table.fks.length > 0 && (
                        <div className="mb-2 space-y-1">
                          {table.fks.map((fk, fIdx) => (
                            <div key={fIdx} className="text-[10px] font-mono text-[#5E5A54] flex items-center gap-1">
                              <span className="px-1 rounded bg-[#243B35]/10 text-[#243B35] border border-[#243B35]/20 font-bold">FK</span>
                              <span>{fk.field}</span>
                              <ArrowRight className="w-2.5 h-2.5 text-[#6F6A62]" />
                              <span className="text-[#243B35] font-bold">{fk.ref}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Key Attributes */}
                      <div className="text-[10px] text-[#6F6A62] font-mono space-y-0.5 pt-1 border-t border-[#E5E0D6]">
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
        <div className="bg-white p-5 rounded-2xl border border-[#243B35] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
          <div>
            <div className="text-xs font-mono font-bold text-[#B86B4B] uppercase tracking-wider">Selected Entity</div>
            <h4 className="text-base font-extrabold text-[#1E1E1E] font-mono">TABLE: {selectedEntity.name}</h4>
            <div className="text-xs text-[#5E5A54] mt-1 flex flex-wrap gap-2">
              <span className="font-semibold text-[#1E1E1E]">Primary Key: {selectedEntity.pk}</span>
              <span>•</span>
              <span>Foreign Keys: {selectedEntity.fks.length}</span>
              <span>•</span>
              <span>Total Columns: {selectedEntity.fields.length + 1}</span>
            </div>
          </div>

          <button
            onClick={() => setSelectedEntity(null)}
            className="self-start sm:self-auto px-4 py-1.5 rounded-xl text-xs font-bold bg-[#F8F6F1] hover:bg-[#E5E0D6] text-[#1E1E1E] border border-[#E5E0D6] transition-colors"
          >
            Close Inspector
          </button>
        </div>
      )}
    </div>
  );
}
