<?php
/**
 * PayGate Optimizer - Database Setup Script
 * =========================================
 * This script creates tables and seeds initial data
 * Run once: https://pay.op-tg.com/setup-database.php
 * Then DELETE this file for security!
 */

// Security check - only allow from specific IPs or with a secret key
$secretKey = isset($_GET['key']) ? $_GET['key'] : '';
if ($secretKey !== 'PayGateSetup2025') {
    die('Access denied. Use: ?key=PayGateSetup2025');
}

// Database configuration
$host = 'localhost';
$dbname = 'optg_pay';
$username = 'optg_pay';
$password = ''; // ADD YOUR PASSWORD HERE

echo "<pre style='font-family: monospace; background: #1a1a2e; color: #eee; padding: 20px;'>";
echo "╔═══════════════════════════════════════════════════╗\n";
echo "║  PayGate Optimizer - Database Setup              ║\n";
echo "╚═══════════════════════════════════════════════════╝\n\n";

try {
    // Connect to database
    echo "[1/4] Connecting to database...\n";
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
    echo "      ✓ Connected successfully\n\n";

    // Read and execute create tables SQL
    echo "[2/4] Creating tables...\n";
    $createTablesSQL = file_get_contents(__DIR__ . '/database/001_create_tables.sql');
    if (!$createTablesSQL) {
        throw new Exception('Cannot read 001_create_tables.sql');
    }
    
    // Split by semicolon and execute each statement
    $statements = array_filter(array_map('trim', explode(';', $createTablesSQL)));
    $tableCount = 0;
    foreach ($statements as $statement) {
        if (!empty($statement) && !preg_match('/^(SET|CREATE INDEX)/i', $statement)) {
            if (preg_match('/CREATE TABLE/i', $statement)) {
                $pdo->exec($statement);
                $tableCount++;
            }
        }
    }
    echo "      ✓ Created $tableCount tables\n\n";

    // Execute indexes
    echo "[3/4] Creating indexes...\n";
    foreach ($statements as $statement) {
        if (!empty($statement) && preg_match('/^CREATE INDEX/i', $statement)) {
            try {
                $pdo->exec($statement);
            } catch (PDOException $e) {
                // Index might already exist
            }
        }
    }
    echo "      ✓ Indexes created\n\n";

    // Read and execute seed data SQL
    echo "[4/4] Seeding data...\n";
    $seedDataSQL = file_get_contents(__DIR__ . '/database/002_seed_data.sql');
    if (!$seedDataSQL) {
        throw new Exception('Cannot read 002_seed_data.sql');
    }
    
    // Execute seed data
    $statements = array_filter(array_map('trim', explode(';', $seedDataSQL)));
    $insertCount = 0;
    foreach ($statements as $statement) {
        if (!empty($statement) && preg_match('/^INSERT/i', $statement)) {
            try {
                $pdo->exec($statement);
                $insertCount++;
            } catch (PDOException $e) {
                // Record might already exist
                if (strpos($e->getMessage(), 'Duplicate') === false) {
                    echo "      Warning: " . $e->getMessage() . "\n";
                }
            }
        }
    }
    echo "      ✓ Inserted $insertCount records\n\n";

    // Verify setup
    echo "═══════════════════════════════════════════════════\n";
    echo "Verification:\n";
    
    $tables = ['users', 'providers', 'payment_methods', 'sectors'];
    foreach ($tables as $table) {
        $count = $pdo->query("SELECT COUNT(*) FROM `$table`")->fetchColumn();
        echo "  • $table: $count records\n";
    }

    echo "\n═══════════════════════════════════════════════════\n";
    echo "✅ DATABASE SETUP COMPLETED SUCCESSFULLY!\n";
    echo "═══════════════════════════════════════════════════\n\n";
    
    echo "Admin Login:\n";
    echo "  📧 Email: admin@op-tg.com\n";
    echo "  🔑 Password: PayGate@2025\n\n";
    
    echo "⚠️  IMPORTANT: Delete this file now for security!\n";
    echo "    rm /path/to/setup-database.php\n";
    echo "</pre>";

} catch (PDOException $e) {
    echo "❌ Database Error: " . $e->getMessage() . "\n";
    echo "</pre>";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "</pre>";
}
?>

