<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class InstallSortieModule extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sortie:install {--seed : Run seeders with sample data}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Install the Sortie (Sales Delivery) module';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🚀 Installing Sortie Module...');

        // Step 1: Run migrations
        $this->info('📦 Running migrations...');
        Artisan::call('migrate', [], $this->getOutput());

        // Step 2: Install permissions
        $this->info('🔐 Installing permissions...');
        Artisan::call('db:seed', ['--class' => 'AssignSortiePermissionsSeeder'], $this->getOutput());

        // Step 3: Optionally run sample data seeder
        if ($this->option('seed')) {
            $this->info('🌱 Seeding sample data...');
            Artisan::call('db:seed', ['--class' => 'SortieSeeder'], $this->getOutput());
        }

        $this->newLine();
        $this->info('✅ Sortie Module installed successfully!');
        $this->newLine();

        // Display summary
        $this->table(
            ['Component', 'Status'],
            [
                ['Database Tables', '✅ Created (sorties, sortie_products)'],
                ['Models', '✅ Created (Sortie, SortieProduct)'],
                ['Controller', '✅ Created (SortieController)'],
                ['Routes', '✅ Registered (/sorties, API routes)'],
                ['Permissions', '✅ Created and assigned to super-admin'],
                ['Frontend Components', '✅ Created (React/TypeScript)'],
                ['Observers', '✅ Registered (Stock management)'],
                ['Sample Data', $this->option('seed') ? '✅ Created' : '⏭️ Skipped'],
            ]
        );

        $this->newLine();
        $this->info('📖 Next steps:');
        $this->line('   • Visit /sorties to access the module');
        $this->line('   • Ensure you have commerciaux, clients, and products data');
        $this->line('   • Check permissions for non-admin users');
        $this->newLine();

        return Command::SUCCESS;
    }
}