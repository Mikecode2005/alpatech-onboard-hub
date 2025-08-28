-- Equipment Inventory Table
CREATE TABLE IF NOT EXISTS equipment_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  total_quantity INTEGER NOT NULL DEFAULT 0,
  available_quantity INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'unit',
  location TEXT,
  condition TEXT,
  last_maintenance_date TIMESTAMP WITH TIME ZONE,
  next_maintenance_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Equipment Requests Table
CREATE TABLE IF NOT EXISTS equipment_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requester_name TEXT NOT NULL,
  requester_role TEXT NOT NULL,
  purpose TEXT NOT NULL,
  training_set_id UUID REFERENCES training_sets(id) ON DELETE SET NULL,
  training_set_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL DEFAULT 'normal',
  requested_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  required_date TIMESTAMP WITH TIME ZONE NOT NULL,
  return_date TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Equipment Request Items Table
CREATE TABLE IF NOT EXISTS equipment_request_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES equipment_requests(id) ON DELETE CASCADE,
  equipment_id UUID NOT NULL REFERENCES equipment_inventory(id) ON DELETE CASCADE,
  equipment_name TEXT NOT NULL,
  quantity_requested INTEGER NOT NULL,
  quantity_approved INTEGER,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Equipment Assignments Table
CREATE TABLE IF NOT EXISTS equipment_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES equipment_requests(id) ON DELETE CASCADE,
  equipment_id UUID NOT NULL REFERENCES equipment_inventory(id) ON DELETE CASCADE,
  assigned_to UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  assigned_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expected_return_date TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_return_date TIMESTAMP WITH TIME ZONE,
  return_condition TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Equipment Maintenance Records Table
CREATE TABLE IF NOT EXISTS equipment_maintenance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_id UUID NOT NULL REFERENCES equipment_inventory(id) ON DELETE CASCADE,
  maintenance_type TEXT NOT NULL,
  performed_by TEXT NOT NULL,
  maintenance_date TIMESTAMP WITH TIME ZONE NOT NULL,
  description TEXT NOT NULL,
  cost DECIMAL(10, 2),
  next_maintenance_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies

-- Equipment Inventory RLS
ALTER TABLE equipment_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Equipment inventory visible to authenticated users"
  ON equipment_inventory FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Equipment inventory editable by admins and training coordinators"
  ON equipment_inventory FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles 
      WHERE role IN ('admin', 'training_coordinator', 'operations_manager')
    )
  );

-- Equipment Requests RLS
ALTER TABLE equipment_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Equipment requests visible to authenticated users"
  ON equipment_requests FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Equipment requests insertable by authenticated users"
  ON equipment_requests FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Equipment requests updatable by admins, training coordinators, and requesters"
  ON equipment_requests FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles 
      WHERE role IN ('admin', 'training_coordinator', 'operations_manager')
    ) OR auth.uid() = requester_id
  );

-- Equipment Request Items RLS
ALTER TABLE equipment_request_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Equipment request items visible to authenticated users"
  ON equipment_request_items FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Equipment request items insertable by authenticated users"
  ON equipment_request_items FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Equipment request items updatable by admins and training coordinators"
  ON equipment_request_items FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles 
      WHERE role IN ('admin', 'training_coordinator', 'operations_manager')
    )
  );

-- Equipment Assignments RLS
ALTER TABLE equipment_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Equipment assignments visible to authenticated users"
  ON equipment_assignments FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Equipment assignments editable by admins and training coordinators"
  ON equipment_assignments FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles 
      WHERE role IN ('admin', 'training_coordinator', 'operations_manager')
    )
  );

-- Equipment Maintenance RLS
ALTER TABLE equipment_maintenance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Equipment maintenance visible to authenticated users"
  ON equipment_maintenance FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Equipment maintenance editable by admins and training coordinators"
  ON equipment_maintenance FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles 
      WHERE role IN ('admin', 'training_coordinator', 'operations_manager')
    )
  );

-- Functions and Triggers

-- Function to update equipment available quantity when request is approved
CREATE OR REPLACE FUNCTION update_equipment_quantity_on_approval()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
    UPDATE equipment_inventory
    SET available_quantity = available_quantity - NEW.quantity_approved
    WHERE id = NEW.equipment_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update equipment available quantity when request is approved
CREATE TRIGGER update_equipment_quantity_on_approval_trigger
AFTER UPDATE ON equipment_request_items
FOR EACH ROW
WHEN (NEW.status = 'approved' AND OLD.status = 'pending')
EXECUTE FUNCTION update_equipment_quantity_on_approval();

-- Function to update equipment available quantity when equipment is returned
CREATE OR REPLACE FUNCTION update_equipment_quantity_on_return()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.actual_return_date IS NOT NULL AND OLD.actual_return_date IS NULL THEN
    UPDATE equipment_inventory
    SET available_quantity = available_quantity + NEW.quantity
    WHERE id = NEW.equipment_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update equipment available quantity when equipment is returned
CREATE TRIGGER update_equipment_quantity_on_return_trigger
AFTER UPDATE ON equipment_assignments
FOR EACH ROW
WHEN (NEW.actual_return_date IS NOT NULL AND OLD.actual_return_date IS NULL)
EXECUTE FUNCTION update_equipment_quantity_on_return();

-- Function to update equipment inventory updated_at timestamp
CREATE OR REPLACE FUNCTION update_equipment_inventory_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update equipment inventory updated_at timestamp
CREATE TRIGGER update_equipment_inventory_updated_at_trigger
BEFORE UPDATE ON equipment_inventory
FOR EACH ROW
EXECUTE FUNCTION update_equipment_inventory_updated_at();