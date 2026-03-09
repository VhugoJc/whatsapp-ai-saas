/**
 * Multi-Tenant Support for WhatsApp Business Accounts
 * Maps Phone Number IDs to tenant identifiers
 */

interface TenantConfig {
  tenantId: string;
  businessName: string;
  // Add more tenant-specific configuration as needed
}

// In-memory tenant mapping - in production this would come from a database
const TENANT_MAP: Record<string, TenantConfig> = {
  // Example mappings - replace with your actual phone number IDs
  "123456": {
    tenantId: "academy_salsa",
    businessName: "Academia de Salsa"
  },
  "991146037420595": {
    tenantId: "academy_main", 
    businessName: "Academia Principal"
  },
  // Add more tenants as needed
};

/**
 * Resolve tenant information based on WhatsApp Phone Number ID
 * @param phoneNumberId - WhatsApp Business Account Phone Number ID from webhook metadata
 * @returns Tenant configuration or null if not found
 */
export function resolveTenant(phoneNumberId: string): TenantConfig | null {
  if (!phoneNumberId) {
    console.log('[Tenant] No phone number ID provided');
    return null;
  }

  const tenant = TENANT_MAP[phoneNumberId];
  
  if (!tenant) {
    console.log(`[Tenant] No tenant found for phone number ID: ${phoneNumberId}`);
    return null;
  }

  console.log(`[Tenant] Resolved tenant: ${tenant.tenantId} (${tenant.businessName}) for phone ID: ${phoneNumberId}`);
  return tenant;
}

/**
 * Get all configured tenants
 * @returns Array of all tenant configurations
 */
export function getAllTenants(): TenantConfig[] {
  return Object.values(TENANT_MAP);
}

/**
 * Add a new tenant mapping (for dynamic tenant registration)
 * @param phoneNumberId - WhatsApp Phone Number ID
 * @param config - Tenant configuration
 */
export function addTenant(phoneNumberId: string, config: TenantConfig): void {
  TENANT_MAP[phoneNumberId] = config;
  console.log(`[Tenant] Added new tenant: ${config.tenantId} for phone ID: ${phoneNumberId}`);
}

/**
 * Remove a tenant mapping
 * @param phoneNumberId - WhatsApp Phone Number ID to remove
 */
export function removeTenant(phoneNumberId: string): boolean {
  if (TENANT_MAP[phoneNumberId]) {
    const tenant = TENANT_MAP[phoneNumberId];
    delete TENANT_MAP[phoneNumberId];
    console.log(`[Tenant] Removed tenant: ${tenant.tenantId} for phone ID: ${phoneNumberId}`);
    return true;
  }
  return false;
}
