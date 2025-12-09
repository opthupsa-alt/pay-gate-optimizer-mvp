/**
 * Provider Data Import Script
 * ============================
 * يقرأ ملفات providers-data/*.md ويحولها إلى بيانات قاعدة البيانات
 * 
 * الاستخدام:
 *   npx ts-node scripts/import-providers.ts [--dry-run] [--provider=slug]
 * 
 * الخيارات:
 *   --dry-run      معاينة التغييرات بدون تنفيذ
 *   --provider=x   استيراد بوابة واحدة فقط
 *   --validate     التحقق من صحة البيانات فقط
 */

import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==================== Types ====================

interface ProviderData {
  // Basic Info
  slug: string;
  nameAr: string;
  nameEn: string;
  category: 'payment_gateway' | 'psp' | 'acquirer' | 'bnpl' | 'aggregator' | 'wallet';
  status: 'active' | 'limited' | 'paused' | 'deprecated';
  websiteUrl?: string;
  logoPath?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  
  // Fees
  setupFee?: number;
  monthlyFee?: number;
  
  // Operations
  activationTimeDaysMin?: number;
  activationTimeDaysMax?: number;
  settlementDaysMin?: number;
  settlementDaysMax?: number;
  payoutSchedule?: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom';
  payoutMinAmount?: number;
  
  // Support
  supportChannels?: string[];
  supportHours?: string;
  supportSla?: string;
  docsUrl?: string;
  termsUrl?: string;
  pricingUrl?: string;
  
  // Currencies
  supportedCurrencies?: string[];
  multiCurrencySupported?: boolean;
  
  // Risk
  riskNotes?: string;
  rollingReservePercent?: number;
  rollingReserveDays?: number;
  
  // Pros/Cons
  prosAr?: string[];
  prosEn?: string[];
  consAr?: string[];
  consEn?: string[];
  
  // Notes
  notesAr?: string;
  notesEn?: string;
  
  // Relations
  fees?: ProviderFeeData[];
  paymentMethods?: PaymentMethodData[];
  capabilities?: string[];
  sectors?: SectorData[];
  integrations?: IntegrationData[];
  opsMetrics?: OpsMetricsData;
  reviews?: ReviewData[];
  wallets?: WalletData[];
  bnpl?: BnplData[];
  sources?: SourceData[];
}

interface ProviderFeeData {
  paymentMethodSlug: string;
  feePercent: number;
  feeFixed: number;
  isEstimated?: boolean;
  notes?: string;
}

interface PaymentMethodData {
  slug: string;
  isSupported: boolean;
  supportsRecurring?: boolean;
  notes?: string;
}

interface SectorData {
  slug: string;
  isSupported: boolean;
  notes?: string;
}

interface IntegrationData {
  platform: string;
  isOfficial: boolean;
  setupDifficulty: 'easy' | 'medium' | 'hard';
  docsUrl?: string;
}

interface OpsMetricsData {
  onboardingScore: number;
  supportScore: number;
  docsScore: number;
}

interface ReviewData {
  platform: string;
  ratingAvg: number;
  ratingCount: number;
  sourceUrl: string;
}

interface WalletData {
  walletType: string;
  isSupported: boolean;
  feePercent?: number;
  feeFixed?: number;
}

interface BnplData {
  bnplProvider: string;
  isIntegrated: boolean;
  merchantFeePercent?: number;
}

interface SourceData {
  sourceType: string;
  sourceUrl: string;
  confidenceLevel: 'high' | 'medium' | 'low';
  lastVerifiedAt?: string;
}

// ==================== Parser ====================

/**
 * يقرأ ملف Markdown ويحوله إلى ProviderData
 */
