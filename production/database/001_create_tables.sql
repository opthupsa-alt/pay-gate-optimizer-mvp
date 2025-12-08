-- PayGate Optimizer - Database Schema
-- ====================================
-- Database: optg_pay
-- Run this first to create all tables

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- ==================== Users & Auth ====================

CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255),
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `emailVerified` DATETIME,
  `password` VARCHAR(255),
  `image` VARCHAR(255),
  `role` ENUM('admin', 'analyst', 'merchant') DEFAULT 'merchant',
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `accounts` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(191) NOT NULL,
  `type` VARCHAR(255) NOT NULL,
  `provider` VARCHAR(255) NOT NULL,
  `providerAccountId` VARCHAR(255) NOT NULL,
  `refresh_token` TEXT,
  `access_token` TEXT,
  `expires_at` INT,
  `token_type` VARCHAR(255),
  `scope` VARCHAR(255),
  `id_token` TEXT,
  `session_state` VARCHAR(255),
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `accounts_provider_providerAccountId` (`provider`, `providerAccountId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `sessions` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `sessionToken` VARCHAR(255) NOT NULL UNIQUE,
  `userId` VARCHAR(191) NOT NULL,
  `expires` DATETIME NOT NULL,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `verification_tokens` (
  `identifier` VARCHAR(255) NOT NULL,
  `token` VARCHAR(255) NOT NULL UNIQUE,
  `expires` DATETIME NOT NULL,
  UNIQUE KEY `verification_tokens_identifier_token` (`identifier`, `token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================== Core Tables ====================

CREATE TABLE IF NOT EXISTS `sectors` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `name_ar` VARCHAR(255) NOT NULL,
  `name_en` VARCHAR(255) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `payment_methods` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `name_ar` VARCHAR(255) NOT NULL,
  `name_en` VARCHAR(255) NOT NULL,
  `category` ENUM('card', 'debit', 'wallet', 'bank', 'bnpl', 'other') DEFAULT 'other',
  `icon_name` VARCHAR(100),
  `display_order` INT DEFAULT 0,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `capabilities` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `name_ar` VARCHAR(255) NOT NULL,
  `name_en` VARCHAR(255) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================== Providers ====================

CREATE TABLE IF NOT EXISTS `providers` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `name_ar` VARCHAR(255) NOT NULL,
  `name_en` VARCHAR(255) NOT NULL,
  `website_url` VARCHAR(500),
  `logo_path` VARCHAR(500),
  `description_ar` TEXT,
  `description_en` TEXT,
  `category` ENUM('payment_gateway', 'psp', 'acquirer', 'bnpl', 'aggregator', 'wallet') DEFAULT 'payment_gateway',
  `countries_served` JSON DEFAULT ('["SA"]'),
  `license_info` JSON DEFAULT ('{}'),
  `setup_fee` DECIMAL(10,2),
  `monthly_fee` DECIMAL(10,2),
  `activation_time_days_min` INT DEFAULT 1,
  `activation_time_days_max` INT DEFAULT 14,
  `settlement_days_min` INT DEFAULT 1,
  `settlement_days_max` INT DEFAULT 3,
  `payout_schedule` ENUM('daily', 'weekly', 'biweekly', 'monthly', 'custom') DEFAULT 'weekly',
  `payout_min_amount` DECIMAL(10,2),
  `support_channels` JSON DEFAULT ('[]'),
  `support_hours` VARCHAR(100),
  `support_sla` VARCHAR(100),
  `docs_url` VARCHAR(500),
  `terms_url` VARCHAR(500),
  `pricing_url` VARCHAR(500),
  `supported_currencies` JSON DEFAULT ('["SAR"]'),
  `multi_currency_supported` BOOLEAN DEFAULT FALSE,
  `risk_notes` TEXT,
  `rolling_reserve_percent` DECIMAL(5,2),
  `rolling_reserve_days` INT,
  `pros_ar` JSON DEFAULT ('[]'),
  `pros_en` JSON DEFAULT ('[]'),
  `cons_ar` JSON DEFAULT ('[]'),
  `cons_en` JSON DEFAULT ('[]'),
  `status` ENUM('active', 'limited', 'paused', 'deprecated') DEFAULT 'active',
  `notes_ar` TEXT,
  `notes_en` TEXT,
  `is_active` BOOLEAN DEFAULT TRUE,
  `last_verified_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================== Provider Relations ====================

CREATE TABLE IF NOT EXISTS `provider_payment_methods` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `provider_id` VARCHAR(191) NOT NULL,
  `payment_method_id` VARCHAR(191) NOT NULL,
  `is_supported` BOOLEAN DEFAULT TRUE,
  `enabled` BOOLEAN DEFAULT TRUE,
  `supports_recurring` BOOLEAN DEFAULT FALSE,
  `notes` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`provider_id`) REFERENCES `providers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `provider_payment_methods_unique` (`provider_id`, `payment_method_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `pricing_rules` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `provider_id` VARCHAR(191) NOT NULL,
  `payment_method_id` VARCHAR(191),
  `fee_percent` DECIMAL(5,4) NOT NULL,
  `fee_fixed` DECIMAL(10,2) NOT NULL,
  `monthly_fee` DECIMAL(10,2) DEFAULT 0,
  `setup_fee` DECIMAL(10,2) DEFAULT 0,
  `refund_fee_fixed` DECIMAL(10,2) DEFAULT 0,
  `chargeback_fee_fixed` DECIMAL(10,2) DEFAULT 0,
  `minimum_fee_per_txn` DECIMAL(10,2),
  `maximum_fee_per_txn` DECIMAL(10,2),
  `notes_ar` TEXT,
  `notes_en` TEXT,
  `effective_from` DATE,
  `effective_to` DATE,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`provider_id`) REFERENCES `providers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `provider_capabilities` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `provider_id` VARCHAR(191) NOT NULL,
  `capability_id` VARCHAR(191) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`provider_id`) REFERENCES `providers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`capability_id`) REFERENCES `capabilities`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `provider_capabilities_unique` (`provider_id`, `capability_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `provider_sector_rules` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `provider_id` VARCHAR(191) NOT NULL,
  `sector_id` VARCHAR(191) NOT NULL,
  `is_supported` BOOLEAN DEFAULT TRUE,
  `notes` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`provider_id`) REFERENCES `providers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`sector_id`) REFERENCES `sectors`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `provider_sector_rules_unique` (`provider_id`, `sector_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ops_metrics` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `provider_id` VARCHAR(191) NOT NULL UNIQUE,
  `onboarding_score` INT DEFAULT 70,
  `support_score` INT DEFAULT 70,
  `docs_score` INT DEFAULT 70,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`provider_id`) REFERENCES `providers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================== Extended Provider Tables ====================

