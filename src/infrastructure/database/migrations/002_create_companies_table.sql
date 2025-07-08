CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    business_number VARCHAR(50) UNIQUE NOT NULL,
    address TEXT,
    phone_number VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    description TEXT,
    status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'inactive', 'pending_approval')),
    contract_start_date DATE,
    contract_end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_companies_business_number ON companies(business_number);
CREATE INDEX idx_companies_status ON companies(status);

CREATE TABLE IF NOT EXISTS company_contracts (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    contract_number VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    max_students INTEGER NOT NULL,
    budget DECIMAL(12, 2),
    terms TEXT,
    status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'expired', 'terminated')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_company_contracts_company_id ON company_contracts(company_id);
CREATE INDEX idx_company_contracts_status ON company_contracts(status);