function parseMarkdownFile(filePath: string): ProviderData | null {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Skip empty files
  if (content.trim().length < 100) {
    console.log(`  ⏭️  Skipping empty file: ${path.basename(filePath)}`);
    return null;
  }
  
  const data: ProviderData = {
    slug: '',
    nameAr: '',
    nameEn: '',
    category: 'payment_gateway',
    status: 'active',
  };
  
  // Parse YAML blocks
  const yamlBlocks = content.match(/```yaml\n([\s\S]*?)```/g) || [];
  
  for (const block of yamlBlocks) {
    const yamlContent = block.replace(/```yaml\n?/, '').replace(/```/, '');
    parseYamlBlock(yamlContent, data);
  }
  
  // Parse tables
  const tables = content.match(/\|[\s\S]*?\|(?=\n\n|\n#|$)/g) || [];
  for (const table of tables) {
    parseTable(table, data);
  }
  
  return data.slug ? data : null;
}

/**
 * يحلل كتلة YAML ويضيف البيانات إلى ProviderData
 */
function parseYamlBlock(yaml: string, data: ProviderData): void {
  const lines = yaml.split('\n');
  let currentKey = '';
  let currentArray: string[] = [];
  let inArray = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    // Array item
    if (trimmed.startsWith('- ')) {
      if (inArray) {
        const value = trimmed.substring(2).replace(/^["']|["']$/g, '');
        currentArray.push(value);
      }
      continue;
    }
    
    // Key-value pair
    const match = trimmed.match(/^(\w+):\s*(.*)$/);
    if (match) {
      // Save previous array if any
      if (inArray && currentKey && currentArray.length > 0) {
        (data as any)[currentKey] = currentArray;
        currentArray = [];
      }
      
      currentKey = match[1];
      let value = match[2].replace(/^["']|["']$/g, '').trim();
      
      // Check if starting an array
      if (value === '' || value === '|') {
        inArray = value !== '|';
        continue;
      }
      
      inArray = false;
      
      // Parse value based on type
      if (value === 'true') {
        (data as any)[currentKey] = true;
      } else if (value === 'false') {
        (data as any)[currentKey] = false;
      } else if (/^\d+$/.test(value)) {
        (data as any)[currentKey] = parseInt(value, 10);
      } else if (/^\d+\.\d+$/.test(value)) {
        (data as any)[currentKey] = parseFloat(value);
      } else if (value) {
        (data as any)[currentKey] = value;
      }
    }
  }
  
  // Save last array if any
  if (inArray && currentKey && currentArray.length > 0) {
    (data as any)[currentKey] = currentArray;
  }
}

/**
 * يحلل جدول Markdown
 */
function parseTable(table: string, data: ProviderData): void {
  const lines = table.trim().split('\n');
  if (lines.length < 3) return; // Header + separator + at least one row
  
  const headers = lines[0].split('|').map(h => h.trim()).filter(Boolean);
  
  // Detect table type by headers
  if (headers.includes('payment_method_id') && headers.includes('النسبة %')) {
    // Transaction fees table
    data.fees = data.fees || [];
    for (let i = 2; i < lines.length; i++) {
      const cells = lines[i].split('|').map(c => c.trim()).filter(Boolean);
      if (cells.length >= 4 && cells[1] && cells[2]) {
        data.fees.push({
          paymentMethodSlug: cells[1],
          feePercent: parseFloat(cells[2]) || 0,
          feeFixed: parseFloat(cells[3]) || 0,
          isEstimated: cells[5]?.includes('✅') || false,
          notes: cells[4] || undefined,
        });
      }
    }
  }
  
  if (headers.includes('payment_method_id') && headers.includes('مدعومة؟')) {
    // Payment methods table
    data.paymentMethods = data.paymentMethods || [];
    for (let i = 2; i < lines.length; i++) {
      const cells = lines[i].split('|').map(c => c.trim()).filter(Boolean);
      if (cells.length >= 3 && cells[1]) {
        data.paymentMethods.push({
          slug: cells[1],
          isSupported: cells[2]?.includes('✅') || false,
          supportsRecurring: cells[3]?.includes('✅') || false,
          notes: cells[4] || undefined,
        });
      }
    }
  }
  
  if (headers.includes('sector_id') && headers.includes('الحالة')) {
    // Sectors table
    data.sectors = data.sectors || [];
    for (let i = 2; i < lines.length; i++) {
      const cells = lines[i].split('|').map(c => c.trim()).filter(Boolean);
      if (cells.length >= 3 && cells[1]) {
        data.sectors.push({
          slug: cells[1],
          isSupported: cells[2]?.includes('supported') || cells[2]?.includes('✅') || false,
          notes: cells[3] || undefined,
        });
      }
    }
  }
  
  if (headers.includes('platform') && headers.includes('متاح؟')) {
    // Integrations table
    data.integrations = data.integrations || [];
    for (let i = 2; i < lines.length; i++) {
      const cells = lines[i].split('|').map(c => c.trim()).filter(Boolean);
      if (cells.length >= 4 && cells[1] && cells[2]?.includes('✅')) {
        data.integrations.push({
          platform: cells[1],
          isOfficial: cells[3]?.includes('✅') || false,
          setupDifficulty: (cells[4] as any) || 'medium',
          docsUrl: cells[5] || undefined,
        });
      }
    }
  }
}

// ==================== Validation ====================

interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

function validateProviderData(data: ProviderData): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // Required fields
  if (!data.slug) {
    errors.push({ field: 'slug', message: 'slug is required', severity: 'error' });
  }
  if (!data.nameAr) {
    errors.push({ field: 'nameAr', message: 'nameAr is required', severity: 'error' });
  }
  if (!data.nameEn) {
    errors.push({ field: 'nameEn', message: 'nameEn is required', severity: 'error' });
  }
  
  // Important warnings
  if (!data.fees || data.fees.length === 0) {
    errors.push({ field: 'fees', message: 'No transaction fees defined - will use defaults', severity: 'warning' });
  }
  if (!data.paymentMethods || data.paymentMethods.length === 0) {
    errors.push({ field: 'paymentMethods', message: 'No payment methods defined', severity: 'warning' });
  }
  if (!data.opsMetrics) {
    errors.push({ field: 'opsMetrics', message: 'OpsMetrics not defined - will use defaults', severity: 'warning' });
  }
  
  // Validate fee values
  if (data.fees) {
    for (const fee of data.fees) {
      if (fee.feePercent < 0 || fee.feePercent > 100) {
        errors.push({ field: `fees.${fee.paymentMethodSlug}`, message: 'feePercent must be 0-100', severity: 'error' });
      }
      if (fee.feeFixed < 0) {
        errors.push({ field: `fees.${fee.paymentMethodSlug}`, message: 'feeFixed cannot be negative', severity: 'error' });
      }
    }
  }
  
  // Validate scores
  if (data.opsMetrics) {
    for (const key of ['onboardingScore', 'supportScore', 'docsScore'] as const) {
      const value = data.opsMetrics[key];
      if (value < 0 || value > 100) {
        errors.push({ field: `opsMetrics.${key}`, message: 'Score must be 0-100', severity: 'error' });
      }
    }
  }
  
  return errors;
}

// ==================== Database Operations ====================

async function upsertProvider(data: ProviderData, dryRun: boolean): Promise<void> {
  console.log(`\n📦 Processing: ${data.nameEn} (${data.slug})`);
  
  // Validate first
  const errors = validateProviderData(data);
  const hasErrors = errors.some(e => e.severity === 'error');
  
  if (errors.length > 0) {
    console.log('  Validation:');
    for (const error of errors) {
      const icon = error.severity === 'error' ? '❌' : '⚠️';
      console.log(`    ${icon} ${error.field}: ${error.message}`);
    }
  }
  
  if (hasErrors) {
    console.log('  ❌ Skipping due to errors');
    return;
  }
  
  if (dryRun) {
    console.log('  ✅ Would upsert provider (dry-run)');
    console.log(`     - Fees: ${data.fees?.length || 0} payment methods`);
    console.log(`     - Payment Methods: ${data.paymentMethods?.length || 0}`);
    console.log(`     - Integrations: ${data.integrations?.length || 0}`);
    console.log(`     - Sectors: ${data.sectors?.length || 0}`);
    return;
  }
  
  // Upsert main provider record
  const provider = await prisma.provider.upsert({
    where: { slug: data.slug },
    create: {
      slug: data.slug,
      nameAr: data.nameAr,
      nameEn: data.nameEn,
      category: data.category,
      status: data.status,
      websiteUrl: data.websiteUrl,
      logoPath: data.logoPath,
      descriptionAr: data.descriptionAr,
      descriptionEn: data.descriptionEn,
      setupFee: data.setupFee,
      monthlyFee: data.monthlyFee,
      activationTimeDaysMin: data.activationTimeDaysMin || 1,
      activationTimeDaysMax: data.activationTimeDaysMax || 14,
      settlementDaysMin: data.settlementDaysMin || 1,
      settlementDaysMax: data.settlementDaysMax || 3,
      payoutSchedule: data.payoutSchedule || 'weekly',
      payoutMinAmount: data.payoutMinAmount,
      supportChannels: data.supportChannels || [],
      supportHours: data.supportHours,
      supportSla: data.supportSla,
      docsUrl: data.docsUrl,
      termsUrl: data.termsUrl,
      pricingUrl: data.pricingUrl,
      supportedCurrencies: data.supportedCurrencies || ['SAR'],
      multiCurrencySupported: data.multiCurrencySupported || false,
      riskNotes: data.riskNotes,
      rollingReservePercent: data.rollingReservePercent,
      rollingReserveDays: data.rollingReserveDays,
      prosAr: data.prosAr || [],
      prosEn: data.prosEn || [],
      consAr: data.consAr || [],
      consEn: data.consEn || [],
      notesAr: data.notesAr,
      notesEn: data.notesEn,
      lastVerifiedAt: new Date(),
    },
    update: {
      nameAr: data.nameAr,
      nameEn: data.nameEn,
      category: data.category,
      status: data.status,
      websiteUrl: data.websiteUrl,
      logoPath: data.logoPath,
      descriptionAr: data.descriptionAr,
      descriptionEn: data.descriptionEn,
      setupFee: data.setupFee,
      monthlyFee: data.monthlyFee,
      activationTimeDaysMin: data.activationTimeDaysMin,
      activationTimeDaysMax: data.activationTimeDaysMax,
      settlementDaysMin: data.settlementDaysMin,
      settlementDaysMax: data.settlementDaysMax,
      payoutSchedule: data.payoutSchedule,
      payoutMinAmount: data.payoutMinAmount,
      supportChannels: data.supportChannels,
      supportHours: data.supportHours,
      supportSla: data.supportSla,
      docsUrl: data.docsUrl,
      termsUrl: data.termsUrl,
      pricingUrl: data.pricingUrl,
      supportedCurrencies: data.supportedCurrencies,
      multiCurrencySupported: data.multiCurrencySupported,
      riskNotes: data.riskNotes,
      rollingReservePercent: data.rollingReservePercent,
      rollingReserveDays: data.rollingReserveDays,
      prosAr: data.prosAr,
      prosEn: data.prosEn,
      consAr: data.consAr,
      consEn: data.consEn,
      notesAr: data.notesAr,
      notesEn: data.notesEn,
      lastVerifiedAt: new Date(),
      updatedAt: new Date(),
    },
  });
  
  console.log(`  ✅ Provider upserted: ${provider.id}`);
  
  // Upsert fees
  if (data.fees && data.fees.length > 0) {
    for (const fee of data.fees) {
      // Find payment method ID by code (not slug)
      const pm = await prisma.paymentMethod.findUnique({
        where: { code: fee.paymentMethodSlug },
      });
      
      if (!pm) {
        console.log(`    ⚠️ Payment method not found: ${fee.paymentMethodSlug}`);
        continue;
      }
      
      // Check if fee already exists
      const existingFee = await prisma.providerFee.findFirst({
        where: {
          providerId: provider.id,
          paymentMethodId: pm.id,
        },
      });
      
      if (existingFee) {
        await prisma.providerFee.update({
          where: { id: existingFee.id },
          data: {
            feePercent: fee.feePercent,
            feeFixed: fee.feeFixed,
            isEstimated: fee.isEstimated,
            notesAr: fee.notes,
            lastVerifiedAt: new Date(),
          },
        });
      } else {
        await prisma.providerFee.create({
          data: {
            providerId: provider.id,
            paymentMethodId: pm.id,
            feePercent: fee.feePercent,
            feeFixed: fee.feeFixed,
            isEstimated: fee.isEstimated || false,
            notesAr: fee.notes,
            lastVerifiedAt: new Date(),
          },
        });
      }
    }
    console.log(`  ✅ Fees upserted: ${data.fees.length}`);
  }
  
  // Upsert payment methods
  if (data.paymentMethods && data.paymentMethods.length > 0) {
    for (const pm of data.paymentMethods) {
      const paymentMethod = await prisma.paymentMethod.findUnique({
        where: { code: pm.slug },
      });
      
      if (!paymentMethod) {
        console.log(`    ⚠️ Payment method not found: ${pm.slug}`);
        continue;
      }
      
      // Use the correct unique constraint name
      const existingPM = await prisma.providerPaymentMethod.findUnique({
        where: {
          providerId_paymentMethodId: {
            providerId: provider.id,
            paymentMethodId: paymentMethod.id,
          },
        },
      });
      
      if (existingPM) {
        await prisma.providerPaymentMethod.update({
          where: { id: existingPM.id },
          data: {
            isSupported: pm.isSupported,
            supportsRecurring: pm.supportsRecurring,
            notes: pm.notes,
          },
        });
      } else {
        await prisma.providerPaymentMethod.create({
          data: {
            providerId: provider.id,
            paymentMethodId: paymentMethod.id,
            isSupported: pm.isSupported,
            supportsRecurring: pm.supportsRecurring || false,
            notes: pm.notes,
          },
        });
      }
    }
    console.log(`  ✅ Payment methods upserted: ${data.paymentMethods.length}`);
  }
  
  // Upsert OpsMetrics
  if (data.opsMetrics) {
    await prisma.opsMetrics.upsert({
      where: { providerId: provider.id },
      create: {
        providerId: provider.id,
        onboardingScore: data.opsMetrics.onboardingScore,
        supportScore: data.opsMetrics.supportScore,
        docsScore: data.opsMetrics.docsScore,
      },
      update: {
        onboardingScore: data.opsMetrics.onboardingScore,
        supportScore: data.opsMetrics.supportScore,
        docsScore: data.opsMetrics.docsScore,
      },
    });
    console.log(`  ✅ OpsMetrics upserted`);
  }
  
  // Upsert integrations
  if (data.integrations && data.integrations.length > 0) {
    for (const integration of data.integrations) {
      await prisma.providerIntegration.upsert({
        where: {
          providerId_platform: {
            providerId: provider.id,
            platform: integration.platform as any,
          },
        },
        create: {
          providerId: provider.id,
          platform: integration.platform as any,
          integrationType: 'plugin',
          isOfficial: integration.isOfficial,
          setupDifficulty: integration.setupDifficulty as any,
          docsUrl: integration.docsUrl,
          lastVerifiedAt: new Date(),
        },
        update: {
          isOfficial: integration.isOfficial,
          setupDifficulty: integration.setupDifficulty as any,
          docsUrl: integration.docsUrl,
          lastVerifiedAt: new Date(),
        },
      });
    }
    console.log(`  ✅ Integrations upserted: ${data.integrations.length}`);
  }
  
  // Upsert sectors
  if (data.sectors && data.sectors.length > 0) {
    for (const sector of data.sectors) {
      // Use code instead of slug
      const sectorRecord = await prisma.sector.findUnique({
        where: { code: sector.slug },
      });
      
      if (!sectorRecord) {
        console.log(`    ⚠️ Sector not found: ${sector.slug}`);
        continue;
      }
      
      // Check if sector rule exists
      const existingRule = await prisma.providerSectorRule.findUnique({
        where: {
          providerId_sectorId: {
            providerId: provider.id,
            sectorId: sectorRecord.id,
          },
        },
      });
      
      if (existingRule) {
        await prisma.providerSectorRule.update({
          where: { id: existingRule.id },
          data: {
            isSupported: sector.isSupported,
            notes: sector.notes,
          },
        });
      } else {
        await prisma.providerSectorRule.create({
          data: {
            providerId: provider.id,
            sectorId: sectorRecord.id,
            isSupported: sector.isSupported,
            notes: sector.notes,
          },
        });
      }
    }
    console.log(`  ✅ Sectors upserted: ${data.sectors.length}`);
  }
}

// ==================== Main ====================

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const validateOnly = args.includes('--validate');
  const providerArg = args.find(a => a.startsWith('--provider='));
  const targetProvider = providerArg?.split('=')[1];
  
  console.log('🚀 Provider Data Import Script');
  console.log('================================');
  console.log(`Mode: ${dryRun ? 'Dry Run' : validateOnly ? 'Validate Only' : 'Live'}`);
  if (targetProvider) console.log(`Target: ${targetProvider}`);
  console.log('');
  
  const providersDir = path.join(__dirname, '..', 'providers-data');
  const files = fs.readdirSync(providersDir)
    .filter(f => f.endsWith('.md') && !f.startsWith('_') && f !== 'README.md')
    .filter(f => !targetProvider || f === `${targetProvider}.md`);
  
  console.log(`📂 Found ${files.length} provider files\n`);
  
  let processed = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const file of files) {
    const filePath = path.join(providersDir, file);
    
    try {
      const data = parseMarkdownFile(filePath);
      
      if (!data) {
        skipped++;
        continue;
      }
      
      if (validateOnly) {
        const validationErrors = validateProviderData(data);
        console.log(`\n${file}:`);
        if (validationErrors.length === 0) {
          console.log('  ✅ Valid');
        } else {
          for (const error of validationErrors) {
            const icon = error.severity === 'error' ? '❌' : '⚠️';
            console.log(`  ${icon} ${error.field}: ${error.message}`);
          }
        }
        processed++;
        continue;
      }
      
      await upsertProvider(data, dryRun);
      processed++;
      
    } catch (error) {
      console.error(`\n❌ Error processing ${file}:`, error);
      errors++;
    }
  }
  
  console.log('\n================================');
  console.log('📊 Summary:');
  console.log(`   Processed: ${processed}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Errors: ${errors}`);
  
  await prisma.$disconnect();
}

main().catch(console.error);