CREATE TABLE IF NOT EXISTS `provider_fees` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `provider_id` VARCHAR(191) NOT NULL,
  `payment_method_id` VARCHAR(191),
  `fee_percent` DECIMAL(5,4) NOT NULL,
  `fee_fixed` DECIMAL(10,2) NOT NULL,
  `monthly_fee` DECIMAL(10,2) DEFAULT 0,
  `setup_fee` DECIMAL(10,2) DEFAULT 0,
  `refund_fee_fixed` DECIMAL(10,2) DEFAULT 0,
  `refund_fee_percent` DECIMAL(5,4) DEFAULT 0,
  `chargeback_fee_fixed` DECIMAL(10,2) DEFAULT 0,
  `cross_border_fee_percent` DECIMAL(5,4) DEFAULT 0,
  `currency_conversion_fee_percent` DECIMAL(5,4) DEFAULT 0,
  `payout_fee_fixed` DECIMAL(10,2) DEFAULT 0,
  `minimum_fee_per_txn` DECIMAL(10,2),
  `maximum_fee_per_txn` DECIMAL(10,2),
  `minimum_txn_amount` DECIMAL(10,2),
  `maximum_txn_amount` DECIMAL(10,2),
  `volume_tier` VARCHAR(100),
  `currency` VARCHAR(10) DEFAULT 'SAR',
  `notes_ar` TEXT,
  `notes_en` TEXT,
  `is_estimated` BOOLEAN DEFAULT FALSE,
  `source_url` VARCHAR(500),
  `effective_from` DATE,
  `effective_to` DATE,
  `is_active` BOOLEAN DEFAULT TRUE,
  `last_verified_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`provider_id`) REFERENCES `providers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `provider_integrations` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `provider_id` VARCHAR(191) NOT NULL,
  `platform` ENUM('shopify', 'woocommerce', 'magento', 'opencart', 'prestashop', 'salla', 'zid', 'expandcart', 'youcan', 'wordpress', 'custom_api', 'hosted_checkout', 'mobile_sdk', 'pos') NOT NULL,
  `integration_type` ENUM('plugin', 'api', 'hosted', 'redirect', 'sdk', 'iframe') NOT NULL,
  `is_official` BOOLEAN DEFAULT TRUE,
  `official_url` VARCHAR(500),
  `docs_url` VARCHAR(500),
  `setup_difficulty` ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
  `features_supported` JSON DEFAULT ('[]'),
  `notes_ar` TEXT,
  `notes_en` TEXT,
  `is_active` BOOLEAN DEFAULT TRUE,
  `last_verified_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`provider_id`) REFERENCES `providers`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `provider_integrations_unique` (`provider_id`, `platform`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `provider_currencies` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `provider_id` VARCHAR(191) NOT NULL,
  `currency_code` VARCHAR(10) NOT NULL,
  `is_settlement_supported` BOOLEAN DEFAULT TRUE,
  `is_pricing_supported` BOOLEAN DEFAULT TRUE,
  `conversion_fee_percent` DECIMAL(5,4) DEFAULT 0,
  `notes` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`provider_id`) REFERENCES `providers`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `provider_currencies_unique` (`provider_id`, `currency_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `provider_sources` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `entity_type` VARCHAR(50) NOT NULL,
  `entity_id` VARCHAR(191) NOT NULL,
  `source_type` ENUM('official_website', 'official_docs', 'official_pricing', 'review_platform', 'user_report', 'api_response', 'support_confirmation') NOT NULL,
  `source_url` VARCHAR(500) NOT NULL,
  `source_name` VARCHAR(255),
  `extracted_fields` JSON DEFAULT ('{}'),
  `screenshot_path` VARCHAR(500),
  `is_estimated` BOOLEAN DEFAULT FALSE,
  `confidence_level` ENUM('high', 'medium', 'low') DEFAULT 'medium',
  `notes` TEXT,
  `verified_by` VARCHAR(100),
  `last_verified_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`entity_id`) REFERENCES `providers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `provider_reviews` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `provider_id` VARCHAR(191) NOT NULL,
  `platform` ENUM('trustpilot', 'g2', 'capterra', 'google_play', 'app_store', 'twitter', 'reddit', 'internal', 'other') NOT NULL,
  `rating_avg` DECIMAL(3,2),
  `rating_count` INT DEFAULT 0,
  `rating_max` INT DEFAULT 5,
  `highlights_positive` JSON DEFAULT ('[]'),
  `highlights_negative` JSON DEFAULT ('[]'),
  `sample_reviews` JSON DEFAULT ('[]'),
  `source_url` VARCHAR(500) NOT NULL,
  `last_verified_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`provider_id`) REFERENCES `providers`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `provider_reviews_unique` (`provider_id`, `platform`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `provider_wallets` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `provider_id` VARCHAR(191) NOT NULL,
  `wallet_type` ENUM('apple_pay', 'google_pay', 'samsung_pay', 'stc_pay', 'urpay', 'mobily_pay', 'paypal', 'other') NOT NULL,
  `is_supported` BOOLEAN DEFAULT TRUE,
  `fee_percent` DECIMAL(5,4),
  `fee_fixed` DECIMAL(10,2),
  `requirements` TEXT,
  `notes_ar` TEXT,
  `notes_en` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`provider_id`) REFERENCES `providers`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `provider_wallets_unique` (`provider_id`, `wallet_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `provider_bnpl` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `provider_id` VARCHAR(191) NOT NULL,
  `bnpl_provider` ENUM('tabby', 'tamara', 'postpay', 'spotii', 'cashew', 'splitit', 'other') NOT NULL,
  `is_integrated` BOOLEAN DEFAULT TRUE,
  `merchant_fee_percent` DECIMAL(5,4),
  `merchant_fee_fixed` DECIMAL(10,2) DEFAULT 0,
  `max_installments` INT DEFAULT 4,
  `min_order_amount` DECIMAL(10,2),
  `max_order_amount` DECIMAL(10,2),
  `settlement_days` INT,
  `notes_ar` TEXT,
  `notes_en` TEXT,
  `integration_url` VARCHAR(500),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`provider_id`) REFERENCES `providers`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `provider_bnpl_unique` (`provider_id`, `bnpl_provider`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================== Wizard & Recommendations ====================

CREATE TABLE IF NOT EXISTS `scoring_weights` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `factor` VARCHAR(50) NOT NULL UNIQUE,
  `weight` INT DEFAULT 25,
  `description` TEXT,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `wizard_runs` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `locale` VARCHAR(10) DEFAULT 'ar',
  `ip_hash` VARCHAR(64),
  `sector_id` VARCHAR(191),
  `business_type` VARCHAR(100),
  `monthly_gmv` DECIMAL(15,2),
  `tx_count` INT,
  `avg_ticket` DECIMAL(10,2),
  `refunds_rate` DECIMAL(5,4) DEFAULT 0,
  `chargebacks_rate` DECIMAL(5,4) DEFAULT 0,
  `payment_mix` JSON DEFAULT ('{}'),
  `needs` JSON DEFAULT ('{}'),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`sector_id`) REFERENCES `sectors`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `recommendations` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `wizard_run_id` VARCHAR(191) NOT NULL,
  `provider_id` VARCHAR(191) NOT NULL,
  `rank` INT NOT NULL,
  `expected_cost_min` DECIMAL(15,2) NOT NULL,
  `expected_cost_max` DECIMAL(15,2) NOT NULL,
  `breakdown` JSON DEFAULT ('[]'),
  `score_total` INT NOT NULL,
  `score_cost` INT NOT NULL,
  `score_fit` INT NOT NULL,
  `score_ops` INT NOT NULL,
  `score_risk` INT NOT NULL,
  `reasons` JSON DEFAULT ('[]'),
  `caveats` JSON DEFAULT ('[]'),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`wizard_run_id`) REFERENCES `wizard_runs`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`provider_id`) REFERENCES `providers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================== Leads ====================

CREATE TABLE IF NOT EXISTS `leads` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `wizard_run_id` VARCHAR(191),
  `name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50),
  `email` VARCHAR(255),
  `company_name` VARCHAR(255),
  `city` VARCHAR(100),
  `preferred_contact` VARCHAR(50) DEFAULT 'email',
  `notes` TEXT,
  `status` ENUM('new', 'contacted', 'qualified', 'won', 'lost') DEFAULT 'new',
  `owner_user_id` VARCHAR(191),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`wizard_run_id`) REFERENCES `wizard_runs`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`owner_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================== Audit Log ====================

CREATE TABLE IF NOT EXISTS `audit_log` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `table_name` VARCHAR(100) NOT NULL,
  `record_id` VARCHAR(191) NOT NULL,
  `action` VARCHAR(50) NOT NULL,
  `old_values` JSON,
  `new_values` JSON,
  `user_id` VARCHAR(191),
  `ip_address` VARCHAR(45),
  `user_agent` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================== Indexes ====================

CREATE INDEX idx_providers_slug ON providers(slug);
CREATE INDEX idx_providers_is_active ON providers(is_active);
CREATE INDEX idx_providers_category ON providers(category);
CREATE INDEX idx_wizard_runs_created ON wizard_runs(created_at);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created ON leads(created_at);
CREATE INDEX idx_audit_log_table ON audit_log(table_name);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);

